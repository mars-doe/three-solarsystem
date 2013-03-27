//package com.mx.applet;
//import jat.core.ephemeris.DE405Plus;
//import jat.core.ephemeris.DE405Body.body;
//import jat.core.util.PathUtil;
//import jat.coreNOSA.algorithm.integrators.Printable;
//import jat.coreNOSA.cm.Constants;
//import jat.coreNOSA.cm.Lambert;
//import jat.coreNOSA.cm.LambertException;
//import jat.coreNOSA.cm.TwoBody;
//import jat.coreNOSA.math.MatrixVector.data.VectorN;
//import jat.coreNOSA.spacetime.Time;
//
//import java.awt.HeadlessException;
//import java.io.IOException;

/**
 * 
 */

/**
 * @author nancy
 *
 */
//public class MarsOdyssey {

	function MarsOdyssey() {
		console.log("MarsOdyssey");
		this.ephemeris = null;
		this.departure_time = null;
		this.arrival_time = null;
		this.r0 = null;
		this.v0 = null;
		this.rf = null;
		this.vf = null;
		this.trajectoryIndex = 0;
		this.trajectory = new Array();
		this.complete = false;
		this.lastTrajectoryPoint;
		this.lastLine;
		this.lastTime;
	}

	MarsOdyssey.prototype.ephemerisCallback = function(result) {
		if (this.r0 == null) {
			this.r0 = result;
			this.r0.print("r0");
	        this.ephemeris.get_planet_vel(DE405Body.EARTH, this.departure_time, this);
		} else if (this.v0 == null) {
			this.v0 = result;
			this.v0.print("v0");
			console.log("orbital velocity of earth " + this.v0.mag());
			this.ephemeris.get_planet_pos(DE405Body.MARS, this.arrival_time, this);
		} else if (this.rf == null) {
			this.rf = result;
			this.rf.print("rf");
			this.ephemeris.get_planet_vel(DE405Body.MARS, this.arrival_time, this);
		} else {
			this.vf = result;
			this.vf.print("vf");
			console.log("orbital velocity of Mars " + this.vf.mag());

			var initpos = new TwoBody({r:this.r0, v:this.v0});
			var finalpos = new TwoBody({r:this.rf, v:this.vf});

//			var /*Printable*/ x = new Callback();
			// propagate the orbits for plotting
			initpos.propagate(0., initpos.period(), this, true);
//			x.plotnum++;
			finalpos.propagate(0., finalpos.period(), this, false);
//			x.plotnum++;
	        var tof = 200. * 86400.0;
			var /*double*/ muforthisproblem = Constants$GM_Sun / 1.e9;
			var /*Lambert*/ lambert = new Lambert(muforthisproblem);
			var /*double*/ totaldv;
//			try {
				totaldv = lambert.compute(this.r0, this.v0, this.rf, this.vf, tof);
//			} catch (/*LambertException*/ e) {
//				totaldv = -1;
//				//e.printStackTrace();
//				console.log("MarsOdyssey.init LambertException " + e);
//			}
			// apply the first delta-v
			var /*VectorN*/ dv0 = lambert.deltav0;
			this.v0 = this.v0.plus(dv0);
			console.log("tof = " + lambert.tof);
			var /*TwoBody*/ chaser = new TwoBody({mu:muforthisproblem, r:this.r0, v:this.v0});
			chaser.print("chaser orbit");
			chaser.propagate(0.0, tof, this, true);
//			// Plotting
//			x.traj_plot.plot.setMarksStyle("dots", 3);
//			x.traj_plot.plot.addPoint(3, initpos.getR().x[0], initpos.getR().x[1], false);
//			x.traj_plot.plot.addPoint(3, finalpos.getR().x[0], finalpos.getR().x[1], false);
//			x.traj_plot.plot.addLegend(0, "Earth orbit");
//			x.traj_plot.plot.addLegend(1, "Mars orbit");
//			x.traj_plot.plot.addLegend(2, "Spacecraft");
//			// make the plot visible and square
//			x.traj_plot.setVisible(true);
//			int size = 300000000;
//			x.traj_plot.plot.setXRange(-size, size);
//			x.traj_plot.plot.setYRange(-size, size);
			console.log("Total delta-v = " + totaldv + " km/s");
			this.complete = true;
		}
	};

	MarsOdyssey.prototype.toString = function() {
		return "MarsOdyssey";
	};

	MarsOdyssey.prototype.init = function() {
		console.log("MarsOdyssey.init");

        var pathUtil = new PathUtil();
        this.ephemeris = new DE405Plus(pathUtil);
		// Mars Odyssey Mission

        this.departure_time = new Time({Yr:2001, Mon:4, D:7, Hr:1, Mn:1, S:1});
        this.arrival_time = new Time({Yr:2001, Mon:10, D:24, Hr:1, Mn:1, S:1});
        console.log("departure_time = " + this.departure_time.jd_tt() + ", arrival_time = " + this.arrival_time.jd_tt());
        console.log("departure_time = " + this.departure_time.jd_tt().Julian2Date().toString() + ", arrival_time = " + this.arrival_time.jd_tt().Julian2Date().toString());

		// create a TwoBody orbit using orbit elements
        this.ephemeris.get_planet_pos(DE405Body.EARTH, this.departure_time, this);
	};

