var Planet = function( material ){

	var LOD,
		LODLevel = 3,
		LODDistance = 3000,
		eph;

	sphereGeo = new THREE.SphereGeometry( 1, 15, 15 );
	LOD = new THREE.Mesh ( sphereGeo, material );
	LOD.startTime = 0;

	// LOD.setOrbit = function( e ){
	// 	eph = e;
	// 	this.startTime = Math.random() * eph.A;
	// 	this.orbiting( this.startTime, eph.period, .00001 );
	// };

	LOD.orbiting = function( eph, JD, scale ){

		// time += this.startTime;

		// var orbitSpeed = time / eph.period;
		// this.rotation.y = time * eph.period / 1000; 
		// this.position.x = scale * ( eph.A * Math.cos( Math.PI * 2 - orbitSpeed ) + ( eph.aphelion - eph.A ) );
		// this.position.z = scale * ( eph.semiMinor * Math.sin(  Math.PI * 2 - orbitSpeed ) );

		
		// var eph = meanElements( e, JD );
		// var eDeg = eph.e * 180 / Math.PI;

		// var w = eph.wBar - eph.om; //Argument of Perihelion
		// var M = eph.L - eph.wBar; //Mean Anomaly
		// var E =  M + eDeg * Math.sin( M ); //Eccentric Anomaly

		// var deltaM = M - ( E - ( eDeg * Math.cos( M ) ) );
		// var deltaE = deltaM / ( 1 - eph.e * Math.cos( E ) );
		// var E2 = E + deltaE;

		// var x1 = eph.a * ( Math.cos( E2 ) - eph.e );
		// var y1 = eph.a * Math.sqrt( 1 - eph.e * eph.e ) * Math.sin( E2 );
		// var z = 0;

		// var scale = 1000;
		// this.position.x = scale * ( ( Math.cos( w ) * Math.cos( eph.om ) 
		// 	- Math.sin( w ) * Math.sin( eph.om ) * Math.cos( eph.I ) )
		// 	* x1 + ( - Math.sin ( w ) * Math.cos( eph.om ) 
		// 	- Math.cos( w ) * Math.sin( eph.om ) * Math.cos( eph.I ) ) * y1 );

		// this.position.z = scale * ( ( Math.cos( w ) * Math.sin( eph.om ) 
		// 	+ Math.sin( eph.om ) * Math.cos( w ) * Math.cos( eph.I ) )
		// 	* x1 + ( - Math.sin ( w ) * Math.sin( eph.om )
		// 	+ Math.cos( w ) * Math.cos( eph.om ) * Math.cos( eph.I ) ) * y1 );

		// this.position.y = scale * ( Math.sin( w ) * Math.sin( eph.I ) * x1 * Math.cos( w ) * Math.sin( eph.I ) * y1 );

		var DEGS = 180/Math.PI;      // convert radians to degrees
		var RADS = Math.PI/180;      // convert degrees to radians
		var EPS  = 1.0e-12;          // machine error constant
		var cy = JD / 36525;         // centuries since J2000
		
		// // e is eccentricity
		// // a is semi-major
		// // I is inclination
		// // L is mean longitude
		// // wBar is longitude of the perihelion
		// // om is longitude of the ascending node

		var a = eph.a[0] + eph.a[1] * cy;
		var e = eph.e[0] + eph.e[1] * cy;
		var I = ( eph.I[0] + ( eph.I[1] * cy / 3600 ) ) * RADS;		
		var L =  mod2pi( ( eph.L[0] + ( eph.L[1] * cy / 3600 ) ) * RADS );
		var wBar = ( eph.wBar[0] + ( eph.wBar[1] * cy / 3600 ) ) * RADS;
		var om = ( eph.om[0] + ( eph.om[1] * cy / 3600 ) ) * RADS;
		

		// position of planet in its orbit

		// var w = eph.wBar - eph.om; //Argument of Perihelion
		// var M = eph.L - eph.wBar; //Mean Anomaly
		// var M = Celestial.mod2pi( L - wBar ); // modulus the mean anomaly 


		// var vp = Celestial.true_anomaly( M, e );  //TODO: if ep >1, then error
		
		// var E = M + e * Math.sin( M ) * (1.0 + e * Math.cos( M ) );

		var mp = mod2pi( L - wBar );
		var vp = true_anomaly( mp, e );  //TODO: if ep >1, then error
		var r = a * ( 1 - e * e ) / ( 1 + e * Math.cos( vp ) );
		console.log( a, e, I, L, wBar, om, mp, vp, r );

		// heliocentric rectangular coordinates of planet
		var x = 10000 * r * ( Math.cos( om ) * Math.cos( vp + wBar - om ) - Math.sin( om ) * Math.sin( vp + wBar - om ) * Math.cos( I ) );
		var z = 10000 * r * ( Math.sin( om ) * Math.cos( vp + wBar - om ) + Math.cos( om ) * Math.sin( vp + wBar - om ) * Math.cos( I ) );
		var y = 10000 * r * ( Math.sin( vp + wBar - om ) * Math.sin( I ) );

		this.position.x = x;
		this.position.y = y;
		this.position.z = z;

		// console.log( x, y, z );
		// var distscaler = (scale_up == 1) ? Celestial.systemScaler() : {xz: 1, y:1};  //Scale the distances if asked to
		// pos = {x: distscaler.xz*dx, y: distscaler.y*dy, z: distscaler.xz*dz};
		// if (loginfo>0)	console.log("Planet:" + planetid + " x:"+pos.x+" z:"+pos.z + " SQ:"+(Math.sqrt(pos.x * pos.x)+Math.sqrt(pos.y * pos.y)));

		// Find the remainder when the current epoch time is modded by the rotational period of the planetid
		// var daylength_in_centuries = 0.0000273785 * P.rotation_sidereal_in_days;
		// var dayrem = Celestial.fmod(time, daylength_in_centuries);
		// var daypercent = dayrem / daylength_in_centuries;
	
		//echo("Day is" SPC %daypercent SPC "% of" SPC %daylength_in_centuries SPC "lengthed days");
		// var xr = P.obliquity;
		// var zr = 0;
		// var yr = daypercent * 360;

		//Rotate the planetid on the correct planetary axis
		//rot = RotateVectorOnZX(%zr, %xr);
		// rot = {x:0, y:P.rotation.y += .004 || 0.004, z:0};

	};

	return LOD;

};

