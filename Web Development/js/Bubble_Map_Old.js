var Time = [];
for (i = 1500; i <= 2010; i += 10) { Time.push(i); };
// Selectively display the data

function filterBy(time) {
    var filters = ['==', 'Date', time];
    map.setFilter('earthquake-circles', filters);
    map.setFilter('earthquake-labels', filters);

    // Set the label to the timeline
    document.getElementById('time').textContent = time +'s';
};


map.on('load', function () {

    var data = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {
                "mag": 6.3,
                "time": 1451070887190
            },
            "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935, 206] }
        },
        {
            "type": "Feature",
            "properties": {
                "mag": 6.2,
                "time": 1450986243130
            },
            "geometry": { "type": "Point", "coordinates": [-123.1158, -55.755, 12.28] }
        }],
    };

    data.features = data.features.map(function (d) {
        d.properties.month = new Date(d.properties.time).getMonth();
        return d;
    });

    map.addSource('quantity_bubbles', {
        'type': 'geojson',
        data: data
    });

    map.addLayer({
        'id': 'earthquake-circles',
        'type': 'circle',
        'source': 'quantity_bubbles',
        'paint': {
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                6,
                '#FCA107',
                8,
                '#7F3121'
            ],
            'circle-opacity': 0.75,
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['get', 'mag'],
                6,
                20,
                8,
                40
            ]
        }
    });

    map.addLayer({
        'id': 'earthquake-labels',
        'type': 'symbol',
        'source': 'quantity_bubbles',
        'layout': {
            'text-field': [
                'concat',
                ['to-string', ['get', 'mag']],
                'm'
            ],
            'text-font': [
                'Open Sans Bold',
                'Arial Unicode MS Bold'
            ],
            'text-size': 12
        },
        'paint': {
            'text-color': 'rgba(0,0,0,0.5)'
        }
    });

    // Set filter to first month of the year
    // 0 = January
    filterBy(1500);

    document
        .getElementById('slider')
        .addEventListener('input', function (t) {
            var time = parseInt(t.target.value, 10);
            filterBy(time);
        });
}
);