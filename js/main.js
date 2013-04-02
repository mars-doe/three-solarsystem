var WIDTH = $(window).width(),
    HEIGHT = $(window).height();

var VIEW_ANGLE = 45,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 1,
	FAR = 100000;

var stats, 
	scene,
	camera,
	renderer, 
	projector,
	composer, 
	controls,
	tween,
	camTarget,
	solarSystem,
	debugGrid,
	debugAxis;

var timer;

var clock = new THREE.Clock();

var departure_time = new Time( { Yr:2014, Mon:4, D:7, Hr:1, Mn:1, S:1 } );
var arrival_time = new Time( { Yr:2014, Mon:9, D:24, Hr:1, Mn:1, S:1 } );

var mouse = { x: -1000, y: 0 }, 
	INTERSECTED,
	CLICKED,
	clickMove = true;

var dae;
var loader = new THREE.ColladaLoader();


/********************************
	PAGE LOADING
********************************/

function setLoadMessage( msg ){
	$( '#loadtext' ).html(msg + "...");
}

$(document).ready( function() {

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	$( '#loadtext' ).show();
	setLoadMessage("Loading the Solar System");

	loader.options.convertUpAxis = true;
	loader.load( './models/galaxy.dae', function ( collada ) {

		dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 60000;
		dae.updateMatrix();

	} );

	loadShaders( shaderList, function (e) {
		shaderList = e;
		postShadersLoaded();
	});

	var postShadersLoaded = function () {
	        init();
	        animate();
			$("#loadtext").hide();
    };
} );

function init() {

	/********************************
		SCENE SETUP
	********************************/
	$container = $("#container");

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.00005 );

	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
	camera.position.set( 100, 500, 1000 );


	camTarget = new THREE.Vector3();
	camTarget = scene.position;

	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * HEIGHT;
	
	var ambientLight = new THREE.AmbientLight( 0x404040 );
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF, 1.3);

	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	scene.add(pointLight);

	/********************************
		RENDERER
	********************************/
	projector = new THREE.Projector();

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$container.append( renderer.domElement );
	renderer.autoClear = false;

	controls = new THREE.OrbitControls( camera, $container[0] );
	controls.addEventListener( 'change', render );

	setupScene();
	
	camOne = new camPosition( { x: 0, y: 100, z: 500 }, { x: 0, y: 0, z: 0 }, 1500 );
	camTwo = new camPosition( { x: 0, y: 750, z: 50 }, { x: 0, y: 0, z: 0 }, 2000 );
	camThree = new camPosition( { x: -500, y: 250, z: -1000 }, { x: 0, y: 0, z: 0 }, 3000 );
	camEarth = new camPosition( { x: 50, y: 50, z: 250 }, ss[3].position, 1500 );
	camMars = new camPosition( { x: 75, y: 50, z: 300 }, ss[4].position, 1500 );

	timer = new Timer();
	timer.count = 0;
	timer.multiplier = .025;
	timer.JD = new Date().Date2Julian();
	buildGUI();

	/********************************
		STATS
	********************************/

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

}

