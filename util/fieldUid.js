/*
Assign a spatial Unique ID based on lon/lat within a certain precision

The precision is set to 0.001 degrees
*/
function assign(f){
  var coords =f.centroid(100).geometry().coordinates()
  var lon = ee.Number(coords.get(0)).multiply(1e3).toInt()
  var lat = ee.Number(coords.get(1)).multiply(1e3).toInt()
  var uid = lat.leftShift(12).bitwiseAnd(0xfff000).bitwiseOr(lon.bitwiseAnd(0x000fff))
  return f.set({uid:uid})
}
exports.assign = assign;