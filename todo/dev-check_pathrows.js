/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var w = ee.FeatureCollection("users/oliverlopez/WRS2_descending"),
    regions = ee.FeatureCollection("projects/halo-mewa/assets/Saudi_ag_regions/regions_multi_ext");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Use this to check the path/rows that will be generated by 
a given dateRange, region-selection, exclude_pr, etc..
To be used in parallel with
mewagee/dev/check_pathrows.py
BEFORE submitting a TSEB json file!!
TODO: make this into an app..
Components:
selection of dateRange
Textbox/button to add path/rows to exclude? (with a "clear" button)
Label to show number of images

*/
var sat_list = ee.List([
  "LANDSAT_7",
  "LANDSAT_8",
  "LANDSAT_9"
  ])
var exclude_pr = null;
var m = {};
m.gaul = ee.FeatureCollection("FAO/GAUL/2015/level1");
m.saudi = m.gaul.filter(ee.Filter.eq("ADM0_NAME", "Saudi Arabia"))
.geometry().dissolve({"maxError":30});

var region = regions.filter(ee.Filter.eq(
  "region_key","JZ_001"
  //"region","MD"
  ))
var date_start=ee.Date("2022-01-01")
var date_end=ee.Date("2023-01-29")   // Note: 28 is the last available as of April 4, 2023.

exclude_pr=[
  [168,48],
  [166,49]
];

function filter_landsat_collection(landsat_collection){
  return landsat_collection
  .filterDate(date_start, date_end)
  .filterBounds(region)
}
function pr(image){
  var path = ee.Number(image.get("WRS_PATH")).format("%03d")
  var row = ee.Number(image.get("WRS_ROW")).format("%03d")
  return image.set({"PATHROW":path.cat(row)})
}

var LE07=filter_landsat_collection(
        ee.ImageCollection('LANDSAT/LE07/C02/T1_L2'))
var LC08= filter_landsat_collection(
        ee.ImageCollection('LANDSAT/LC08/C02/T1_L2'))
var LC09 = filter_landsat_collection(
        ee.ImageCollection('LANDSAT/LC09/C02/T1_L2'))
var collection = LE07.merge(LC08).merge(LC09)
.filter(ee.Filter.inList("SPACECRAFT_ID", sat_list))
.map(pr)

if(exclude_pr){
  var filters = exclude_pr.map(function(PR){
    return ee.Filter.and(
       ee.Filter.eq("WRS_PATH", PR[0]),
       ee.Filter.eq("WRS_ROW", PR[1]))})
  var filter_or = ee.Filter.or.apply(null,filters);
  //https://stackoverflow.com/questions/2856059/passing-an-array-as-a-function-parameter-in-javascript
  collection=collection.filter(filter_or.not())
}

var pathrows = collection
.aggregate_array("PATHROW")
.distinct()
print(pathrows)

w = w.filter(ee.Filter.inList("WRSPR",pathrows));

Map.addLayer(w, {}, "PATHROWS", true, 0.3)
Map.addLayer(regions, {}, "Regions", true, 0.3)
Map.addLayer(region, {}, "Region")

print(collection.size())