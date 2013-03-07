var createPlanet = function( size, material ){

	var LOD = new THREE.LOD(),
		LODLevel = 3,
		LODDistance = 3000;

	for ( var i = 0; i < LODLevel; i++ ) {

		var geometry = new THREE.SphereGeometry( size, 15 / ( i + 1) , 15 / ( i + 1 ) );
		var planet = new THREE.Mesh( geometry, material );

		planet.updateMatrix();
		planet.autoUpdateMatrix = false;
		LOD.addLevel( planet, i * LODDistance );	
		LOD.updateMatrix();
		LOD.updateMatrix();
	};

	LOD.setOrbit = function( semiMajor, semiMinor, aphelion, eccentricity, orbitTime, ssScale ){
		this.semiMajor = semiMajor;
		this.semiMinor = semiMinor;
		this.aphelion = aphelion;
		this.eccentricity = eccentricity;
		this.orbitTime = orbitTime;

		this.orbit( 0, this.orbitTime );
	};

	LOD.orbit = function( time, days ){

		var orbitSpeed = time / days;
		this.position.x = ssScale * ( this.semiMajor * Math.cos( axisRez * Math.PI * 2 + orbitSpeed ) + ( this.aphelion - this.semiMajor ) );
		this.position.z = ssScale * ( this.semiMinor * Math.sin( axisRez * Math.PI * 2 + orbitSpeed ) );
	};

	return LOD;
};
	


