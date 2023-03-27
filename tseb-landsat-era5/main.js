/*******************************************************************************
 * Model *
*******************************************************************************/
var model = require('users/oliverlopez/mewa-apps:tseb-landsat-era5/model.js');
var m = model.m;

/*******************************************************************************
 * Components *
*******************************************************************************/
var components = require('users/oliverlopez/mewa-apps:tseb-landsat-era5/components.js');
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
c.controlPanel.add(c.dividers.divider1);
c.controlPanel.add(c.selectBand.panel);
ui.root.add(c.controlPanel);
ui.root.add(c.map);