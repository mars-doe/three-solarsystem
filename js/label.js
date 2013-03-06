var labels = [];

function updateLabels(){
    for (var i in labels) {
        var label = labels[i];
        label.update();
    }
}

function screenXY( vec3 ) {
    var projector = new THREE.Projector();
    var vector = projector.projectVector( vec3.clone(), camera );
    var result = new Object();
    var windowWidth = window.innerWidth;
    var minWidth = 1280;
    if (windowWidth < minWidth) {
        windowWidth = minWidth;
    }

    result.x = Math.round(vector.x * (windowWidth / 2)) + windowWidth / 2;
    result.y = Math.round((0 - vector.y) * (window.innerHeight / 2)) + window.innerHeight / 2;

    // result.x = ( ( vector.x + 1 ) / 2 ) * windowWidth;;
    // result.y = ( ( -vector.y + 1 ) / 2 ) * window.innerHeight;
    return result;
}

function createLabel( text, glObject, size, element ) {
	var template = document.getElementById('label_template');
	var label = template.cloneNode(true);

	label.size = size !== undefined ? size : 1.0;
	label.$ = $( label );

	label.object = glObject;	

	label.name = text;
	label.nameLayer = label.children[0];
	label.nameLayer.innerHTML = text;

	element.appendChild( label );

	label.setPosition = function( x, y ) {

		pos = screenXY( this.object.position );
		this.style.left = '' + ( pos.x + x ) + 'px';
		this.style.top = '' + ( pos.y + y ) + 'px';
	};

	label.update = function () {
		this.setPosition( 0, 30 );
	};

	labels.push(label);
}