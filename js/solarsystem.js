var ss = [], 
	sun, 
	ssScale;

var ssBodies = [
	{
		name: 'Sun',
		texture: './images/solarsystem/sunmap.jpg',
		size: 1392684
	},{
		name: 'Mercury',
		texture: './images/solarsystem/mercurymap.jpg',
		size: 2439.7,
		period: 87.96926,
	},{
		name: 'Venus',
		texture: './images/solarsystem/venusmap.jpg',
		size: 6051.8,
		period: 224.7008,
	},{
		name: 'Earth',
		texture: './images/solarsystem/earthmap2.jpg',
		size: 6371.00,
		period: 365.25636,               
	},{
		name: 'Mars',
		texture: './images/solarsystem/marsmap.jpg',
		size: 3389.5,
		period: 686.97959,
	},{
		name: 'Jupiter',
		texture: './images/solarsystem/jupitermap.jpg',
		size: 69911,
		period: 4332.8201,
	},{
		name: 'Saturn',
		texture: './images/solarsystem/saturnmap.jpg',
		size: 58232,
		period: 10755.699,             
	},{
		name: 'Uranus',
		texture: './images/solarsystem/uranusmap.jpg',
		size: 30687.153,
		period: 30700,                  

	},{
		name: 'Neptune',
		texture: './images/solarsystem/neptunemap.jpg',
		size: 24622,
		period: 60190.03,
	}	
]

var solarSystemScale = function(){
	this.s = .000001;	
	this.sunScale = .00001;
	this.planetScale = .001;
	return this;
} 				

function planetsOrbit( time ){
	for ( var i = 1; i < ss.length; i ++ ) {
        var planet = ss[i];
		ss[i].orbiting( time, ssScale.s );
	}

}	

function setSolarSystemScale(){

	var sunS = 1392684 * ssScale.sunScale;
	ss[0].scale.set( sunS, sunS, sunS );

	for ( var i = 1; i < ss.length; i ++ ) {
		var planetS = ssBodies[i].size * ssScale.planetScale;
		ss[i].scale.set( planetS, planetS, planetS );
		// ss[i].orbit.scale.set( ssScale.s, ssScale.s, ssScale.s );
    }
}

function makeSolarSystem(){

	ssScale = new solarSystemScale();
	ssScale.s = .000001;
	ssScale.sunScale = .00001;
	ssScale.planetScale = .001;

	var ss3D = new THREE.Object3D();

	ss.push(  new Sun() );
	ss[0].rotation.x = 0;
	ss3D.add( ss[0] );

	ss[0].label = new Label( ss[0], 1, container );

	for ( var i = 1; i < ssBodies.length; i ++ ) {

		var planetMaterial = new THREE.MeshLambertMaterial( { 
				map: THREE.ImageUtils.loadTexture( ssBodies[i].texture ), 
				overdraw: true 
		});

		// var axisMaterial = new THREE.LineBasicMaterial( { 
		// 	color: 0x202020, 
		// 	opacity: .5, 
		// 	linewidth: .5 
		// });
	
		ss.push( new Planet( planetMaterial, i ) );
		ss[i].rotation.x = 0;
		ss[i].name = ssBodies[i].name;

		ss3D.add( ss[i] );
		ss[i].label = new Label( ss[i], 1, container );
	}

	return ss3D;
};
