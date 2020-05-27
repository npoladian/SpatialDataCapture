/** @license
 *
 *  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
 *  Michigan Tech Research Institute (MTRI)
 *  3600 Green Court, Suite 100, Ann Arbor, MI, 48105
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @augments Wkt.Wkt
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */


 (function (root, factory) {

     if (typeof define === "function" && define.amd) {
         // AMD (+ global for extensions)
         define(function () {
             return factory();
         });
     } else if (typeof module !== 'undefined' && typeof exports === "object") {
         // CommonJS
         module.exports = factory();
     } else {
         // Browser
         root.Wkt = factory();
     }
 }(this, function () {


     var beginsWith, endsWith, root, Wkt;

     // Establish the root object, window in the browser, or exports on the server
     root = this;

     /**
      * @desc The Wkt namespace.
      * @property    {String}    delimiter   - The default delimiter for separating components of atomic geometry (coordinates)
      * @namespace
      * @global
      */
     Wkt = function (obj) {
         if (obj instanceof Wkt) return obj;
         if (!(this instanceof Wkt)) return new Wkt(obj);
         this._wrapped = obj;
     };



     /**
      * Returns true if the substring is found at the beginning of the string.
      * @param   str {String}    The String to search
      * @param   sub {String}    The substring of interest
      * @return      {Boolean}
      * @private
      */
     beginsWith = function (str, sub) {
         return str.substring(0, sub.length) === sub;
     };

     /**
      * Returns true if the substring is found at the end of the string.
      * @param   str {String}    The String to search
      * @param   sub {String}    The substring of interest
      * @return      {Boolean}
      * @private
      */
     endsWith = function (str, sub) {
         return str.substring(str.length - sub.length) === sub;
     };

     /**
      * The default delimiter for separating components of atomic geometry (coordinates)
      * @ignore
      */
     Wkt.delimiter = ' ';

     /**
      * Determines whether or not the passed Object is an Array.
      * @param   obj {Object}    The Object in question
      * @return      {Boolean}
      * @member Wkt.isArray
      * @method
      */
     Wkt.isArray = function (obj) {
         return !!(obj && obj.constructor === Array);
     };

     /**
      * Removes given character String(s) from a String.
      * @param   str {String}    The String to search
      * @param   sub {String}    The String character(s) to trim
      * @return      {String}    The trimmed string
      * @member Wkt.trim
      * @method
      */
     Wkt.trim = function (str, sub) {
         sub = sub || ' '; // Defaults to trimming spaces
         // Trim beginning spaces
         while (beginsWith(str, sub)) {
             str = str.substring(1);
         }
         // Trim ending spaces
         while (endsWith(str, sub)) {
             str = str.substring(0, str.length - 1);
         }
         return str;
     };

     /**
      * An object for reading WKT strings and writing geographic features
      * @constructor this.Wkt.Wkt
      * @param   initializer {String}    An optional WKT string for immediate read
      * @property            {Array}     components      - Holder for atomic geometry objects (internal representation of geometric components)
      * @property            {String}    delimiter       - The default delimiter for separating components of atomic geometry (coordinates)
      * @property            {Object}    regExes         - Some regular expressions copied from OpenLayers.Format.WKT.js
      * @property            {String}    type            - The Well-Known Text name (e.g. 'point') of the geometry
      * @property            {Boolean}   wrapVerticies   - True to wrap vertices in MULTIPOINT geometries; If true: MULTIPOINT((30 10),(10 30),(40 40)); If false: MULTIPOINT(30 10,10 30,40 40)
      * @return              {this.Wkt.Wkt}
      * @memberof Wkt
      */
     Wkt.Wkt = function (initializer) {

         /**
          * The default delimiter between X and Y coordinates.
          * @ignore
          */
         this.delimiter = Wkt.delimiter || ' ';

         /**
          * Configuration parameter for controlling how Wicket seralizes
          * MULTIPOINT strings. Examples; both are valid WKT:
          * If true: MULTIPOINT((30 10),(10 30),(40 40))
          * If false: MULTIPOINT(30 10,10 30,40 40)
          * @ignore
          */
         this.wrapVertices = true;

         /**
          * Some regular expressions copied from OpenLayers.Format.WKT.js
          * @ignore
          */
         this.regExes = {
             'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
             'spaces': /\s+|\+/, // Matches the '+' or the empty space
             'numeric': /-*\d+(\.*\d+)?/,
             'comma': /\s*,\s*/,
             'parenComma': /\)\s*,\s*\(/,
             'coord': /-*\d+\.*\d+ -*\d+\.*\d+/, // e.g. "24 -14"
             'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
             'ogcTypes': /^(multi)?(point|line|polygon|box)?(string)?$/i, // Captures e.g. "Multi","Line","String"
             'crudeJson': /^{.*"(type|coordinates|geometries|features)":.*}$/ // Attempts to recognize JSON strings
         };

         /**
          * Strip any whitespace and parens from front and back.
          * This is the equivalent of s/^\s*\(?(.*)\)?\s*$/$1/ but without the risk of catastrophic backtracking.
          * @param   str {String}
          */
         this._stripWhitespaceAndParens = function (fullStr) {
             var trimmed = fullStr.trim();
             var noParens = trimmed.replace(/^\(?(.*?)\)?$/, '$1');
             return noParens;
         };

         /**
          * The internal representation of geometry--the "components" of geometry.
          * @ignore
          */
         this.components = undefined;

         // An initial WKT string may be provided
         if (initializer && typeof initializer === 'string') {
             this.read(initializer);
         } else if (initializer && typeof initializer !== undefined) {
             this.fromObject(initializer);
         }

     };



     /**
      * Returns true if the internal geometry is a collection of geometries.
      * @return  {Boolean}   Returns true when it is a collection
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.isCollection = function () {
         switch (this.type.slice(0, 5)) {
             case 'multi':
                 // Trivial; any multi-geometry is a collection
                 return true;
             case 'polyg':
                 // Polygons with holes are "collections" of rings
                 return true;
             default:
                 // Any other geometry is not a collection
                 return false;
         }
     };

     /**
      * Compares two x,y coordinates for equality.
      * @param   a   {Object}    An object with x and y properties
      * @param   b   {Object}    An object with x and y properties
      * @return      {Boolean}
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.sameCoords = function (a, b) {
         return (a.x === b.x && a.y === b.y);
     };

     /**
      * Sets internal geometry (components) from framework geometry (e.g.
      * Google Polygon objects or google.maps.Polygon).
      * @param   obj {Object}    The framework-dependent geometry representation
      * @return      {this.Wkt.Wkt}   The object itself
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.fromObject = function (obj) {
         var result;

         if (obj.hasOwnProperty('type') && obj.hasOwnProperty('coordinates')) {
             result = this.fromJson(obj);
         } else {
             result = this.deconstruct.call(this, obj);
         }

         this.components = result.components;
         this.isRectangle = result.isRectangle || false;
         this.type = result.type;
         return this;
     };

     /**
      * Creates external geometry objects based on a plug-in framework's
      * construction methods and available geometry classes.
      * @param   config  {Object}    An optional framework-dependent properties specification
      * @return          {Object}    The framework-dependent geometry representation
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.toObject = function (config) {
         var obj = this.construct[this.type].call(this, config);
         // Don't assign the "properties" property to an Array
         if (typeof obj === 'object' && !Wkt.isArray(obj)) {
             obj.properties = this.properties;
         }
         return obj;
     };

     /**
      * Returns the WKT string representation; the same as the write() method.
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.toString = function (config) {
         return this.write();
     };

     /**
      * Parses a JSON representation as an Object.
      * @param	obj	{Object}	An Object with the GeoJSON schema
      * @return	{this.Wkt.Wkt}	The object itself
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.fromJson = function (obj) {
         var i, j, k, coords, iring, oring;

         this.type = obj.type.toLowerCase();
         this.components = [];
         if (obj.hasOwnProperty('geometry')) { //Feature
             this.fromJson(obj.geometry);
             this.properties = obj.properties;
             return this;
         }
         coords = obj.coordinates;

         if (!Wkt.isArray(coords[0])) { // Point
             this.components.push({
                 x: coords[0],
                 y: coords[1]
             });

         } else {

             for (i in coords) {
                 if (coords.hasOwnProperty(i)) {

                     if (!Wkt.isArray(coords[i][0])) { // LineString

                         if (this.type === 'multipoint') { // MultiPoint
                             this.components.push([{
                                 x: coords[i][0],
                                 y: coords[i][1]
                             }]);

                         } else {
                             this.components.push({
                                 x: coords[i][0],
                                 y: coords[i][1]
                             });

                         }

                     } else {

                         oring = [];
                         for (j in coords[i]) {
                             if (coords[i].hasOwnProperty(j)) {

                                 if (!Wkt.isArray(coords[i][j][0])) {
                                     oring.push({
                                         x: coords[i][j][0],
                                         y: coords[i][j][1]
                                     });

                                 } else {

                                     iring = [];
                                     for (k in coords[i][j]) {
                                         if (coords[i][j].hasOwnProperty(k)) {

                                             iring.push({
                                                 x: coords[i][j][k][0],
                                                 y: coords[i][j][k][1]
                                             });

                                         }
                                     }

                                     oring.push(iring);

                                 }

                             }
                         }

                         this.components.push(oring);
                     }
                 }
             }

         }

         return this;
     };

     /**
      * Creates a JSON representation, with the GeoJSON schema, of the geometry.
      * @return    {Object}    The corresponding GeoJSON representation
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.toJson = function () {
         var cs, json, i, j, k, ring, rings;

         cs = this.components;
         json = {
             coordinates: [],
             type: (function () {
                 var i, type, s;

                 type = this.regExes.ogcTypes.exec(this.type).slice(1);
                 s = [];

                 for (i in type) {
                     if (type.hasOwnProperty(i)) {
                         if (type[i] !== undefined) {
                             s.push(type[i].toLowerCase().slice(0, 1).toUpperCase() + type[i].toLowerCase().slice(1));
                         }
                     }
                 }

                 return s;
             }.call(this)).join('')
         }

         // Wkt BOX type gets a special bbox property in GeoJSON
         if (this.type.toLowerCase() === 'box') {
             json.type = 'Polygon';
             json.bbox = [];

             for (i in cs) {
                 if (cs.hasOwnProperty(i)) {
                     json.bbox = json.bbox.concat([cs[i].x, cs[i].y]);
                 }
             }

             json.coordinates = [
                 [
                     [cs[0].x, cs[0].y],
                     [cs[0].x, cs[1].y],
                     [cs[1].x, cs[1].y],
                     [cs[1].x, cs[0].y],
                     [cs[0].x, cs[0].y]
                 ]
             ];

             return json;
         }

         // For the coordinates of most simple features
         for (i in cs) {
             if (cs.hasOwnProperty(i)) {

                 // For those nested structures
                 if (Wkt.isArray(cs[i])) {
                     rings = [];

                     for (j in cs[i]) {
                         if (cs[i].hasOwnProperty(j)) {

                             if (Wkt.isArray(cs[i][j])) { // MULTIPOLYGONS
                                 ring = [];

                                 for (k in cs[i][j]) {
                                     if (cs[i][j].hasOwnProperty(k)) {
                                         ring.push([cs[i][j][k].x, cs[i][j][k].y]);
                                     }
                                 }

                                 rings.push(ring);

                             } else { // POLYGONS and MULTILINESTRINGS

                                 if (cs[i].length > 1) {
                                     rings.push([cs[i][j].x, cs[i][j].y]);

                                 } else { // MULTIPOINTS
                                     rings = rings.concat([cs[i][j].x, cs[i][j].y]);
                                 }
                             }
                         }
                     }

                     json.coordinates.push(rings);

                 } else {
                     if (cs.length > 1) { // For LINESTRING type
                         json.coordinates.push([cs[i].x, cs[i].y]);

                     } else { // For POINT type
                         json.coordinates = json.coordinates.concat([cs[i].x, cs[i].y]);
                     }
                 }

             }
         }

         return json;
     };

     /**
      * Absorbs the geometry of another this.Wkt.Wkt instance, merging it with its own,
      * creating a collection (MULTI-geometry) based on their types, which must agree.
      * For example, creates a MULTIPOLYGON from a POLYGON type merged with another
      * POLYGON type, or adds a POLYGON instance to a MULTIPOLYGON instance.
      * @param   wkt {String}    A Wkt.Wkt object
      * @return	{this.Wkt.Wkt}	The object itself
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.merge = function (wkt) {
         var prefix = this.type.slice(0, 5);

         if (this.type !== wkt.type) {
             if (this.type.slice(5, this.type.length) !== wkt.type) {
                 throw TypeError('The input geometry types must agree or the calling this.Wkt.Wkt instance must be a multigeometry of the other');
             }
         }

         switch (prefix) {

             case 'point':
                 this.components = [this.components.concat(wkt.components)];
                 break;

             case 'multi':
                 this.components = this.components.concat((wkt.type.slice(0, 5) === 'multi') ? wkt.components : [wkt.components]);
                 break;

             default:
                 this.components = [
                     this.components,
                     wkt.components
                 ];
                 break;

         }

         if (prefix !== 'multi') {
             this.type = 'multi' + this.type;
         }
         return this;
     };

     /**
      * Reads a WKT string, validating and incorporating it.
      * @param   str {String}    A WKT or GeoJSON string
      * @return	{this.Wkt.Wkt}	The object itself
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.read = function (str) {
         var matches;
         matches = this.regExes.typeStr.exec(str);
         if (matches) {
             this.type = matches[1].toLowerCase();
             this.base = matches[2];
             if (this.ingest[this.type]) {
                 this.components = this.ingest[this.type].apply(this, [this.base]);
             }

         } else {
             if (this.regExes.crudeJson.test(str)) {
                 if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
                     this.fromJson(JSON.parse(str));

                 } else {
                     console.log('JSON.parse() is not available; cannot parse GeoJSON strings');
                     throw {
                         name: 'JSONError',
                         message: 'JSON.parse() is not available; cannot parse GeoJSON strings'
                     };
                 }

             } else {
                 console.log('Invalid WKT string provided to read()');
                 throw {
                     name: 'WKTError',
                     message: 'Invalid WKT string provided to read()'
                 };
             }
         }

         return this;
     }; // eo readWkt

     /**
      * Writes a WKT string.
      * @param   components  {Array}     An Array of internal geometry objects
      * @return              {String}    The corresponding WKT representation
      * @memberof this.Wkt.Wkt
      * @method
      */
     Wkt.Wkt.prototype.write = function (components) {
         var i, pieces, data;

         components = components || this.components;

         pieces = [];

         pieces.push(this.type.toUpperCase() + '(');

         for (i = 0; i < components.length; i += 1) {
             if (this.isCollection() && i > 0) {
                 pieces.push(',');
             }

             // There should be an extract function for the named type
             if (!this.extract[this.type]) {
                 return null;
             }

             data = this.extract[this.type].apply(this, [components[i]]);
             if (this.isCollection() && this.type !== 'multipoint') {
                 pieces.push('(' + data + ')');

             } else {
                 pieces.push(data);

                 // If not at the end of the components, add a comma
                 if (i !== (components.length - 1) && this.type !== 'multipoint') {
                     pieces.push(',');
                 }

             }
         }

         pieces.push(')');

         return pieces.join('');
     };

     /**
      * This object contains functions as property names that extract WKT
      * strings from the internal representation.
      * @memberof this.Wkt.Wkt
      * @namespace this.Wkt.Wkt.extract
      * @instance
      */
     Wkt.Wkt.prototype.extract = {
         /**
          * Return a WKT string representing atomic (point) geometry
          * @param   point   {Object}    An object with x and y properties
          * @return          {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         point: function (point) {
             return String(point.x) + this.delimiter + String(point.y);
         },

         /**
          * Return a WKT string representing multiple atoms (points)
          * @param   multipoint  {Array}     Multiple x-and-y objects
          * @return              {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         multipoint: function (multipoint) {
             var i, parts = [],
                 s;

             for (i = 0; i < multipoint.length; i += 1) {
                 s = this.extract.point.apply(this, [multipoint[i]]);

                 if (this.wrapVertices) {
                     s = '(' + s + ')';
                 }

                 parts.push(s);
             }

             return parts.join(',');
         },

         /**
          * Return a WKT string representing a chain (linestring) of atoms
          * @param   linestring  {Array}     Multiple x-and-y objects
          * @return              {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         linestring: function (linestring) {
             // Extraction of linestrings is the same as for points
             return this.extract.point.apply(this, [linestring]);
         },

         /**
          * Return a WKT string representing multiple chains (multilinestring) of atoms
          * @param   multilinestring {Array}     Multiple of multiple x-and-y objects
          * @return                  {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         multilinestring: function (multilinestring) {
             var i, parts = [];

             if (multilinestring.length) {
                 for (i = 0; i < multilinestring.length; i += 1) {
                     parts.push(this.extract.linestring.apply(this, [multilinestring[i]]));
                 }
             } else {
                 parts.push(this.extract.point.apply(this, [multilinestring]));
             }

             return parts.join(',');
         },

         /**
          * Return a WKT string representing multiple atoms in closed series (polygon)
          * @param   polygon {Array}     Collection of ordered x-and-y objects
          * @return          {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         polygon: function (polygon) {
             // Extraction of polygons is the same as for multilinestrings
             return this.extract.multilinestring.apply(this, [polygon]);
         },

         /**
          * Return a WKT string representing multiple closed series (multipolygons) of multiple atoms
          * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
          * @return                  {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         multipolygon: function (multipolygon) {
             var i, parts = [];
             for (i = 0; i < multipolygon.length; i += 1) {
                 parts.push('(' + this.extract.polygon.apply(this, [multipolygon[i]]) + ')');
             }
             return parts.join(',');
         },

         /**
          * Return a WKT string representing a 2DBox
          * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
          * @return                  {String}    The WKT representation
          * @memberof this.Wkt.Wkt.extract
          * @instance
          */
         box: function (box) {
             return this.extract.linestring.apply(this, [box]);
         },

         geometrycollection: function (str) {
             console.log('The geometrycollection WKT type is not yet supported.');
         }
     };

     /**
      * This object contains functions as property names that ingest WKT
      * strings into the internal representation.
      * @memberof this.Wkt.Wkt
      * @namespace this.Wkt.Wkt.ingest
      * @instance
      */
     Wkt.Wkt.prototype.ingest = {

         /**
          * Return point feature given a point WKT fragment.
          * @param   str {String}    A WKT fragment representing the point
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         point: function (str) {
             var coords = Wkt.trim(str).split(this.regExes.spaces);
             // In case a parenthetical group of coordinates is passed...
             return [{ // ...Search for numeric substrings
                 x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
                 y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
             }];
         },

         /**
          * Return a multipoint feature given a multipoint WKT fragment.
          * @param   str {String}    A WKT fragment representing the multipoint
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         multipoint: function (str) {
             var i, components, points;
             components = [];
             points = Wkt.trim(str).split(this.regExes.comma);
             for (i = 0; i < points.length; i += 1) {
                 components.push(this.ingest.point.apply(this, [points[i]]));
             }
             return components;
         },

         /**
          * Return a linestring feature given a linestring WKT fragment.
          * @param   str {String}    A WKT fragment representing the linestring
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         linestring: function (str) {
             var i, multipoints, components;

             // In our x-and-y representation of components, parsing
             //  multipoints is the same as parsing linestrings
             multipoints = this.ingest.multipoint.apply(this, [str]);

             // However, the points need to be joined
             components = [];
             for (i = 0; i < multipoints.length; i += 1) {
                 components = components.concat(multipoints[i]);
             }
             return components;
         },

         /**
          * Return a multilinestring feature given a multilinestring WKT fragment.
          * @param   str {String}    A WKT fragment representing the multilinestring
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         multilinestring: function (str) {
             var i, components, line, lines;
             components = [];

             lines = Wkt.trim(str).split(this.regExes.doubleParenComma);
             if (lines.length === 1) { // If that didn't work...
                 lines = Wkt.trim(str).split(this.regExes.parenComma);
             }

             for (i = 0; i < lines.length; i += 1) {
                 line = this._stripWhitespaceAndParens(lines[i]);
                 components.push(this.ingest.linestring.apply(this, [line]));
             }

             return components;
         },

         /**
          * Return a polygon feature given a polygon WKT fragment.
          * @param   str {String}    A WKT fragment representing the polygon
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         polygon: function (str) {
             var i, j, components, subcomponents, ring, rings;
             rings = Wkt.trim(str).split(this.regExes.parenComma);
             components = []; // Holds one or more rings
             for (i = 0; i < rings.length; i += 1) {
                 ring = this._stripWhitespaceAndParens(rings[i]).split(this.regExes.comma);
                 subcomponents = []; // Holds the outer ring and any inner rings (holes)
                 for (j = 0; j < ring.length; j += 1) {
                     // Split on the empty space or '+' character (between coordinates)
                     var split = ring[j].split(this.regExes.spaces);
                     if (split.length > 2) {
                         //remove the elements which are blanks
                         split = split.filter(function (n) {
                             return n != ""
                         });
                     }
                     if (split.length === 2) {
                         var x_cord = split[0];
                         var y_cord = split[1];

                         //now push
                         subcomponents.push({
                             x: parseFloat(x_cord),
                             y: parseFloat(y_cord)
                         });
                     }
                 }
                 components.push(subcomponents);
             }
             return components;
         },

         /**
          * Return box vertices (which would become the Rectangle bounds) given a Box WKT fragment.
          * @param   str {String}    A WKT fragment representing the box
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         box: function (str) {
             var i, multipoints, components;

             // In our x-and-y representation of components, parsing
             //  multipoints is the same as parsing linestrings
             multipoints = this.ingest.multipoint.apply(this, [str]);

             // However, the points need to be joined
             components = [];
             for (i = 0; i < multipoints.length; i += 1) {
                 components = components.concat(multipoints[i]);
             }

             return components;
         },

         /**
          * Return a multipolygon feature given a multipolygon WKT fragment.
          * @param   str {String}    A WKT fragment representing the multipolygon
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         multipolygon: function (str) {
             var i, components, polygon, polygons;
             components = [];
             polygons = Wkt.trim(str).split(this.regExes.doubleParenComma);
             for (i = 0; i < polygons.length; i += 1) {
                 polygon = this._stripWhitespaceAndParens(polygons[i]);
                 components.push(this.ingest.polygon.apply(this, [polygon]));
             }
             return components;
         },

         /**
          * Return an array of features given a geometrycollection WKT fragment.
          * @param   str {String}    A WKT fragment representing the geometry collection
          * @memberof this.Wkt.Wkt.ingest
          * @instance
          */
         geometrycollection: function (str) {
             console.log('The geometrycollection WKT type is not yet supported.');
         }

     }; // eo ingest

     return Wkt;
 }));


