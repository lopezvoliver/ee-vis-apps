// Modules
var model = require('users/oliverlopez/mewa-apps:tseb-landsat-era5/model.js');
var components = require('users/oliverlopez/mewa-apps:tseb-landsat-era5/components.js');
var style = require('users/oliverlopez/mewa-apps:tseb-landsat-era5/style.js');

/*******************************************************************************
 * Model *
*******************************************************************************/
var m = model.m;

/*******************************************************************************
 * Components *
*******************************************************************************/
var c =components.makec(m);

/*******************************************************************************
 * Composition *
 *
 * A section to compose the app i.e. add child widgets and widget groups to
 * first-level parent components like control panels and maps.
 *
 * Guidelines: There is a gradient between components and composition. There
 * are no hard guidelines here; use this section to help conceptually break up
 * the composition of complicated apps with many widgets and widget groups.
 ******************************************************************************/
ui.root.clear();
c.controlPanel.add(c.info.panel);
c.controlPanel.add(c.timeControl.panel);
c.controlPanel.add(c.reducer);
//c.controlPanel.add(c.dividers.divider1);
//c.controlPanel.add(c.selectBand.panel);
c.controlPanel.add(c.legendPanel)
ui.root.add(c.controlPanel);
//c.map.add(c.selectBand.legend.panel) 
ui.root.add(c.map);

/*******************************************************************************
 * Style *
*******************************************************************************/
c = style.apply(c); // Apply the styles to the components.

/*******************************************************************************
 * Behaviors *
 *
 * A section to define app behavior on UI activity.
 *
 * Guidelines:
 * 1. At the top, define helper functions and functions that will be used as
 *    callbacks for multiple events.
 * 2. For single-use callbacks, define them just prior to assignment. If
 *    multiple callbacks are required for a widget, add them consecutively to
 *    maintain order; single-use followed by multi-use.
 * 3. As much as possible, include callbacks that update URL parameters.
 * 
 * 
 * UpdateMap when:
 *     - either date slider changes.
 *     - the select band slider changes.
 ******************************************************************************/
var removeLayer = function(name) {
  // Look for a layer by name and remove it if found.
  // Return the visi 
  var layers = c.map.layers()
  var names = []
  var shown = true; 
  layers.forEach(function(l){names.push(l.getName())})
  var index = names.indexOf(name)
  if (index > -1) {
    shown = layers.get(index).getShown();
    c.map.remove(layers.get(index))
    } 
  return shown;
}

function scaleImage(image){
  return ee.Image(
  image.divide(ee.Number(image.get("SCALING_FACTOR")))
  .copyProperties(image)
)
}

function queryCollectionSize(){
    m.tsebImageCollection.size().evaluate(function(n){
    c.info.collectionSizeLabel.setValue("Number of images: "+n)
    })
}

function queryFilteredCollectionSize(){
  m.tsebImageCollection
  .filterDate(m.dataDateRange.start, m.dataDateRange.end)
  .size()
  .evaluate(function(n){
    c.info.fCollectionSizeLabel
    .setValue("Number of images in selected period: "+n)
  })
}



function updateMap(){
  var imageCollection = m.tsebImageCollection
  .filterDate(m.dataDateRange.start, m.dataDateRange.end)
  .map(scaleImage) //int32 to float using SCALING_FACTOR
  .map(function(image){
    var path = ee.Number(image.get("WRS_PATH")).format("%03d");
    var row = ee.Number(image.get("WRS_ROW")).format("%03d");
    return image.set({PATHROW:path.cat(row)})
  })
  var band_names=imageCollection.first().bandNames()
  var reducedImage=imageCollection
  .reduce(m.Reducer)
  var bad_band_names=reducedImage.bandNames()
  reducedImage=reducedImage.select(bad_band_names, band_names)
  
  function addBandToMap(band_key){
    var shown = removeLayer(m.imgInfo.bands[band_key].displayName)
    c.map.add(ui.Map.Layer({
      eeObject: reducedImage.select(band_key).updateMask(1),
      visParams: m.imgInfo.bands[band_key].vis,
      name: m.imgInfo.bands[band_key].displayName,
      shown: shown
    }));
  }
  Object.keys(m.imgInfo.bands).map(addBandToMap)
 
  // WRS2 Descending shapefile -- on top but by default not visible
  removeLayer("Landsat WRS 2 Descending Path Row")
  var pathRows = imageCollection.aggregate_array("PATHROW").distinct()
  var wrsTiles = m.wrs.filter(ee.Filter.inList("WRSPR", pathRows));
  c.map.add(ui.Map.Layer({
    eeObject: wrsTiles,
    name: "Landsat WRS 2 Descending Path Row",
    shown: false
  })); 
  // Query selected image collection size:
  queryFilteredCollectionSize();
  // and then update it every minute:
  ui.util.clearTimeout(m.qfcs) // Clear previous setInterval call.
  m.qfcs = ui.util.setInterval(function(){queryFilteredCollectionSize()}, 60*1000)
}

function updateReducer(value){
    m.Reducer = m.Reducers[value]
    updateMap();
}

c.timeControl.startSlider.onChange(
    ui.util.debounce(function(ee_date_range){
        m.dataDateRange.start = ee_date_range.start();
        updateMap();
    },500)
);
c.timeControl.endSlider.onChange(
    ui.util.debounce(function(ee_date_range){
        m.dataDateRange.end = ee_date_range.end();
        updateMap();
    },500)
);

c.reducerSelector.onChange(updateReducer)


/*******************************************************************************
 * Initialize *
 *
 * A section to initialize the app state on load.
 *
 * Guidelines:
 * 1. At the top, define any helper functions.
 * 2. As much as possible, use URL params to initial the state of the app.
 ******************************************************************************/
m.qfcs=null; // Initial interval key for queryFilteredCollectionSize function.
// Background for Saudi 
c.map.add(ui.Map.Layer({
    eeObject: ee.Image(0).clip(m.saudi),
    visParams: {palette:["#CE7E45"]},
    name: "Background"
}))
// Initialize the timeControl
c.timeControl.startSlider.setValue(Date.parse("2022-03-01"), false)
c.timeControl.endSlider.setValue(Date.parse("2022-07-01"), false)
c.reducerSelector.setValue("Mean", true) 

// Query the Total number of images upon initialization, and 
// every minute after then.
queryCollectionSize()
ui.util.setInterval(function(){queryCollectionSize()}, 60*1000)

// Center on Saudi Arabia:
m.center=m.saudi.centroid()
c.map.setCenter({
  lon: ui.url.get('lon', m.center.coordinates().getInfo()[0]),
  lat: ui.url.get('lat', m.center.coordinates().getInfo()[1]),
  zoom: ui.url.get('zoom', 6)
});