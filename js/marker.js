var markers = [];

function updateMarkers() {
    for (var i in markers) {
        var marker = markers[i];
        marker.update();
    }
}

function createMarker( text, glObject, size, element ){
  var template = document.getElementById('marker_template');
  var marker = template.cloneNode(true);

  marker.$ = $( marker );
  marker.size = size !== undefined ? size : 1.0;

  marker.nameLayer = marker.children[0];
  marker.nameLayer.innerHTML = text;

  marker.obj = glObject;
  marker.absPosition = marker.obj.position;

  element.appendChild( marker );

  marker.setPosition = function( x, y ){

    var projector = new THREE.Projector(),
        pos = projector.projectVector( this.absPosition.clone().multiplyScalar(1), camera ),
        width = window.innerWidth,
        height = window.innerHeight;

    this.style.left = '' + ( pos.x + x ) + 'px';
    this.style.top = '' + ( pos.y + y ) + 'px';

  };

  marker.attachMarker = function (){

    var transform = CSStransform( 0, 0, marker.obj, size );

    this.style.WebkitTransformOrigin = "0% 0%";
    this.style.WebkitTransform = transform;
    this.style.MozTransformOrigin = "0% 0%";
    this.style.MozTransform = transform;

    this.markerWidth = marker.$.outerWidth();

  };

  marker.update = function () {
    this.attachMarker();
    this.setPosition( 0, 0 );
  };

  markers.push(marker);
}


// function attachMarker( text, glObject, size, element ) {

//   glObject.updateMatrix();

//   var template = document.getElementById('marker_template');
//   var marker = template.cloneNode(true);

//   marker.$ = $(marker);
//   marker.obj = glObject;

//   marker.absPosition = marker.obj.position;
//   marker.size = size !== undefined ? size : 1.0;

//   marker.nameLayer = marker.children[0];
//   marker.nameLayer.innerHTML = text;

//   element.appendChild( marker );

//   var transform = CSStransform( 0, 0, marker.obj, size );

//   marker.style.WebkitTransformOrigin = "0% 0%";
//   marker.style.WebkitTransform = transform;
//   marker.style.MozTransformOrigin = "0% 0%";
//   marker.style.MozTransform = transform;

//   marker.$ = $(marker);
//   marker.markerWidth = marker.$.outerWidth();

//   marker.setPosition = function ( x, y ) {
//     // var matrix = this.obj.matrixWorld;
//     // var vecClone = this.obj.position.clone();

//     // var abspos = vecClone.applyMatrix4( matrix );

//     var projector = new THREE.Projector(),
//         pos = projector.projectVector( this.absPosition.clone().multiplyScalar(1), camera ),
//         width = window.innerWidth,
//         height = window.innerHeight;

//     this.style.left = '' + ( pos.x + x ) + 'px';
//     this.style.top = '' + ( pos.y + y ) + 'px';
//   };

  
//   marker.update = function () {
//     this.setPosition( 0, 0 );
//   };

//   markers.push(marker);
// }

