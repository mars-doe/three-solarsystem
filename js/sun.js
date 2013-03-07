var uniforms = {

	time: { type: "f", value: 1.0 },
	resolution: { type: "v2", value: new THREE.Vector2() },

	fogDensity: { type: "f", value: 0 },
	fogColor: { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },

	texture1: { type: "t", value: THREE.ImageUtils.loadTexture( "./textures/lava/cloud.png" ) },
	texture2: { type: "t", value: THREE.ImageUtils.loadTexture( "./textures/lava/lavatile.jpg" ) },

	uvScale: { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) }

};


var createSun = function( sunScale ){

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var sunMaterial = new THREE.ShaderMaterial( {

		uniforms: uniforms,
		vertexShader: shaderList.lavashader.vertex,
		fragmentShader: shaderList.lavashader.fragment

	} );

	// var sunMaterial = new THREE.MeshLambertMaterial( { 
	// 	map: THREE.ImageUtils.loadTexture( './models/solarsystem/sunmap.jpg' ), 
	// 	overdraw: true 
	// });

	var sun = createPlanet( 1392684 * sunScale , sunMaterial );
	sun.name = "Sun";

	/********************************
	LENS FLARE
	********************************/

	// var flare = addLensFlare( 0, 0, 0, 5, sunTexture );
	// scene.add( flare );

	return sun;
}

function addLensFlare( x, y, z, size, overrideImage ){

	var flareColor = new THREE.Color( 0xffffff );

	var lensFlare = new THREE.LensFlare( overrideImage, 700, 0.0, THREE.AdditiveBlending, flareColor );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare0.png" );
	var textureFlare2 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare2.png" );
	var textureFlare3 = THREE.ImageUtils.loadTexture( "./textures/lensflare/lensflare3.png" );

	lensFlare.add( textureFlare0, 200, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;

	lensFlare.position = new THREE.Vector3(x,y,z);
	lensFlare.size = size ? size : 16000 ;
	return lensFlare;

}