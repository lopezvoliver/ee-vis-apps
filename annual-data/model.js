/*******************************************************************************
 * Model *
 *
 * The main data asset to show is the annual_YYYY feature collections.  
 * The data columns available are:
 * ET, ETm3, NDVI, area, fieldUse, useDays
 * 
 * The app will have 6 visualization layers
 * with the same feature collection shown but styled according to the six columns
 * 
 * The app will also allow the user to draw an ROI
 * and display the aggregated data over the ROI
 * The aggregation is either a sum or a mean, as specified here:
 * 
 * ET: mean,
 * ETm3: sum,
 * NDVI: mean,
 * area: sum,
 * fieldUse: mean,
 * useDays: mean
 * 
 * Guidelines: Use this section to import assets and define information that
 * are used to parameterize data-dependant widgets and control style and
 * behavior on UI interactions.
 ******************************************************************************/

// Define a JSON object for storing the data model.
var m = {};

m.dataInfo = {
  columns:{
    'ET':{
      displayName: "ET",
      colorBarName: "ET",
      units: "mm/yr", 
      fmt:"%.1f", 
      showLayer: true, // Add as layer to map?
      scaleData: 1, // scale the value of the column by this number. 
      aggregation: "mean",
      vis:{
        min:0,
        max:1500,
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
    'ETm3':{
      displayName: "Crop water use",
      colorBarName: "Annual crop water use (m³)", //m³
      showLayer: true,
      units:"m³",
      fmt:"%.3e",
      aggregation: "sum",
      scaleData: 1,  
      vis:{
        min:0,
        max:900000,
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
    'fieldUse':{
      displayName: "Field use",
      colorBarName: "Field use (%)",
      aggregation: "mean",
      scaleData: 100,  
      units:"%",
      fmt:"%.0f",
      showLayer: true,
      vis:{
        min:0,
        max:100, 
        palette:[
        "#ffffcc","#c2e699","#78c679","#31a354","#006837"]    
      },
    },
    'area':{
      displayName: "Area",
      aggregation: "sum",
      units:"ha",
      fmt:"%.0f",
      scaleData:1, 
      showLayer: false,
    },
    'NDVI':{
      displayName: "NDVI",
      colorBarName: "NDVI",
      aggregation: "mean",
      scaleData: 1, 
      units:"",
      fmt:"%.2f",
      showLayer: true,
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
    }
  }
};

// Date range allowed in the slider
m.yearsRange = {
  value: 2022, 
  start: 2015,
  end: 2022
}; 

m.dataPath= "projects/halo-mewa/assets/fields/annual_"; // + year

m.MapCenter=ee.Geometry.Point(38.25,30.25);

exports.m = m;