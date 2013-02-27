// var planetTexture, textureLoader;

var Trajectory = function( start, end, resolution){

	var start,
		end,
		axisRez,
		axisPoints = [],
		spline,
		splineMat,
		splineGeo,
		splinePoints,
		line
	;



	// for( var i = 0; i < axisRez; i++ ) {
	// 	x = semiMaj * Math.cos( i / axisRez * Math.PI * 2 ) * ssScale + ( ( aph - semiMaj ) * ssScale );
	// 	z = semiMin * Math.sin( i / axisRez * Math.PI * 2 ) * ssScale;
	// 	axisPoints[i] = new THREE.Vector3( x, 0, z );
	// }



	return {
		
		// line: line,

   		drawTrajectory: function ( start, end ) {
   			scene.remove(line);
   			
			axisRez = resolution;
			axisPoints = [ start, end ];

			splineMat = new THREE.LineBasicMaterial( { color: 0xff00f0, opacity: 0.25, linewidth: 1 } );

			spline =  new THREE.SplineCurve3( axisPoints );
			splinePoints = spline.getPoints( axisRez );
			splineGeo = new THREE.Geometry();

			for(var i = 0; i < splinePoints.length; i++){
				splineGeo.vertices.push( splinePoints[i] );  
			}

			line = new THREE.Line( splineGeo, splineMat );
			line.updateMatrix();
			scene.add( line );
        },

   // 		drawTrajectory: function ( scene ) {
			// scene.add( line );
   //      },

        removeTrajectory: function( scene ){
        	scene.remove( line );

        }
	}
};
	