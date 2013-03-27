/* JAT: Java Astrodynamics Toolkit
 *
 * Copyright (c) 2003 National Aeronautics and Space Administration. All rights reserved.
 *
 * This file is part of JAT. JAT is free software; you can
 * redistribute it and/or modify it under the terms of the
 * NASA Open Source Agreement
 * 
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * NASA Open Source Agreement for more details.
 *
 * You should have received a copy of the NASA Open Source Agreement
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *
 */

	/** Construct a zero finding problem.
	 * @param f ScalarFunction to be solved.
	 * @param max Maximum number of iterations.
	 * @param acc How close does f(x) have to be to zero?
	 * @param dxm How close to the zero does x have to be?
	 */
	function ZeroFinder(/*Lambert*/ f, /*int*/ max, /*double*/ acc, /*double*/ dxm) {
		this.setMaxIterations(max);
		this.setAccuracy(acc);
		this.set_dxmin(dxm);
		this.func = f;
	}

	/** Set the maximum number of iterations
	 * @param max Maximum number of iterations.
	 */
	/*public void */ZeroFinder.prototype.setMaxIterations = function(/*int*/ max) {
		this.maxit = max;
	};

	/** How close does f(x) have to be to zero?
	 * @param acc How close does f(x) have to be to zero?
	 */
	/*public void */ZeroFinder.prototype.setAccuracy = function(/*double*/ acc) {
		this.accuracy = acc;
	};

	/** How close to the zero does x have to be?
	 * @param x How close to the zero does x have to be?
	 */
	/*public void */ZeroFinder.prototype.set_dxmin = function(/*double*/ x) {
		this.dxmin = x;
	};
	

	/*public double */ZeroFinder.prototype.regulaFalsi = function(/*double*/ x1, /*double*/ x2) {
		var /*double*/ xlow;
		var /*double*/ xhigh;
		var /*double*/ del;
		var /*double*/ out = 0.0;
		var /*double*/ f;

		var /*double*/ fl = this.func.evaluate(x1);
		var /*double*/ fh = this.func.evaluate(x2);

		var /*double*/ test = fl * fh;

		if (test > 0.0) {
			if (fl == 0.0) return x1;
			if (fh == 0.0) return x2;
			err++;
			console.log("Root must be bracketed in ZeroFinder "+err);
		}

		if (fl < 0.0) {
			xlow = x1;
			xhigh = x2;
		} else {
			xlow = x2;
			xhigh = x1;
			var /*double*/ temp = fl;
			fl = fh;
			fh = temp;
		}

		var /*double*/ dx = xhigh - xlow;

		for (var /*int*/ i = 1; i < this.maxit; i++) {
			out = xlow + dx * fl / (fl - fh);
			f = this.func.evaluate(out);

			if (f < 0.0) {
				del = xlow - out;
				xlow = out;
				fl = f;
			} else {
				del = xhigh - out;
				xhigh = out;
				fh = f;
			}

			dx = xhigh - xlow;

			if ((Math.abs(del) < this.dxmin)
				|| (Math.abs(f) < this.accuracy)) {
				return out;
			}
		}

		console.log(
			" Regula Falsi exceeded " + this.maxit + " iterations ");
		return out;
	};
