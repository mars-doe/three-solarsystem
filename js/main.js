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
	camTarget;

var trajectory;

var timer, time;
var clock = new THREE.Clock();

var mouse = { x: 0, y: 0 }, 
	INTERSECTED;

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
		dae.scale.x = dae.scale.y = dae.scale.z = 50000;
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
	camera.position.y = 50;
	camera.position.z = 500;

	camTarget = new THREE.Vector3();
	camTarget = scene.position;

	fovValue = 0.5 / Math.tan(camera.fov * Math.PI / 360) * HEIGHT;
	
	var ambientLight = new THREE.AmbientLight();
	ambientLight.color.setRGB( .15, .15, .15 );
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	scene.add(pointLight);

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	/********************************
		RENDERER
	********************************/
	projector = new THREE.Projector();

	renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
	renderer.setSize( WIDTH, HEIGHT );

	$container.append( renderer.domElement );
	renderer.autoClear = false;

	setupScene();
	
	camOne = new camPosition( { x: 0, y: 50, z: 500 }, { x: 0, y: 0, z: 0 }, 1500 );
	camTwo = new camPosition( { x: 0, y: 12000, z: 500 }, { x: 0, y: 0, z: 0 }, 5000 );
	camThree = new camPosition( { x: -500, y: 250, z: -1000 }, { x: 0, y: 0, z: 0 }, 3000 );
	camEarth = new camPosition( { x: 50, y: 50, z: 250 }, planets[2].position.clone(), 1500 );
	camMars = new camPosition( { x: 75, y: 50, z: 300 }, planets[3].position.clone(), 1500 );
	
	timer = function(){
		this.count = 0;
		this.multiplier = 1;
		return this;
	}

	time = new timer();

	buildGUI();

	/********************************
		POST-PROCESSING
	********************************/

	// var renderModel = new THREE.RenderPass( scene, camera );
	// // var effectBloom = new THREE.BloomPass( 1.25 );
	// var effectFilm = new THREE.FilmPass( 0.35, 0.95, 2048, false );

	// effectFilm.renderToScreen = true;

	// composer = new THREE.EffectComposer( renderer );

	// composer.addPass( renderModel );
	// // composer.addPass( effectBloom );
	// composer.addPass( effectFilm );

	/********************************
		STATS
	********************************/

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$container.append( stats.domElement );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

}

function buildGUI(){

	var gui = new dat.GUI();
	gui.add( time, 'multiplier', 0, 20).name( 'Orbit Speed' );

	var labelFolder = gui.addFolder( 'Label Visibility' );
	labelFolder.open();
	for ( var i in labels ){
		labelFolder.add( labels[i], 'visible' ).name( labels[i].name + ' label'  );
	}

	var camFolder = gui.addFolder( 'Camera Positions' );
	camFolder.open();
	camFolder.add( camOne, 'tween' ).name( 'Camera Home' );
	camFolder.add( camTwo, 'tween' ).name( 'Camera Two' );
	camFolder.add( camThree, 'tween' ).name( 'Camera Three' );
	camFolder.add( camEarth, 'tween' ).name( 'Camera Earth' );
	camFolder.add( camMars, 'tween' ).name( 'Camera Mars' );

}


function setupScene(){
	trajectory = new Trajectory ( 2 );
	solarSystem = makeSolarSystem();
	starField = new Stars( 40000, 100 );
	solarSystem.add( starField );

	scene.add( dae );
	scene.add( solarSystem );
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

	updateLabels();

	renderer.setSize( $(window).width(), $(window).height() );

	// composer.reset();

}

function animate() {

	requestAnimationFrame( animate );

    camera.updateProjectionMatrix();

	updateLabels();
	controls.update();
	stats.update();
	TWEEN.update();

	camera.lookAt( camTarget );

	scene.updateMatrixWorld();
	scene.traverse( function ( object ) {
			if ( object instanceof THREE.LOD ) {
			object.update( camera );
		}
	} );

	var delta = clock.getDelta();
	uniforms.time.value += 0.2 * ( delta * 5 );


	render();
	for ( var i = 0; i < planets.length; i ++ ) {
		planets[i].orbit( -time.count, orbitTime[i] );
	}

	time.count = time.count + 1 * time.multiplier;
}

function render() {
	

	// find intersections
	var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
	projector.unprojectVector( vector, camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersects = raycaster.intersectObjects( solarSystem.children );

	if ( intersects.length > 0 ) {

		if ( INTERSECTED != intersects[ 0 ].object ) {
			
			INTERSECTED = intersects[ 0 ].object;
			console.log( INTERSECTED );
			$( '#loadtext' ).fadeIn();
			setLoadMessage('You tickled ' + INTERSECTED.name);

		}

	} else {

		INTERSECTED = null;
		$( '#loadtext' ).fadeOut();

	}

	
	renderer.clear();
	// composer.render( 0.01 );
	renderer.render( scene, camera );

}