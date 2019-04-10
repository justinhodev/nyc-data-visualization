const nyc = {
    "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
    "data": {
      "name": "census-data",
      "url": "https://gist.githubusercontent.com/justinhodev/bbe43324cbf228095e47bb471e5930f2/raw/632f57b671376fa8dcc3a8d5755e3004204da326/nyc_census_tracts.csv",
      "format": {"type": "csv"}
    },
    "transform": [
      {
        "lookup": "County",
        "from": {
          "data": {
            "name": "crime-data"
          },
          "key": "County",
          "fields": ["Index Count", "Property Count", "Violent Count", "Firearm Count"]
        }
      },
      {
        "filter": "datum.TotalPop > 0 && datum.Income > 0"
      },
      {
        "sample": 600
      }
    ],
    "columns": 2,
    "concat": [
      {
        "encoding": {
          "color": {
            "condition": {
              "title": "County",
              "field": "County",
              "selection": "input",
              "type": "nominal"
            },
            "value": "lightgrey"
          },
          "x": {
            "axis": {"title": "Population"},
            "field": "TotalPop",
            "type": "quantitative"
          },
          "y": {
            "axis": {"title": "Income"},
            "field": "Income",
            "type": "quantitative"
          }
        },
        "title": "Household Income in New York",
        "width": 400,
        "height": 300,
        "mark": "point",
        "selection": {
          "input": {
            "type": "single",
            "fields": ["County"],
            "bind": {
              "name": "County",
              "input": "select",
              "options": ["Bronx", "Kings", "New York", "Queens", "Richmond"]
            }
          }
        },
        "transform": [{"filter": {"selection": "click"}}]
      },
      {
        "transform": [
          {
            "fold": ["Construction", "Office", "Production", "Professional", "Service"],
            "as": ["Industry", "Count"]
          },
          {
            "filter": { "selection": "input" }
          }
        ],
        "encoding": {
          "x": {
            "field": "Industry",
            "type": "nominal",
          },
          "y": {
            "axis": {"title": "Number of Workers"},
            "aggregate": "sum",
            "field": "Count",
            "type": "quantitative"
          },
          "color": {
            "condition": {
              "field": "County",
              "type": "nominal",
              "selection": "click"
            },
            "value": "lightgray"
          }
        },
        "title": "Distribution of New Yorkers in the Workforce",
        "width": 400,
        "height": 300,
        "mark": "bar",
        "selection": {
          "click": {
            "encodings": ["color"],
            "type": "multi"
          }
        }
      },
      {
        "transform": [
          {
            "fold": ["Index Count", "Property Count", "Violent Count", "Firearm Count"],
            "as": ["Crime", "Values"]
          },
          {"filter": {"selection": "input"}}
        ],
        "encoding": {
          "x": {
            "axis": {"title": "Type of Crime"},
            "field": "Crime",
            "type": "nominal"
          },
          "y": {
            "axis": {"title": "Number of Incidents"},
            "aggregate": "sum", 
            "field": "Values", 
            "type": "quantitative"
          },
          "color": {
            "condition": {"field": "County", "type": "nominal", "selection": "click"},
            "value": "lightgray"
          }
        },
        "title": "Record of Crime in New York",
        "width": 400,
        "height": 300,
        "mark": "bar",
        "selection": {
          "click": {
            "encodings": ["color"], 
            "type": "multi"
          }
        }
      }
    ]
  }

  getCrimesByYear(2015).then((df) => {
    df = df.filter((row) => {
      return row.get('County') === ('Bronx' || 'Kings' || 'New York' || 'Queens' || 'Richmond');
    });
    df = df.toCollection();
    // nyc.transform[0].from.data.value = df;
    // console.dir(nyc.transform[0].from.data);
    vegaEmbed('#vis', nyc, {"actions": false}).then((result) => {
      result.view.insert('crime-data', df);
      result.view.runAsync();
      console.log(result.view.data('crime-data'));
    }).catch(err => console.log(err));
  }); 