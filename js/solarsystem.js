

var planetName = [ "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune" ];
var planetSize = [ 2439.7, 6051.8, 6371.00, 3389.5, 69911, 58232, 25362, 24622 ];
var semiMinor = [];
var semiMajor = [ 57909227, 108209475, 149598262, 227943824, 778340821, 1426666422, 2870658186, 4498396441 ];
var eccentricity = [ 0.20563593, 0.00677672, 0.01671123, 0.0933941,	0.04838624,	0.05386179,	0.04725744,	0.00859048 ];
var aphelion = [ 69817445, 108942780, 152098233, 249232432, 816001807, 1503509229, 3006318143, 4537039826 ];
var orbitTime = [ 88.0, 224.7, 365.2, 687, 4332, 10760, 30700, 60200 ];
var planetTexture = [
		'./models/solarsystem/mercurymap.jpg',
		'./models/solarsystem/venusmap.jpg',
		'./models/solarsystem/earthmap.jpg',
		'./models/solarsystem/marsmap.jpg',
		'./models/solarsystem/jupitermap.jpg',
		'./models/solarsystem/saturnmap.jpg',
		'./models/solarsystem/uranusmap.jpg',
		'./models/solarsystem/neptunemap.jpg',
	];

var axisRez = 50;
var sunScale = .00001, planetScale = .001, ssScale = .000001;				

var sun, planets = [], orbits = [];


function findSemiMinor(){
	for( var i = 0; i < semiMajor.length; i++ ){
		semiMinor.push( semiMajor[i] * Math.sqrt( 1 - eccentricity[i] * eccentricity[i] ) );
	}
};

function makeSolarSystem(){

	findSemiMinor();

	var solarSystem = new THREE.Object3D();

	sun = createSun( sunScale );
	solarSystem.add( sun );

	createLabel( "Sun", sun, 1, container );

	// CREATE EACH PLANET
	for ( var i = 0; i < 8; i ++ ) {

		var planetMaterial = new THREE.MeshLambertMaterial( { 
				map: THREE.ImageUtils.loadTexture( planetTexture[i]), 
				overdraw: true 
		});

		var axisMaterial = new THREE.LineBasicMaterial( { 
			color: 0xF22E2E, 
			opacity: .5, 
			linewidth: .5 
		});

		planets.push( createPlanet( planetSize[i] * planetScale , planetMaterial ) );
		planets[i].setOrbit( semiMajor[i], semiMinor[i], aphelion[i], eccentricity[i], orbitTime[i], ssScale );
		planets[i].name = planetName[i];

		orbits.push( createOrbit( aphelion[i], semiMajor[i], semiMinor[i], axisRez, axisMaterial ) );
		orbits[i].name = planetName[i] + " Orbit";

		solarSystem.add( planets[i] );
		solarSystem.add( orbits[i] );

		createLabel( planetName[i], planets[i], 1, container );

	};

	return solarSystem;
};