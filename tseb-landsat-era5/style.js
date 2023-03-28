/*******************************************************************************
 * Styling *
 *
 * A section to define and set widget style properties.
 *
 * Guidelines:
 * 1. At the top, define styles for widget "classes" i.e. styles that might be
 *    applied to several widgets, like text styles or margin styles.
 * 2. Set "inline" style properties for single-use styles.
 * 3. You can add multiple styles to widgets, add "inline" style followed by
 *    "class" styles. If multiple styles need to be set on the same widget, do
 *    it consecutively to maintain order.
 ******************************************************************************/

// Define a JSON object for defining CSS-like class style properties.
var s = {};
s.opacityWhiteMed = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)'
};
s.opacityWhiteNone = {
  backgroundColor: 'rgba(255, 255, 255, 0)'
};
s.aboutText = {
  fontSize: '13px',
  color: '505050'
};
s.widgetTitle = {
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '8px 8px 0px 8px',
  color: '383838'
};
s.stretchHorizontal = {
  stretch: 'horizontal'
};
s.noTopMargin = {
  margin: '0px 8px 8px 8px'
};
s.smallBottomMargin = {
  margin: '8px 8px 4px 8px'
};
s.bigTopMargin = {
  margin: '24px 8px 8px 8px'
};
s.divider = {
  backgroundColor: 'F0F0F0',
  height: '4px',
  margin: '20px 0px'
};
s.bigTitle={
    fontSize: '20px',
    fontWeight: 'bold'
  };
s.widget={
    width: '280px',
    padding: '10px',
    margin: '10px 10px',
}
 
function apply(c){
  /*
  Function to apply the style to the component object c
  */
  c.info.titleLabel.style().set(s.bigTitle);
  c.info.titleLabel.style().set(s.bigTopMargin);
  c.info.aboutLabel.style().set(s.aboutText);


  c.timeSeriesControl.title.style().set(s.bigTitle);
  c.timeSeriesControl.label.style().set(s.widgetTitle)
  c.timeSeriesControl.startSlider.style().set(s.widget);
  c.timeSeriesControl.endSlider.style().set(s.widget);
  c.timeSeriesControl.panel.style().set({
    width: '300px',
    padding: '0px'
  })
  
  c.controlPanel.style().set({
    width: '300px',
    padding: '0px'
  });
 
  // Loop through legends components to apply styles
  Object.keys(c.legendTitles).forEach(function(key){
    c.legendTitles[key].style().set({
    fontWeight: 'bold',
    fontSize: '12px',
    color: '383838'
  });
  c.legendTitles[key].style().set(s.opacityWhiteNone);
  });
  Object.keys(c.legendLabels).forEach(function(key){
    c.legendLabels[key].style().set({
    margin: '4px 8px',
    fontSize: '12px'
  });
  c.legendLabels[key].style().set(s.opacityWhiteNone);
  });
  Object.keys(c.legendCenterLabels).forEach(function(key){
    c.legendCenterLabels[key].style().set({
    margin: '4px 8px',
    fontSize: '12px',
    textAlign: 'center',
    stretch: 'horizontal'
  });
  c.legendCenterLabels[key].style().set(s.opacityWhiteNone);
  });
  Object.keys(c.legendColorBars).forEach(function(key){
    c.legendColorBars[key].style().set({
    stretch: 'horizontal',
    margin: '0px 8px',
    maxHeight: '20px'
    })
  });
  Object.keys(c.legends).forEach(function(key){
    c.legends[key].style().set({
    position: 'bottom-left',
    width: '300px',
    padding: '0px'
    });
  c.legends[key].style().set(s.opacityWhiteNone);
  });

  
  // Loop through setting divider style.
  Object.keys(c.dividers).forEach(function(key) {
    c.dividers[key].style().set(s.divider);
  });  
  return c;
}
exports.apply=apply;
