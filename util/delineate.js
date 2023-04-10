/*
Module to delineate fields based on a simple pixel-based DBSCAN approach
From: mewagee/field_mapping/delineate.py

*/
var delineate={};
delineate.getCorePix = function(potential_pix, eps){
    /*
    Get the "core" pixels from a potential_pix image
    Applies a circle kernel of radius eps and returns
    the result reprojected at the specified scale
    */
    var minSamples = (2*eps-1)*(2*eps-1) + 4*(! eps%2===0);
    var kernel = ee.Kernel.circle({radius:eps, normalize:false});
    var nn = potential_pix.neighborhoodToBands(kernel).reduce(ee.Reducer.sum());
    var core_veg_pixels = nn.gte(minSamples);
    return core_veg_pixels;
};

delineate.setAreaKm2 = function(feature){
    return feature.set({
        'area': feature.geometry().area(maxError=30).multiply(1e-6) // km2
    });
};

delineate.setAreaHa = function(feature){
    return feature.set({
        'area': feature.geometry().area(maxError=30).multiply(1e-4) // ha
    });
};

delineate.distanceMask = function(core_img, max_dist){
    /*
    Applies a distance-based mask to a core vegetation
    pixels image
    Note: sameFootprint is set to False 
    (see https://developers.google.com/earth-engine/apidocs/ee-image-unmask)
    */
    var distance = core_img
    .unmask(0, false)
    .fastDistanceTransform()
    .sqrt()
    .multiply(ee.Image.pixelArea().sqrt());
    return distance.lt(max_dist).selfMask();
};

delineate.distanceDelineation = function(core_img, geom, 
max_dist, scale, proj, eightConnected){
    /*
    Apply a distance-based mask to a core vegetation pixels image
    and then reduce to vectors. 
    Returns a ee.FeatureCollection
    */
    proj=proj||ee.Projection("EPSG:4326");  //Defaults to EPSG:4326
    eightConnected = eightConnected !== false; // Defaults to true
    var mask = delineate.distanceMask(core_img, max_dist);
    return mask.reduceToVectors({
        geometry:geom,
        crs:proj,
        scale:scale,
        geometryType:'polygon',
        eightConnected:eightConnected,
    })
    .map(delineate.setAreaKm2)
    .set({
        scale: scale,
        max_dist: max_dist,
        });
};

delineate.connectedDelineation = function(core_pix, scale, geom){
    /*
    Use connectedComponents to get labeled objects, 
    then apply reduceToVectors
    Returns a ee.FeatureCollection
    */
    var con = core_pix.int().connectedComponents({
        connectedness : ee.Kernel.plus(1),
        maxSize : 1024
    })
    return con.select('labels').reduceToVectors({
        geometry : geom,
        crs : ee.Projection('EPSG:4326'),
        scale : scale,
        geometryType : 'polygon',
        eightConnected : True,
        maxPixels : 1e10,
    });
};

delineate.fieldDelineation = function(potential_pix_img, geom, eps, grow_distance, scale){
    /*
    Apply DBSCAN to get a core pixels image,
    grow the core pixels image by a grow_distance
    Retrieve the connected_delineation vectors
    Returns a ee.FeatureCollection
    */
    eps = eps||3;
    grow_distance=grow_distance||60;
    scale=scale||30;
    
    core_pix = delineate.getCorePix(potential_pix_img, eps);
    core_pix_grown = delineate.distanceMask(core_pix, grow_distance);
    field_vectors = delineate.connectedDelineation(core_pix_grown, scale, geom);
    return field_vectors;
};

exports.delineate = delineate;
 
// def rank_regions(regions, MIN_AREA=500, HIGH_RANK=999):
//     """
//     Add human-readable keys to the agricultural regions
//     the template is:
//     region_key = ADMINSHORTNAME_RANK

