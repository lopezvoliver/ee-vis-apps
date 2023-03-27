
/*******************************************************************************
 * Components *
 *
 * A section to define the widgets that will compose your app.
 *
 * Guidelines:
 * 1. Except for static text and constraints, accept default values;
 *    initialize others in the initialization section.
 * 2. Limit composition of widgets to those belonging to an inseparable unit
 *    (i.e. a group of widgets that would make no sense out of order).
 * 
 * 
 * Components:
 * 0: Introduction
 *  - Title
 *  - Text 
 * 1: Time series control
 *  - Select start and end dates
 *  - Start date slider
 *  - End date slider
 * 2. Basemap control
 *  - Band selector
 *  - Colormap
 ******************************************************************************/
function make_components(m){
// Define a JSON object for storing UI components.
var c = {};

// Define a control panel for user input.
c.controlPanel = ui.Panel();

// Define a series of panel widgets to be used as horizontal dividers.
c.dividers = {};
c.dividers.divider1 = ui.Panel();
c.dividers.divider2 = ui.Panel();
c.dividers.divider3 = ui.Panel();

// The map
c.map = ui.Map();   

// 0. App introduction panel
c.info = {};
c.info.titleLabel = ui.Label('tseb-landsat-era5 image collection');
c.info.aboutLabel = ui.Label(
  'Visualization of the tseb-landsat-era5 collection. ' + 
  'Select a period to reduce the image collection (mean) and explore '+
  'the available data.' 
  );
c.info.panel = ui.Panel([
  c.info.titleLabel, 
  c.info.aboutLabel
]);

// 1. Time series control. 
c.timeSeriesControl = {};
c.timeSeriesControl.title = ui.Label('Time series control');
c.timeSeriesControl.label = ui.Label('Select start and end dates 📅');
c.timeSeriesControl.startSlider = ui.DateSlider({period: 1, 
    start: m.dataDateRange.init_start,
    end: m.dataDateRange.init_end
});
c.timeSeriesControl.endSlider = ui.DateSlider({period: 1,
    start: m.dataDateRange.init_start,
    end: m.dataDateRange.init_end
});
c.timeSeriesControl.panel = ui.Panel([
  c.timeSeriesControl.title,
  c.timeSeriesControl.label,
  c.timeSeriesControl.startSlider,
  c.timeSeriesControl.endSlider
  ]);

// 2. Band selector. 
c.selectBand = {};
c.selectBand.label = ui.Label('Select an image to display');
c.selectBand.selector = ui.Select(Object.keys(m.imgInfo.bands)); 

c.selectBand.legend = {};
c.selectBand.legend.title = ui.Label();
c.selectBand.legend.colorbar = ui.Thumbnail(ee.Image.pixelLonLat().select(0));
c.selectBand.legend.leftLabel = ui.Label('[min]');
c.selectBand.legend.centerLabel = ui.Label();
c.selectBand.legend.rightLabel = ui.Label('[max]');
c.selectBand.legend.labelPanel = ui.Panel({
  widgets: [
    c.selectBand.legend.leftLabel,
    c.selectBand.legend.centerLabel,
    c.selectBand.legend.rightLabel,
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});
c.selectBand.legend.panel = ui.Panel([
  c.selectBand.legend.title,
  c.selectBand.legend.colorbar,
  c.selectBand.legend.labelPanel
]);
c.selectBand.panel = ui.Panel([c.selectBand.label, 
    c.selectBand.selector, c.selectBand.legend.panel]);
return c
}
exports.makec = make_components;