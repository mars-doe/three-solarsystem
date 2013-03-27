var ss = [], 
	sun, 
	planets = [], 
	ssScale,
	scaling = true,
	prevTime = 0;

var solarSystemScale = function(){
	this.s = .000001;	
	this.sunScale = .00001;
	this.planetScale = .001;
	return this;
} 				

function planetsOrbit( time ){
	// if( time > prevTime ){
		for ( var i = 1; i < ss.length; i ++ ) {
	        var planet = ss[i];
			ss[i].orbiting( time, ssScale.s );
		}
		prevTime = time;
}	

function setSolarSystemScale(){
	if ( scaling ){
		var sunS = 1392684 * ssScale.sunScale;
		ss[0].scale.set( sunS, sunS, sunS );

		for ( var i = 1; i < ss.length; i ++ ) {
			var planetS = ephemeris[i].size * ssScale.planetScale;
			ss[i].scale.set( planetS, planetS, planetS );
			// ss[i].orbit.scale.set( ssScale.s, ssScale.s, ssScale.s );
	    }

	scaling = false;

	}
}

function makeSolarSystem(){

	ssScale = new solarSystemScale();
	ssScale.s = .000001;
	ssScale.sunScale = .00001;
	ssScale.planetScale = .001;

	var ss3D = new THREE.Object3D();

	sun = new Sun();
	ss.push( sun );
	ss3D.add( ss[0] );

	ss[0].label = new Label( ss[0], 1, container );

	for ( var i = 1; i < ephemeris.length; i ++ ) {

		var planetMaterial = new THREE.MeshLambertMaterial( { 
				map: THREE.ImageUtils.loadTexture( ephemeris[i].texture ), 
				overdraw: true 
		});

		var axisMaterial = new THREE.LineBasicMaterial( { 
			color: 0x202020, 
			opacity: .5, 
			linewidth: .5 
		});
	
		ss.push( new Planet( planetMaterial, i ) );
		ss[i].name = ephemeris[i].name;
		ss3D.add( ss[i] );
		ss[i].label = new Label( ss[i], 1, container );

	}

	return ss3D;
};