function meanElements( e, JD ){
	var t = JD / 36525;
	var eph = new Object();
	eph.e = e.e[0] + e.e[1] * t;
	eph.a = ( e.a[0] + e.a[1] * t );
	eph.I = e.I[0] + e.I[1] * t;
	eph.L = e.L[0] + e.L[1] * t;
	eph.wBar = e.wBar[0] + e.wBar[1] * t;
	eph.om = e.om[0] + e.om[1] * t;

	return eph;
}

function mod2pi( x ) {
	// return an angle in the range 0 to 2pi or 360
	b = x / ( 2 * Math.PI );
	a = ( 2 * Math.PI ) * ( b - abs_floor( b ) );
	if ( a < 0 ) a = ( 2 * Math.PI ) + a;
	return a; 
}

function abs_floor(x) {
	// return the integer part of a number
	return (x >= 0) ? Math.floor(x) : Math.ceil(x);
}

function true_anomaly( mp, ep) {

	// initial approximation of eccentric anomaly
	var E = mp + ep * Math.sin( mp ) * (1.0 + ep * Math.cos( mp ) );

	// iterate to improve accuracy
	var loop = 0;
	while ( loop < 20 ) { //TODO: Check how many times to loop
		var eone = E;
		E = eone - (eone - ep*Math.sin(eone) - mp) / ( 1 - ep * Math.cos( eone ) );

		if (Math.abs( E - eone) < 0.0000007) break;
		loop++;
	}
	
	// convert eccentric anomaly to true anomaly
	var V = 2 * Math.atan2( Math.sqrt( ( 1 + ep ) / ( 1 - ep ) ) * Math.tan( 0.5 * E ), 1 );

	// modulo 2pi
	if ( V < 0 ) V = V + ( 2 * Math.PI ); 

	return V;
}
