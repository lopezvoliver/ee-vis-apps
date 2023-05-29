
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
c.info.titleLabel = ui.Label('Annual field data');
c.info.aboutLabel = ui.Label(
  'Visualization of the annual field data. ' + 
  'Select the year to visualize. Draw an ROI to show the aggregated data over the ROI.'
  );
c.info.panel = ui.Panel([
  c.info.titleLabel, 
  c.info.aboutLabel
]);

// Year control
// ui.Slider(min, max, value, step, onChange, direction, disabled, style)
c.yearControl = {};
c.yearControl = ui.Slider({
    min: m.yearsRange.start,
    max: m.yearsRange.end, 
    step: 1 
});

// DrawingTools (for user-defined ROI)
c.drawingTools = c.map.drawingTools();

// A display panel to show the ROI aggregated values
c.display = {};
c.display.title=ui.Label("")
var labels = [c.display.title]
c.display.labels={}; // a dictionary, so we can find it by column_key
function addDisplayLabel(column_key){
  // Initially, the labels are empty
  // and store them in c.display.labels
  c.display.labels[column_key] = ui.Label();
  labels.push(c.display.labels[column_key]);
}
// Add the empty labels to a panel:
Object.keys(m.dataInfo.columns).map(addDisplayLabel)
c.display.Panel = ui.Panel(labels);

// Legends: one for each band (if showColorBar is true)
c.legends = [];
c.legendTitles = [];
c.legendLabels = []; // Left and right labels.
c.legendCenterLabels=[];
c.legendColorBars=[];

function addColorBar(column_key){
    var columnInfo = m.dataInfo.columns[column_key];
    if(columnInfo.showLayer){
        var title = ui.Label(columnInfo.colorBarName);
        c.legendTitles.push(title);
        var visParams = columnInfo.vis;
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

Object.keys(m.dataInfo.columns).map(addColorBar);

c.legendPanel = ui.Panel(c.legends)

return c
}
exports.makec = make_components;