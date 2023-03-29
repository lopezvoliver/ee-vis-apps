
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
c.timeControl = {};
c.timeControl.title = ui.Label('Time series control');
c.timeControl.label = ui.Label('Select start and end dates 📅');
c.timeControl.startSlider = ui.DateSlider({period: 1, 
    start: m.dataDateRange.init_start,
    end: m.dataDateRange.init_end
});
c.timeControl.endSlider = ui.DateSlider({period: 1,
    start: m.dataDateRange.init_start,
    end: m.dataDateRange.init_end
});
c.timeControl.panel = ui.Panel([
  c.timeControl.label,
  c.timeControl.startSlider,
  c.timeControl.endSlider
  ]);

// 2. Legends: one for each band (if showColorBar is true)
c.legends = [];
c.legendTitles = [];
c.legendLabels = []; // Left and right labels.
c.legendCenterLabels=[];
c.legendColorBars=[];

function addColorBar(band_key){
    var bandInfo = m.imgInfo.bands[band_key];
    if(bandInfo.showColorBar){
        var title = ui.Label(bandInfo.colorBarName);
        c.legendTitles.push(title);
        var visParams = bandInfo.vis;
        var min = visParams.min;
        var max = visParams.max;
        var leftLabel = ui.Label(min)
        c.legendLabels.push(leftLabel)
        var centerLabel = ui.Label(min/2 + max/2)
        c.legendCenterLabels.push(centerLabel)
        var rightLabel = ui.Label(max)
        c.legendLabels.push(rightLabel)
        var colorbar = ui.Thumbnail({
            image:ee.Image.pixelLonLat().select(0),
            params: {
                bbox:[min,0,max,0.1],
                dimensions:'100x10',
                format:'png',
                min:min,
                max:max,
                palette:visParams.palette
            }
        }); 
        c.legendColorBars.push(colorbar)
        var labelPanel = ui.Panel({
            widgets:[leftLabel, centerLabel, rightLabel],
            layout: ui.Panel.Layout.flow("horizontal")
        });
        c.legends.push(ui.Panel([title, colorbar, labelPanel]));
    }
}

Object.keys(m.imgInfo.bands).map(addColorBar);

c.legendPanel = ui.Panel(c.legends)

return c
}
exports.makec = make_components;