//	public static void main(String[] args) {
//		MarsOdyssey marsOdyssey = new MarsOdyssey();
//		marsOdyssey.init();
//	}

//}

//class Callback implements Printable {
//	function Callback() {;}
//	@Override
	/*public void */MarsOdyssey.prototype.print = function(/*double*/ time, /*double[]*/ data) {
//        win.call("onAddPoint", new String[] {Double.toString(time), Double.toString(data[0]), Double.toString(data[1]), Double.toString(data[2])});
		var julianTime = this.departure_time.plus(time);
//		var date = julianTime.jd_tt().Julian2Date();
//		console.log("time = " + julianTime.jd_tt() + "(" + date.toString() + "): x = " + data[0] + ", y = " + data[1] + ", z = " + data[2]);
		if (time == 0) {
			console.log("time = " + julianTime.jd_tt() + ": x = " + data[0] + ", y = " + data[1] + ", z = " + data[2]);
		}
		this.onAddPoint(julianTime.jd_tt(), + data[0], + data[1], + data[2]);
	};
//}

	MarsOdyssey.prototype.onAddPoint = function(time, x, y, z) {
		this.trajectory[this.trajectoryIndex++] = {time:time, point:new THREE.Vector3(x, y, z)};
	};

	MarsOdyssey.prototype.drawTrajectory = function(time) {
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
		if (!this.complete) {
			return;
		}

		var point = null;
		for (var index = 0; index < this.trajectory.length - 1; index++) {
			if ((time >= this.trajectory[index].time) && (time <= this.trajectory[index + 1].time)) {
				point = this.trajectory[index].point;
				break;
			}
		}

		if (point == null) {
			return;
		}
		var x = point.x / 1000000;
		var y = point.y / 1000000;
		var z = point.z / 1000000;

		if (this.lastTrajectoryPoint == null ) {
			this.lastTrajectoryPoint = new THREE.Vector3(x, y, z);
			return;
		}

		end = new THREE.Vector3(x, y, z);
		this.lastTrajectoryPoint = end;

		splineMat = new THREE.LineBasicMaterial( { color: 0x2BBFBD, opacity: 0.25, linewidth: 1 } );
		line = new THREE.Line( new THREE.Geometry(), splineMat );

		if ( this.prevLine != null ){
			line.geometry.vertices = this.prevLine.geometry.vertices;
			scene.remove( this.prevLine );
			this.prevLine.geometry.dispose();
		}

		line.geometry.vertices.push( end );

		// var particleMat = new THREE.ParticleBasicMaterial({
		// 	size: .5,
		// 	color: 0xFFFFFF,
		// 	transparent: true
		// });

		// var particle = new THREE.ParticleSystem( line.geometry, particleMat );
		// scene.add( particle );

		scene.add( line );
		this.prevLine = line;
	}

	Number.prototype.Julian2Date = function() {
		 
	    var X = parseFloat(this)+0.5;
	    var Z = Math.floor(X); //Get day without time
	    var F = X - Z; //Get time
	    var Y = Math.floor((Z-1867216.25)/36524.25);
	    var A = Z+1+Y-Math.floor(Y/4);
	    var B = A+1524;
	    var C = Math.floor((B-122.1)/365.25);
	    var D = Math.floor(365.25*C);
	    var G = Math.floor((B-D)/30.6001);
	    //must get number less than or equal to 12)
	    var month = (G<13.5) ? (G-1) : (G-13);
	    //if Month is January or February, or the rest of year
	    var year = (month<2.5) ? (C-4715) : (C-4716);
	    month -= 1; //Handle JavaScript month format
	    var UT = B-D-Math.floor(30.6001*G)+F;
	    var day = Math.floor(UT);
	    //Determine time
	    UT -= Math.floor(UT);
	    UT *= 24;
	    var hour = Math.floor(UT);
	    UT -= Math.floor(UT);
	    UT *= 60;
	    var minute = Math.floor(UT);
	    UT -= Math.floor(UT);
	    UT *= 60;
	    var second = Math.round(UT);

	    return new Date(Date.UTC(year, month, day, hour, minute, second));
	};

//$(document).ready( function() {
//	var marsOdyssey = new MarsOdyssey();
//	marsOdyssey.init();
//} );
