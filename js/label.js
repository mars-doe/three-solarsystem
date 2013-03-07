var labels = [];

function updateLabels(){
    for (var i in labels) {
        var label = labels[i];
        label.update();
    }
} 

function showLables( hide ){
	for (var i in labels) {
        var label = labels[i];
		if( hide ) label.hide();
		else label.show();
	}
}


function screenXY( vec3 ) {
    var projector = new THREE.Projector();
    var vector = projector.projectVector( vec3.clone(), camera );
    var result = new Object();

    result.x = Math.round(vector.x * (window.innerWidth / 2)) + window.innerWidth / 2;
    result.y = Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2;
    return result;
}

function createLabel( text, glObject, size, element ) {
	var template = document.getElementById('label_template');
	var label = template.cloneNode(true);

	label.size = size !== undefined ? size : 1.0;
	label.$ = $( label );

	label.object = glObject;

	// label.gyro = new THREE.Gyroscope();
	// var plane = new THREE.PlaneGeometry( 2, 2 );
	// label.gyroGeo = new THREE.Mesh( plane, new THREE.MeshLambertMaterial( { color: 0xCC0000, opacity: 1 } ) );
	// label.gyro.add( label.gyroGeo );
	// label.object.add( label.gyro );

	label.name = text;
	label.nameLayer = label.children[0];
	label.nameLayer.innerHTML = text;

	label.labelWidth = label.$.outerWidth();

    label.visMin = 0;
    label.visMax = 5000;
    label.visible = false;

	element.appendChild( label );

	label.setPosition = function( x, y ) {
		x -= this.labelWidth * 0.5;
        this.style.left = x + 'px';
        this.style.top = y + 'px';
	};

	label.hide = function(){
		label.visible = false;
	}

	label.show = function(){
		label.visible = true;
	}

	label.update = function () {

		var screenPos = screenXY( this.object.position );
		var frustum = new THREE.Frustum();
		frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse ) );
		var inFrustum = frustum.containsPoint( this.object.position );

        var isParentVisible = this.object.visible;

        if ( label.visible && isParentVisible && inFrustum) this.setPosition( screenPos.x, screenPos.y );
        if ( label.visible && inFrustum && isParentVisible ) this.style.display = 'inline-block';
        else this.style.display = 'none';
	};

	labels.push(label);
}