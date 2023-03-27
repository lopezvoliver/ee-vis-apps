/*******************************************************************************
 * Model *
 *
 * The main data asset to show is the tseb-landsat-era5 image collection
 * 7 bands are available. 
 * Objective 1: Make NDVI work with date selection and mean reducer.
 * Objective 2: Add other 6 bands.
 *
 * Guidelines: Use this section to import assets and define information that
 * are used to parameterize data-dependant widgets and control style and
 * behavior on UI interactions.
 ******************************************************************************/

// Define a JSON object for storing the data model.
var m = {};

//et:['#86340c', '#c49e0d', '#f3fe34', '#aefeae', '#11f9fd', '#698afc', '#5813fc']

// Organize bands to visualize for each image
m.imgInfo = {
  bands:{
    'NDVI':{
      vis:{
        min:0,
        max:1,
        palette:['#CE7E45', '#CE7E45', '#DF923D', '#F1B555', '#FCD163', '#99B718', '#74A901', '#66A000', '#529400', '#3E8601', '#207401', '#056201', '#004C00', '#023B01', '#012E01', '#011D01', '#011301']
      },
    }
  }
};

// Region of interest -- Saudi
m.gaul = ee.FeatureCollection("FAO/GAUL/2015/level1")
m.saudi = m.gaul.filter(ee.Filter.eq("ADM0_NAME", "Saudi Arabia"))
.geometry().dissolve({"maxError":30})

// Date range allowed in the slider
m.dataDateRange = {
  start: Date.parse("2013-03-01T00:00:00"), 
  end: Date.now(),
  init_start: Date.parse("2022-03-01"),  // Initial -- move to init.js
  init_end: Date.parse("2022-07-01")
}; // Updated using Time series control. 

exports.m = m;