var createOrbit = function( aphelion, semiMajor, semiMinor, axisRez, material ){
	
	var LOD = new THREE.LOD(),
		LODLevel = 3,
		LODDistance = 3000;

	for (var i = 0; i < LODLevel; i++) {

		axisRez = axisRez / ( i + 1 );
		var axisPoints = [];
		var spline = [];
		
		for( var i = 0; i < axisRez; i++ ) {
			x = ( semiMajor * Math.cos( i / axisRez * Math.PI * 2 ) + ( aphelion - semiMajor ) );
			z = ( semiMinor * Math.sin( i / axisRez * Math.PI * 2 ) );
			axisPoints[i] = new THREE.Vector3( x, 0, z );
		}
			
		spline =  new THREE.ClosedSplineCurve3( axisPoints );
		var splineGeo = new THREE.Geometry();
		var splinePoints = spline.getPoints( axisRez );
		
		for(var i = 0; i < splinePoints.length; i++){
			splineGeo.vertices.push(splinePoints[i]);  
		}
		
		var line = new THREE.Line( splineGeo, material );

		line.updateMatrix();
		line.autoUpdateMatrix = false;
		LOD.addLevel( line, i * LODDistance );	
	}

 return LOD;
};
	

