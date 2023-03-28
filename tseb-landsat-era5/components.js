
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
 * 2. Colorbars
 *  - Colorbar title, image, min, middle, max values
 *  Need to create one for each band. 
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
  //c.timeSeriesControl.title,
  c.timeSeriesControl.label,
  c.timeSeriesControl.startSlider,
  c.timeSeriesControl.endSlider
  ]);

// 2. Legends: one for each band.
c.legends = [];

function addColorBar(band_key){
    var title = ui.Label("band_key");
    var visParams = m.imgInfo.bands[band_key].vis;
    var min = visParams.min;
    var max = visParams.max;
    var leftLabel = ui.Label(min)
    var centerLabel = ui.Label(min/2 + max/2)
    var rightLabel = ui.Label(max)
    var colorbar = ui.Thumbnail({
        image:ee.Image.pixelLonLat().select(0),
        bbox:[min,0,max,0.1],
        dimensions:'100x10',
        format:'png',
        min:min,
        max:max,
        palette:visParams.palette
    }); 
    var labelPanel = ui.Panel({
        widgets:[leftLabel, centerLabel, rightLabel],
        layout: ui.Panel.layout.flow("horizontal")
    });
    c.legends.push(ui.Panel([title, colorbar, labelPanel]));
}

Object.keys(m.imgInfo.bands).map(addColorBar);

c.legendPanel = ui.Panel(c.legends)

return c
}
exports.makec = make_components;