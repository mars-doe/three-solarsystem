var uniforms = {

	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },

	fogDensity: { type: "f", value: 0 },
	fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },

	texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "./images/lava/cloud.png" ) },
	texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "./images/lava/lavatile.jpg" ) },

	uvScale: { type: "v2", value: new THREE.Vector2( 1, 1 ) }

};


var createSun = function( sunScale ){

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.MirroredRepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.MirroredRepeatWrapping;

	var sunMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: shaderList.lavashader.vertex,
		fragmentShader: shaderList.lavashader.fragment

	} );

	// var sunMaterial = new THREE.MeshLambertMaterial( { 
	// 	map: THREE.ImageUtils.loadTexture( './models/solarsystem/sunmap.jpg' ), 
	// 	overdraw: true 
	// });
	
	var scale = 1392684 * sunScale;
	var sun = createPlanet( 1 , sunMaterial );
	sun.scale.set( scale, scale, scale );
	sun.name = "Sun";

	/********************************
	LENS FLARE
	********************************/
	return sun;
}
