import THREE from 'three.js';

import _ from 'underscore';
import Utils from '../app/utils';

export default class DistanceCircles {

	constructor (options = {}) {
		this.options = options;
		this.app = this.options.app;

		this.utils = new Utils();

		this.distanceObjects = {
			'au': [],
			'lightyears': []
		};

		this.renderRingGroup(5, 'au');
		this.renderRingGroup(5, 'lightyears');
	}
 
  renderRingGroup (limit, type) {

  	var object = new THREE.Object3D();
	  var distanceType = this.utils.AU;

	  if ( type == 'lightyears' )
	  	distanceType = this.utils.LY;
	  
	  // make the steps every 10^x circles
		for ( var i=0; i<=5; i++ ) {

			if ( i == 5 && type != 'lightyears') 
				break;

			var circleDistance = Math.pow( 10, i ) * (distanceType / this.utils.distancePixelRatio);
			var distanceStep = Math.pow( 10, i );

			var circle = new THREE.Shape();
					circle.moveTo( circleDistance, 0 );
					circle.absarc( 0, 0, circleDistance, 0, Math.PI*2, false );
			
			var points = circle.createPointsGeometry(100);

			var circleLine = new THREE.Line(points, 
			  new THREE.LineBasicMaterial({ 
		      color : 0x00ffff,
		      opacity : 0.5,
		      linewidth: 5,
		      transparent: true,
		      blending: THREE.AdditiveBlending 
			  })
			);
			
			// add one distanceStep as offset to move it to the center		
			//v_circle.position.set(0, -100, 0);		
			circleLine.position.set( 0, 0, 0 );
			circleLine.rotation.set( Math.PI/2, 0, 0 );
			circleLine.visible = false;
			circleLine.properties = {};
			circleLine.properties.distanceScale = distanceStep;

			this.distanceObjects[ type ].push( circleLine );
			object.add( circleLine );	

			// for every distance create a canvas text based on a three texture
	   	var canvas = document.createElement('canvas');
	   			canvas.width = 1024;
	    		canvas.height = 1024;

	    var context = canvas.getContext('2d'),
		      centerX = canvas.width / 2,
		      centerY = canvas.height / 2,
		      angle = (Math.PI * 0.7),
		      radius = -520;

	    //context.clearRect(0, 0, canvas.width, canvas.height);
	    context.font = '32px Helvetica, Arial';
	    context.textAlign = 'center';
	    context.fillStyle = '#00ffff';
	    context.strokeStyle = '#00ffff';
	    context.lineWidth = 1;

	    var canvasText = distanceStep + ' astronomical unit';
	 
		  if ( type == 'lightyears' )
		  	canvasText = distanceStep + ' light year';

		  if ( i > 0 ) 
		  	canvasText += 's';

	    this.utils.textCircle(context, canvasText, centerX, centerY-480, radius, angle, 1);
	    context.stroke();

	    // taken from: http://stemkoski.github.io/Three.js/Texture-From-Canvas.html
			// canvas contents will be used for a texture
			var texture = new THREE.Texture(canvas); 
					texture.needsUpdate = true;
		      
	  	var material = new THREE.MeshBasicMaterial({
	  		map: texture, 
	  		color: 0x00ffff, 
	  		transparent: true,
	  		opacity: 1.25,
	  		side: THREE.DoubleSide,
	  		blending: THREE.AdditiveBlending 
	  	});

	    material.needsUpdate = true;

	    var mesh = new THREE.Mesh(
	    	new THREE.PlaneGeometry(1, 1),
	   		material
	   	);

	    mesh.properties = {};
	    mesh.properties.distanceScale = distanceStep;
	    mesh.visible = true;
			mesh.position.set(0, 0.1, circleDistance);
			mesh.rotation.set(-Math.PI/2, 0, 0);

			mesh.scale.x = 2.0 * ( Math.pow( 10, (i+1) ) );
			mesh.scale.y = 2.0 * ( Math.pow( 10, (i+1) ) );

			if ( type == 'lightyears' ) {
				mesh.scale.x = 2.0 * ( Math.pow( 10, (i+1) ) );
				mesh.scale.y = 2.0 * ( Math.pow( 10, (i+1) ) );
			}

			this.distanceObjects[ type ].push( mesh );
			this.app.scene.add( mesh );
		}

		this.app.scene.add( object );

  }


  update (distanceAU, distanceLY) {

  	_.each( this.distanceObjects, function( objects, type ){

			if (type == 'au') {
				_.each( objects, function( object, idx ){
					if( object.properties.distanceScale <= distanceAU )
						object.visible = true;

					else if( object.properties.distanceScale )
						object.visible = false;	
				});
			}

			if ( type == 'lightyears') {
				_.each( objects, function( object, idx ){
					if( object.properties.distanceScale <= distanceLY )
						object.visible = true;

					else if( object.properties.distanceScale )
						object.visible = false;	
				});
			}

		});

  }


  getObject() {

  	return this.objectPlane;

  }

}