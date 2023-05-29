// Modules
var model = require('users/oliverlopez/mewa-prototype:annual-data/model.js');
var components = require('users/oliverlopez/mewa-prototype:annual-data/components.js');
var style = require('users/oliverlopez/mewa-prototype:annual-data/style.js');


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
c.controlPanel.add(c.yearControl);
c.controlPanel.add(c.legendPanel);
c.controlPanel.add(c.dividers.divider1);
c.controlPanel.add(c.display.Panel);
c.controlPanel.add(c.dividers.divider2);
ui.root.add(c.controlPanel);
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
 *     - c.yearControl changes.
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

function updateMap(){
  var featureCollectionAsset = m.dataPath + m.yearsRange.value; 
  var annualData = ee.FeatureCollection(featureCollectionAsset);
  var empty = ee.Image().byte();

  var outline = empty.paint({
    featureCollection: annualData,
    color:1, 
    width:1
  })
  
  function addColumnToMap(column_key){
    if (m.dataInfo.columns[column_key].showLayer){
    var shown = removeLayer(m.dataInfo.columns[column_key].displayName)
    c.map.add(ui.Map.Layer({
      eeObject: empty.paint(annualData, column_key).multiply(m.dataInfo.columns[column_key].scaleData),
      visParams: m.dataInfo.columns[column_key].vis,
      name: m.dataInfo.columns[column_key].displayName,
      shown: shown
    }));
    }
  }
  Object.keys(m.dataInfo.columns).map(addColumnToMap)

 var shown = removeLayer("Field boundaries")
  c.map.add(ui.Map.Layer({
    eeObject: outline,
    visParams: {palette:"#000000"},
    name: "Field boundaries",
    shown: shown,
  }))
}

function updateLabels(geom){
    var featureCollectionAsset = m.dataPath + m.yearsRange.value; 
    var data = ee.FeatureCollection(featureCollectionAsset)
    .filterBounds(geom);
 
    c.display.title.setValue("ROI aggregated data:");
    function updateLabel(columnKey){
        // For column_key, aggregate using either sum or mean
        // and update the corresponding Label
        var columnInfo=m.dataInfo.columns[columnKey];
        var dataComputedValue="";
        if(columnInfo.aggregation=="mean"){
           dataComputedValue=data.aggregate_mean(columnKey);
        }
        if(columnInfo.aggregation=="sum"){
           dataComputedValue=data.aggregate_sum(columnKey);
        }
        // Pass the value (getInfo) to a callback function
        // that updates the label:
        ee.Number(dataComputedValue)
        .multiply(columnInfo.scaleData)
        .format(columnInfo.fmt)
        .getInfo(function(value){
            c.display.labels[columnKey].setValue(
                columnInfo.displayName+" ("+columnInfo.aggregation+"): "+value + " " + columnInfo.units
            ) 
        })
    }
    // Do this for every columnKey in data columns:
    Object.keys(m.dataInfo.columns).map(updateLabel)
}

c.drawingTools.onDraw(updateLabels)
c.drawingTools.onEdit(ui.util.debounce(updateLabels, 500))


c.yearControl.onChange(
    ui.util.debounce(function(year){
        m.yearsRange.value = year;
        updateMap();
        // Update the labels using the last drawn geometry
        // only if a geometry has been drawn!
        var dlayers = c.drawingTools.layers();
        var nLayers = dlayers.length();
        if(nLayers>=1){
        var lastLayer = dlayers.get(nLayers-1);
        var aoi = lastLayer.getEeObject();
        var geom = aoi.geometries().get(0);
        updateLabels(geom);
        }
    },500)
);



/*******************************************************************************
 * Initialize *
 *
 * A section to initialize the app state on load.
 *
 * Guidelines:
 * 1. At the top, define any helper functions.
 * 2. As much as possible, use URL params to initial the state of the app.
 ******************************************************************************/
// Only allow drawing polygons because we are interested in ROIs:
c.drawingTools.setDrawModes(["point","polygon", "rectangle"]);

// Initialie the yearControl slider to the value in m.yearsRange.value
// with trigger set to true (default) so that it triggers the updateMap
c.yearControl.setValue(m.yearsRange.value)

// Set the map center:
c.map.setCenter({
  lon: ui.url.get('lon', m.MapCenter.coordinates().getInfo()[0]),
  lat: ui.url.get('lat', m.MapCenter.coordinates().getInfo()[1]),
  zoom: ui.url.get('zoom', 12)
});
