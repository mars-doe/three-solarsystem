var Planet = function( radius, segW, segH, texture ){

	var 
		planetTexture,
		textureLoader,
		lod,
		geometry,
		material,
		mesh,
		semiMaj,
		semiMin,
		aph,
		eccen,
		line,
		spline,
		splineGeo,
		splineMat,
		splinePoints,
		axisPoints
	;

	planetTexture = new THREE.Texture();
	textureLoader = new THREE.ImageLoader();

	textureLoader.addEventListener( 'load', function ( event ) {

		planetTexture.image = event.content;
		planetTexture.needsUpdate = true;

		});

	textureLoader.load( texture );

	lod = new THREE.LOD();
	material = new THREE.MeshLambertMaterial( { map: planetTexture, overdraw: true } );

	for (var i = 0; i < 3; i++) {
		geometry = new THREE.SphereGeometry( radius, segW / ( i + 1) , segH / ( i + 1 ) );
		mesh = new THREE.Mesh( geometry, material);
		mesh.updateMatrix();
		mesh.autoUpdateMatrix = false;
		lod.addLevel( mesh, i * 10000);	
	}
	
	lod.updateMatrix();

	return {

		mesh: lod,

    	drawPlanet: function ( scene ) {
				scene.add( lod );
            },

    	removeFrom: function ( scene ) {
				scene.remove( lod );
            },

		setOrbit: function( semiMajor, aphelion, eccentricity, ssScale ){

			semiMaj = semiMajor; 
			aph = aphelion; 
			eccen = eccentricity;

			semiMin = semiMajor * Math.sqrt( 1 - eccentricity * eccentricity ); 

			lod.position.x = semiMaj * Math.cos( axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
			lod.position.z = semiMin * Math.sin( axisRez * Math.PI * 2 ) * ssScale;

		},

		drawOrbit: function( axisRez ){

			axisPoints = [];
			spline = [];

			splineMat = new THREE.LineBasicMaterial( { color: 0xff00f0, opacity: 0.25, linewidth: 1 } );

			for( var i = 0; i < axisRez; i++ ) {
				x = semiMaj * Math.cos( i / axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
				z = semiMin * Math.sin( i / axisRez * Math.PI * 2 ) * ssScale;
				axisPoints[i] = new THREE.Vector3( x, 0, z );
			}
			
			spline =  new THREE.ClosedSplineCurve3( axisPoints );
			splineGeo = new THREE.Geometry();
			splinePoints = spline.getPoints( axisRez );
			
			for(var i = 0; i < splinePoints.length; i++){
				splineGeo.vertices.push(splinePoints[i]);  
			}
			
			line = new THREE.Line( splineGeo, splineMat );
			scene.add( line );

		},

		removeOrbit: function( scene ){
			scene.remove( line );
		},

		startOrbit: function( time, days ){
			var orbitTime = time / days;
			lod.position.x = semiMaj * Math.cos( axisRez * Math.PI * 2 + orbitTime) * ssScale + ( ( aph - semiMaj ) * ssScale );
			lod.position.z = semiMin * Math.sin( axisRez * Math.PI * 2 + orbitTime) * ssScale;
			lod.rotation.y = time;
			// console.log(time);
		}
	}
};
	