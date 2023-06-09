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

// Organize bands to visualize for each image
m.imgInfo = {
  bands:{
    'albedo':{
      displayName: "Albedo",
      showColorBar: true,
      colorBarName: "Albedo",
      vis:{
        min:0,
        max:0.5,
        palette:[
        '#000000',
        '#ffffff']
      },
    },
    'NDVI':{
      displayName: "NDVI",
      showColorBar: true,
      colorBarName: "NDVI",
      vis:{
        min:0,
        max:1,
        palette:[
        '#CE7E45', 
        '#DF923D', 
        '#F1B555', 
        '#FCD163', 
        '#99B718', 
        '#74A901', 
        '#66A000', 
        '#529400', 
        '#3E8601', 
        '#207401', 
        '#056201', 
        '#004C00', 
        '#023B01', 
        '#012E01', 
        '#011D01', 
        '#011301']
      },
    },
    'LST':{
      displayName: "Land Surface Temperature",
      showColorBar: true,
      colorBarName: "Land Surface Temperature (K)",
      vis:{
        min:290,
        max:320,
        palette:[
        '#000004',
        '#1b0b41',    
        '#4b0c6b',
        '#781c6d',
        '#a52c60',
        '#cf4346',
        '#ed6925',
        '#fb9a07',
        '#f8d13c',
        '#fcffa4']
      },
    },
    'LAI':{
      displayName: "Leaf Area Index",
      showColorBar: true,
      colorBarName: "Leaf Area Index (m²/m²)",
      vis:{
        min:0,
        max:6,
        palette:[
        '#6a3d07',
        '#f0deb0',
        '#abcb4b',
        '#68a200',
        '#267900',
        '#005200',
        '#002900',
        '#000100'
        ]
      },
    },
    'LEc':{
      displayName: "Canopy Latent heat flux",
      showColorBar: true,
      colorBarName: "Latent heat flux (W/m²)",
      vis:{
        min:0,
        max:500,
        palette:[
        '#86340c', 
        '#c49e0d', 
        '#f3fe34', 
        '#aefeae', 
        '#11f9fd', 
        '#698afc', 
        '#5813fc']
      },
    },
    'LEs':{
      displayName: "Soil latent heat flux",
      showColorBar: false,  // Shared colorbar with LEc
      colorBarName: "Latent heat flux (W/m²)",
      vis:{
        min:0,
        max:500,
        palette:[
        '#86340c', 
        '#c49e0d', 
        '#f3fe34', 
        '#aefeae', 
        '#11f9fd', 
        '#698afc', 
        '#5813fc']
      },
    },
    'ETd':{
      displayName: "ET",
      showColorBar: true,
      colorBarName: "ET (mm/day)",
      vis:{
        min:0,
        max:6,
        palette:[
        '#86340c', 
        '#c49e0d', 
        '#f3fe34', 
        '#aefeae', 
        '#11f9fd', 
        '#698afc', 
        '#5813fc']
      },
    },
  }
};

// Region of interest -- Saudi
m.gaul = ee.FeatureCollection("FAO/GAUL/2015/level1");
m.saudi = m.gaul.filter(ee.Filter.eq("ADM0_NAME", "Saudi Arabia"))
.geometry().dissolve({"maxError":30});

// Date range allowed in the slider
m.dataDateRange = {
  init_start: Date.parse("2013-01-01T00:00:00"), 
  init_end: Date.now(),
  start: ee.Date("2022-01-01"),
  end:ee.Date("2022-12-31")
}; // The start and end parameters are modified with c.timeControl.startSlider 
// and c.timeControl.endSlider, respectively. 

// Reducer to use (defaults to ee.Reducer.mean)
m.Reducers = {
    "Mean": ee.Reducer.mean(),
    "Max": ee.Reducer.max()
}
m.Reducer = m.Reducers["Mean"]  // Default 

m.tsebImageCollection = ee.ImageCollection("projects/halo-mewa/assets/tseb-landsat-era5");

m.wrs = ee.FeatureCollection("users/oliverlopez/WRS2_descending");

exports.m = m;