//     where ADMINSHORTNAME is one of the following:
//         2622: 'AS',  # Asir
//         2623: 'BH',  # Al Baha
//         2624: 'EP',  # Eastern Province
//         2625: 'HL',  # Hail
//         2626: 'AJ',  # Al Jawf
//         2627: 'JZ',  # Jizan
//         2628: 'MD',  # Medina
//         2629: 'MK',  # Mekkah
//         2630: 'NJ',  # Najran
//         2631: 'NB',  # Northern borders
//         2632: 'QS',  # Qassim
//         2633: 'RD',  # Riyadh
//         2634: 'TB',  # Tabuk
//     where the number indicates the admin level 1 code from the 
//     FAO/GAUL/2015/level1 product*

//     The RANK is a number indicating the rank in area
//     (where 1 is the largest region) out of all the polygons in the
//     given administrative region. 

//     However, for regions that are less than HIGH_RANK (in the units of
//     the 'area' property of the input feature collection), 
//     the RANK is set to 999.
//     """
//     # FAO/GAUL/2015/level1 Saudi provinces ADM1 codes:
//     admin_codes = ee.List([
//     2622,   
//     2623,
//     2624,
//     2625,
//     2626,
//     2627,
//     2628,
//     2629,
//     2630,
//     2631,
//     2632,
//     2633,
//     2634,
//     ])

//     short_names = ee.List([
//     'AS',
//     'BH',
//     'EP',
//     'HL',
//     'AJ',
//     'JZ',
//     'MD',
//     'MK',
//     'NJ',
//     'NB',
//     'QS',
//     'RD',
//     'TB',
//     ])
    
//     def code_to_str(code):
//         return ee.Number(code).format('%d')
//     admin_codes_str = admin_codes.map(code_to_str)    
//     # ^^ Dictionary.fromLists expects list as strings:
//     region_short_names = ee.Dictionary.fromLists(admin_codes_str, short_names)
    
//     admin = (ee.FeatureCollection("FAO/GAUL/2015/level1")
//     .filter(ee.Filter.eq('ADM0_NAME', 'Saudi Arabia'))
//     )
    
//     # Pre-filter -- remove any regions that don't even match any admin boundary:
//     def check_admin_matches(region):
//         region_geom = region.geometry()
//         admin_matches = admin.filterBounds(region_geom) 
//         nadmin_matches = ee.Number(admin_matches.size())
//         return region.set({'nadmin':nadmin_matches})
    
//     regions = regions.map(check_admin_matches)\
//     .filter(ee.Filter.gt('nadmin',0))
    
//     # Get the admin code based on the centroid
//     def get_admin_code(region):
//         pt = region.geometry().centroid(100).buffer(10000) 
//         # need to buffer the centroid, otherwise we get an error. 
//         admin_region = admin.filterBounds(pt).first()
//         admin_code = ee.String(admin_region.get('ADM1_CODE'))
//         return region.set({'admin_code':admin_code})
    
//     regions = regions.map(get_admin_code)
    
//     # Rank regions for one province
//     # for small regions (area<MIN_AREA) set them to HIGH_RANK
//     def ranked_regions_by_code(code):
//         code_regions = regions.filter(ee.Filter.eq('admin_code', code))
//         code = ee.Number(code)
//         # Add a sequential number to these regions that indicates
//         # their ranked position in terms of area (in ascending order):
//         sid = code_regions.sort('area', False).aggregate_array('system:index')
//         ranks = ee.List.sequence(1, sid.size()) 
//         ranks_dict = ee.Dictionary.fromLists(sid, ranks)
        
//         def add_rank(feature):
//           area = ee.Number(feature.get('area'))
//           rank_id = ee.Number(ee.Algorithms.If(area.gt(MIN_AREA), 
//           ranks_dict.get(feature.get('system:index')),
//           HIGH_RANK))
//           region_short_name = ee.String(region_short_names.get(code.format('%d')))
//           region_key = region_short_name.cat('_').cat(rank_id.format('%03d'))
//           return feature.set({'region_key':region_key, 'rank': rank_id, 'region': region_short_name})
    
//         code_regions = code_regions.map(add_rank)
//         return code_regions
    
//     regions_wkey = ee.FeatureCollection(admin_codes.map(ranked_regions_by_code)).flatten()
//     return regions_wkey
 
