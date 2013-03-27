/* JAT: Java Astrodynamics Toolkit
 * 
  Copyright 2012 Tobias Berthold

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

function Matrix(/*int*/ m, /*int*/ n) {
    this.m = m;
    this.n = n;
    this.A = new Array(m);//double[m][n];
	for (var i = 0; i < m; i++) {this.A[i] = new Array(n);}
}



/*public VectorN */Matrix.prototype.times = function(/*VectorN*/ B) {
	this.checkColumnDimension(B.length);
    var /*double[]*/ temp = new Array(this.m);//double[this.m];
    for (var index = 0; index < this.m; index++) {temp[index] = 0;}
    for (var /*int*/ i = 0; i < this.m; i++) {
        for (var /*int*/ j = 0; j < this.n; j++) {
            temp[i] = temp[i] + this.A[i][j]*B.get(j);
        }
    }
    var /*VectorN*/ out = new VectorN({B:temp});
    return out;
};



/*public void */Matrix.prototype.checkColumnDimension = function(/*int*/ column) {
    if (column != this.n) {
        throw new IllegalArgumentException("Matrix Columns dimensions must equals " + column);
    }
};

