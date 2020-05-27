var BubbleMap = [
    {
        "Date": "1950s",   // Start from the ealiest year in the data set
        "Bubble":       // Should include about 200 countries and regions. here are two examples
        [
            {
                "Country": "UK",  // The abbreviation of country (should be the "Nationality" in the Artworks.JSON", the abbreviation :https://gist.github.com/zspine/2365808)
                "Quantity": 12,   // The number of artpieces
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] } // The center point of this country
            },

            {
                "Country": "US",
                "Quantity": 13,
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] }
            }
        ]
    },
    {
        "Date": "1960s",   // Next 10 year, I only list examples of two decades
        "Bubble":       // Should also include about 200 countries and regions. here are two examples
        [
            {
                "Country": "UK",  
                "Quantity": 15,   
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] } 
            },

            {
                "Country": "US",
                "Quantity": 16,
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] }
            }
        ]
    },


    // .............. many of them every decades


    {
        "Date": "2010s",   // The latest dacedes
        "Bubble":       
        [
            {
                "Country": "UK",  
                "Quantity": 15,   
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] } 
            },

            {
                "Country": "US",
                "Quantity": 16,
                "geometry": { "type": "Point", "coordinates": [71.1263, 36.4935] }
            }
        ]
    }
]