function buildGUI(){

	var gui = new dat.GUI();
	gui.add( timer, 'multiplier', -5, 5).name( 'Orbit Speed' );
	gui.add(ssScale, 's', .000001, .00001)
		.name('SS Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'sunScale', .000001, .0001)
		.name('Sun Scale')
		.onChange( function(){
			scaling = true;
		});
	gui.add(ssScale, 'planetScale', .000001, .01)
		.name('Planet Scale')
		.onChange( function(){
			scaling = true;
	});

	var camFolder = gui.addFolder( 'Camera Positions' );
	camFolder.open();
	camFolder.add( camOne, 'tween' ).name( 'Camera Home' );
	camFolder.add( camTwo, 'tween' ).name( 'Camera Two' );
	camFolder.add( camThree, 'tween' ).name( 'Camera Three' );
	camFolder.add( camEarth, 'tween' ).name( 'Camera Earth' );
	camFolder.add( camMars, 'tween' ).name( 'Camera Mars' );
}

var marsOdyssey;

function setupScene(){
	// geo = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshLambertMaterial( { color: 0xCC0000, opacity:0 } ) );
	// scene.add(geo);

	// var SUNmat = new THREE.MeshBasicMaterial( { 
	// 		map: THREE.ImageUtils.loadTexture( './images/solarsystem/sunflatmap.jpg' ), 
	// 		overdraw: true 
	// });
	// SUNmat.alphaTest = .75;
	// SUN = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), SUNmat );
	// scene.add( SUN );

	// debugGrid = new debugGrid(-1, 100, 1000);
	// scene.add(debugGrid);

	// object = new THREE.AxisHelper( 500 );
	// object.position.set( 0, 0, 0 );
	// scene.add( object );

	marsOdyssey = new MarsOdyssey();
	marsOdyssey.init( departure_time, arrival_time );

	solarSystem = makeSolarSystem();
	solarSystem.rotation.x = -2;

	starField = new stars( 25000, 40000, 100 );
	solarSystem.add( starField );

	lensFlares = new THREE.Object3D();
	var override = THREE.ImageUtils.loadTexture( "./images/lensflare/hexangle.png" );
	var sunFlare = addLensFlare( 0, 0, 5, 5, override );
	scene.add( sunFlare );


	// var ruler = new Ruler( ss[3], ss[4] );
	// scene.add( ruler );
	
	scene.add( dae );
	scene.add( solarSystem );
	scene.add( lensFlares );

	ss[1].orbit.rotation.set( 2.25, -1.9, .19);
	ss[3].orbit.rotation.set( 2, 0, -.003);
	ss[2].orbit.rotation.set( 2, 0, -.05);
	ss[4].orbit.rotation.set( 1.99, 2.7, .025);
	ss[5].orbit.rotation.set(1.99, -2.1,0);
	ss[6].orbit.rotation.set(2.025, -2, 0.075);
	ss[7].orbit.rotation.set( 1.98, -.25, -.015);
	ss[8].orbit.rotation.set( 2.005, 1.25, -.034);
}

function onDocumentMouseDown( event ) {

	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	intersects = raycaster.intersectObjects( solarSystem.children );

	if ( intersects.length > 0 ) {

		// if ( CLICKED != intersects[ 0 ].object ) {

			CLICKED = intersects[ 0 ].object;

			if( clickMove ){
				var posCLICKED = new THREE.Vector3();
				posCLICKED.getPositionFromMatrix( CLICKED.matrixWorld );

				var zScale = 250;
				lookAtCLICKED = { x: posCLICKED.x + 50, y: posCLICKED.y + 50, z: posCLICKED.z + zScale };

				var camCLICKED = new camPosition( lookAtCLICKED, posCLICKED, 1000 );
				camCLICKED.tween();
			}
			console.log(CLICKED.name);
		// }
	} 
}

function onDocumentMouseMove( event ) {

	event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {

	windowHalfX = $(window).width() / 2;
	windowHalfY = $(window).height() / 2;

	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

	camera.aspect = $(window).width() / $(window).height();
	camera.updateProjectionMatrix();

	renderer.setSize( $(window).width(), $(window).height() );

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();
	camera.lookAt( camTarget );

	lensFlares.lookAt(camera.position);

	updateRulers();
    updateLabels();
	controls.update();
	stats.update();
	TWEEN.update();
	setSolarSystemScale();

	planetsOrbit( timer.JD );

	// console.log( departure_time.jd_tt() );
	if (marsOdyssey != null ) {
		marsOdyssey.drawTrajectory( timer.JD, ssScale.s );
	}

	uniforms.time.value = timer.JD / 20;

	timer.JD = timer.JD + timer.multiplier;
	camera.lookAt( camTarget );
	render();
}

function render() {

	renderer.clear();
	renderer.render( scene, camera );

}