import THREE from 'three.js';

import Log from '../app/log';
import Utils from '../app/utils';


/**
 * Helper class to define custom geometries used for THREE.js rendering
 */
export default class Geometry {


  constructor ( options = {} ) {
    this.options = options;
    this.utils = new Utils();
  }


	renderDashedCircle ( radius, color ) {

		if ( color == undefined )
			color = new THREE.Color('rgba(255, 255, 255, 0.75)');

		var circleGeometry = new THREE.Geometry();
		var verticesArray = circleGeometry.vertices;
		var segments = 128;
		var angle = 2 * Math.PI / segments;

		for( var i = 0; i <= segments; i++ ) {
	    var x = radius * Math.cos(angle * i);
	    var y = radius * Math.sin(angle * i);

	    verticesArray.push( new THREE.Vector3(x, y, 0) );
		}

		// see: http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/
		var circleMaterial = new THREE.LineDashedMaterial({ 
			color: 0x00FF00, 
			transparent: true,
			opacity: 0.1,
			dashSize: this.utils.AU / 1000, 
			gapSize: this.utils.AU / 1000
		});

		circleGeometry.computeLineDistances();

		var circleLine = new THREE.Line(circleGeometry, circleMaterial, THREE.LinePieces);
				circleLine.position.set(0, 0, 0);
				circleLine.rotation.set( -90 * Math.PI / 180, 0, 0 );

		return circleLine;
	}

}

