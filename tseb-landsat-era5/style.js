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
 
function apply(c){
  /*
  Function to apply the style to the component object c
  */
  c.info.titleLabel.style().set(s.bigTitle);
  c.info.titleLabel.style().set(s.bigTopMargin);
  c.info.aboutLabel.style().set(s.aboutText);


  c.timeSeriesControl.title.style().set(s.bigTitle);
  
  c.controlPanel.style().set({
    width: '300px',
    padding: '0px'
  });
 
  // Loop through legends to apply styles
  Object.keys(c.legends).forEach(function(key){
    print(c.legends[key]) // Testing.. 
  });

  
  // Loop through setting divider style.
  Object.keys(c.dividers).forEach(function(key) {
    c.dividers[key].style().set(s.divider);
  });  
  return c;
}
exports.apply=apply;