(function ( root, factory ) {
    if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = factory( require('./wicket') );
    } else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( ['wicket'], factory);
    } else {
        // Browser globals
        factory(root.Wkt );
    }
}
(this, function(Wkt) {
    Wkt.Wkt.prototype.isRectangle = false;

    /**
     * @augments Wkt.Wkt
     * Truncates an Array of coordinates by the closing coordinate when it is
     * equal to the first coordinate given--this is only to be used for closed
     * geometries in order to provide merely an "implied" closure to Leaflet.
     * @param   coords  {Array}     An Array of x,y coordinates (objects)
     * @return          {Array}
     */
    Wkt.Wkt.prototype.trunc = function (coords) {
        var i, verts = [];

        for (i = 0; i < coords.length; i += 1) {
            if (Wkt.isArray(coords[i])) {
                verts.push(this.trunc(coords[i]));

            } else {

                // Add the first coord, but skip the last if it is identical
                if (i === 0 || !this.sameCoords(coords[0], coords[i])) {
                    verts.push(coords[i]);
                }
            }
        }

        return verts;
    };

    /**
     * @augments Wkt.Wkt
     * An object of framework-dependent construction methods used to generate
     * objects belonging to the various geometry classes of the framework.
     */
    Wkt.Wkt.prototype.construct = {
        /**
         * Creates the framework's equivalent point geometry object.
         * @param   config      {Object}    An optional properties hash the object should use
         * @param   component   {Object}    An optional component to build from
         * @return              {L.marker}
         */
        point: function (config, component) {
            var coord = component || this.components;
            if (coord instanceof Array) {
                coord = coord[0];
            }

            return L.marker(this.coordsToLatLng(coord), config);
        },

        /**
         * Creates the framework's equivalent multipoint geometry object.
         * @param   config  {Object}    An optional properties hash the object should use
         * @return          {L.featureGroup}
         */
        multipoint: function (config) {
            var i,
                layers = [],
                coords = this.components;

            for (i = 0; i < coords.length; i += 1) {
                layers.push(this.construct.point.call(this, config, coords[i]));
            }

            return L.featureGroup(layers, config);
        },

        /**
         * Creates the framework's equivalent linestring geometry object.
         * @param   config      {Object}    An optional properties hash the object should use
         * @param   component   {Object}    An optional component to build from
         * @return              {L.polyline}
         */
        linestring: function (config, component) {
            var coords = component || this.components,
                latlngs = this.coordsToLatLngs(coords, 0, this.coordsToLatLng);

            return L.polyline(latlngs, config);
        },

        /**
         * Creates the framework's equivalent multilinestring geometry object.
         * @param   config  {Object}    An optional properties hash the object should use
         * @return          {L.multiPolyline}
         */
        multilinestring: function (config) {
            var coords = this.components,
                latlngs = this.coordsToLatLngs(coords, 1, this.coordsToLatLng);

            if (L.multiPolyline) {
                return L.multiPolyline(latlngs, config);
            }
            else {
                return L.polyline(latlngs, config);
            }
        },

        /**
         * Creates the framework's equivalent polygon geometry object.
         * @param   config      {Object}    An optional properties hash the object should use
         * @return              {L.multiPolygon}
         */
        polygon: function (config) {
            // Truncate the coordinates to remove the closing coordinate
            var coords = this.trunc(this.components),
                latlngs = this.coordsToLatLngs(coords, 1, this.coordsToLatLng);
            return L.polygon(latlngs, config);
        },

        /**
         * Creates the framework's equivalent multipolygon geometry object.
         * @param   config  {Object}    An optional properties hash the object should use
         * @return          {L.multiPolygon}
         */
        multipolygon: function (config) {
            // Truncate the coordinates to remove the closing coordinate
            var coords = this.trunc(this.components),
                latlngs = this.coordsToLatLngs(coords, 2, this.coordsToLatLng);

            if (L.multiPolygon) {
                return L.multiPolygon(latlngs, config);
            }
            else {
                return L.polygon(latlngs, config);
            }
        },

        /**
         * Creates the framework's equivalent collection of geometry objects.
         * @param   config  {Object}    An optional properties hash the object should use
         * @return          {L.featureGroup}
         */
        geometrycollection: function (config) {
            var comps, i, layers;

            comps = this.trunc(this.components);
            layers = [];
            for (i = 0; i < this.components.length; i += 1) {
                layers.push(this.construct[comps[i].type].call(this, comps[i]));
            }

            return L.featureGroup(layers, config);
        }
    };

    L.Util.extend(Wkt.Wkt.prototype, {
        coordsToLatLngs: L.GeoJSON.coordsToLatLngs,
        // TODO Why doesn't the coordsToLatLng function in L.GeoJSON already suffice?
        coordsToLatLng: function (coords, reverse) {
            var lat = reverse ? coords.x : coords.y,
                lng = reverse ? coords.y : coords.x;

            return L.latLng(lat, lng, true);
        }
    });

    /**
     * @augments Wkt.Wkt
     * A framework-dependent deconstruction method used to generate internal
     * geometric representations from instances of framework geometry. This method
     * uses object detection to attempt to classify members of framework geometry
     * classes into the standard WKT types.
     * @param   obj {Object}    An instance of one of the framework's geometry classes
     * @return      {Object}    A hash of the 'type' and 'components' thus derived
     */
    Wkt.Wkt.prototype.deconstruct = function (obj) {
        var attr, coordsFromLatLngs, features, i, verts, rings, tmp, boundary;

        /**
         * Accepts an Array (arr) of LatLngs from which it extracts each one as a
         *  vertex; calls itself recursively to deal with nested Arrays.
         */
        coordsFromLatLngs = function (arr) {
            var i, coords;

            coords = [];
            for (i = 0; i < arr.length; i += 1) {
                if (Wkt.isArray(arr[i])) {
                    coords.push(coordsFromLatLngs(arr[i]));

                } else {
                    coords.push({
                        x: arr[i].lng,
                        y: arr[i].lat
                    });
                }
            }

            return coords;
        };

        // L.Marker ////////////////////////////////////////////////////////////////
        if (obj.constructor === L.Marker || obj.constructor === L.marker) {
            return {
                type: 'point',
                components: [{
                    x: obj.getLatLng().lng,
                    y: obj.getLatLng().lat
                }]
            };
        }

        // L.Rectangle /////////////////////////////////////////////////////////////
        if (obj.constructor === L.Rectangle || obj.constructor === L.rectangle) {
            tmp = obj.getBounds(); // L.LatLngBounds instance
            return {
                type: 'polygon',
                isRectangle: true,
                components: [
                    [
                        { // NW corner
                            x: tmp.getSouthWest().lng,
                            y: tmp.getNorthEast().lat
                        },
                        { // NE corner
                            x: tmp.getNorthEast().lng,
                            y: tmp.getNorthEast().lat
                        },
                        { // SE corner
                            x: tmp.getNorthEast().lng,
                            y: tmp.getSouthWest().lat
                        },
                        { // SW corner
                            x: tmp.getSouthWest().lng,
                            y: tmp.getSouthWest().lat
                        },
                        { // NW corner (again, for closure)
                            x: tmp.getSouthWest().lng,
                            y: tmp.getNorthEast().lat
                        }
                    ]
                ]
            };

        }

        // L.Polyline //////////////////////////////////////////////////////////////
        if (obj.constructor === L.Polyline || obj.constructor === L.polyline) {
            verts = [];
            tmp = obj.getLatLngs();

            if (!tmp[0].equals(tmp[tmp.length - 1])) {

                for (i = 0; i < tmp.length; i += 1) {
                    verts.push({
                        x: tmp[i].lng,
                        y: tmp[i].lat
                    });
                }

                return {
                    type: 'linestring',
                    components: verts
                };

            }
        }

        // L.Polygon ///////////////////////////////////////////////////////////////

        if (obj.constructor === L.Polygon || obj.constructor === L.polygon) {
            rings = [];
            verts = [];
            boundary = obj.getLatLngs()[0];

            // First, we deal with the boundary points
            for (i = 0; i < boundary.length; i += 1) {
                verts.push({ // Add the first coordinate again for closure
                    x: boundary[i].lng,
                    y: boundary[i].lat
                });
            }

            verts.push({ // Add the first coordinate again for closure
                x: boundary[0].lng,
                y: boundary[0].lat
            });

            rings.push(verts);

            // Now, any holes
            if (obj._holes && obj._holes.length > 0) {
                // Reworked to support holes properly
                verts = coordsFromLatLngs(obj._holes);
                for (i=0; i < verts.length;i++) {
                    verts[i].push(verts[i][0]); // Copy the beginning coords again for closure
                    rings.push(verts[i]);
                }
            }

            return {
                type: 'polygon',
                components: rings
            };

        }

        // L.MultiPolyline /////////////////////////////////////////////////////////
        // L.MultiPolygon //////////////////////////////////////////////////////////
        // L.LayerGroup ////////////////////////////////////////////////////////////
        // L.FeatureGroup //////////////////////////////////////////////////////////
        if (obj.constructor === L.MultiPolyline || obj.constructor === L.MultiPolygon
                || obj.constructor === L.LayerGroup || obj.constructor === L.FeatureGroup) {

            features = [];
            tmp = obj._layers;

            for (attr in tmp) {
                if (tmp.hasOwnProperty(attr)) {
                    if (tmp[attr].getLatLngs || tmp[attr].getLatLng) {
                        // Recursively deconstruct each layer
                        features.push(this.deconstruct(tmp[attr]));
                    }
                }
            }

            return {

                type: (function () {
                    switch (obj.constructor) {
                    case L.MultiPolyline:
                        return 'multilinestring';
                    case L.MultiPolygon:
                        return 'multipolygon';
                    case L.FeatureGroup:
                        return (function () {
                            var i, mpgon, mpline, mpoint;

                            // Assume that all layers are of one type (any one type)
                            mpgon = true;
                            mpline = true;
                            mpoint = true;

                            for (i in obj._layers) {
                                if (obj._layers.hasOwnProperty(i)) {
                                    if (obj._layers[i].constructor !== L.Marker) {
                                        mpoint = false;
                                    }
                                    if (obj._layers[i].constructor !== L.Polyline) {
                                        mpline = false;
                                    }
                                    if (obj._layers[i].constructor !== L.Polygon) {
                                        mpgon = false;
                                    }
                                }
                            }

                            if (mpoint) {
                                return 'multipoint';
                            }
                            if (mpline) {
                                return 'multilinestring';
                            }
                            if (mpgon) {
                                return 'multipolygon';
                            }
                            return 'geometrycollection';

                        }());
                    default:
                        return 'geometrycollection';
                    }
                }()),

                components: (function () {
                    // Pluck the components from each Wkt
                    var i, comps;

                    comps = [];
                    for (i = 0; i < features.length; i += 1) {
                        if (features[i].components) {
                            comps.push(features[i].components);
                        }
                    }

                    return comps;
                }())

            };

        }

        // L.Circle ////////////////////////////////////////////////////////////////
        if (obj.constructor === L.Circle || obj.constructor === L.circle) {
            console.log('Deconstruction of L.Circle objects is not yet supported');

        } else {
            console.log('The passed object does not have any recognizable properties.');
        }

    };

    return Wkt;
}));
