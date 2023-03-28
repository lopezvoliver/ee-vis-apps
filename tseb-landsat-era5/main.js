// Modules
var colormaps = require('users/oliverlopez/util:colormaps')
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
c.controlPanel.add(c.timeSeriesControl.panel);
//c.controlPanel.add(c.dividers.divider1);
//c.controlPanel.add(c.selectBand.panel);
ui.root.add(c.controlPanel);
c.map.add(c.selectBand.legend.panel) 
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

function updateMap(){
  var imageCollection = m.tsebImageCollection
  .filterDate(m.dataDateRange.start, m.dataDateRange.end)
  .map(colormaps.util.scale)
  var band_names=imageCollection.first().bandNames()
  var meanImage=imageCollection
  .reduce(ee.Reducer.mean())
  var bad_band_names=meanImage.bandNames()
  meanImage=meanImage.select(bad_band_names, band_names)
 
  function addBandToMap(band_key){
    c.map.add(ui.Map.Layer({
      eeObject: meanImage.select(band_key).updateMask(1),
      visParams: m.imgInfo.bands[band_key].vis,
      name: band_key
    }));
  }
  Object.keys(m.imgInfo.bands).map(addBandToMap)
  
}

c.timeSeriesControl.startSlider.onChange(
    function(ee_date_range){
        m.dataDateRange.start = ee_date_range.start();
        updateMap();
    }
)
c.timeSeriesControl.endSlider.onChange(
    function(ee_date_range){
        m.dataDateRange.end = ee_date_range.end();
        updateMap();
    }
)

/*******************************************************************************
 * Initialize *
 *
 * A section to initialize the app state on load.
 *
 * Guidelines:
 * 1. At the top, define any helper functions.
 * 2. As much as possible, use URL params to initial the state of the app.
 ******************************************************************************/

// Initialize the timeSeriesControl
c.timeSeriesControl.startSlider.setValue(Date.parse("2022-03-01"), false)
c.timeSeriesControl.endSlider.setValue(Date.parse("2022-07-01"), true)