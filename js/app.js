import Log from './app/log';
import ThreeScene from './components/threescene.js';


export default class App {
  
  constructor () {

    this.THREESCENE = new ThreeScene();
    this.setDevelopmentMode();

  }


  setDevelopmentMode () {

    window.isDevelopmentMode = true;

  }

};

new App();
export var __useDefault = true;

export default class Log {

  init () {}

  info (message) {
  	this.print(message, 'info');
  }

  error (message) {
		this.print(message, 'error');
  }

  print (message, type = 'info') {
  	if (typeof(console) === 'object' && window.console.log) {
  		console.log(message);
  	}
  }
}
import THREE from 'three.js';

export var __useDefault = true;


/**
 * Utility class to be used for global functions
 */

export default class Utils {

	constructor() {

		// the distance of one astronomical unit in kilometers
		this.AU = 149597870.700;

		// the distance for one light year in km
		this.LY = 10;

		// the distance of one parsec in light years
		this.PC = 3.26156;

		// define how large 1px is in comparison to the the real world size
		// every distance will be divided by this value

		// 10 px = 100000 ly
		this.distancePixelRatio = Math.round(this.LY / 10);


		// set the default rotation time in days for stars
		this.defaultStarRotationPeriod = 25.00;

		this.radiusSun = 696342; // km


		this.radiusEarth = 6371;

		// For stars
		this.radiusStarPixelRatio = 100000000;

		// For planets, moons, etc
		this.radiusPixelRatio = 50000;


		this.planetDefaultColor = [0, 0, 200];


		this.orbitTransparency = 0.5;

		this.orbitColors = [
			0xD59C6F,
			0x88bf8b,
			0x4682b4,
			0xd2691e,
			0xf0e68c,
			0xffa500,
			0xE89296,
			0x92DEE8,
			0x55732D,
			0x0FF7E8,

			0xE3B1E0,
			0xCA8E40,
			0x983315,
			0xA06E00,
			0xFFB100,
			0xFF6202,
			0x00579E,
			0x9E600A,
			0xFFA301,
			0x913E20
		];



		this.spectralColors = {
			'o': 0x9BB0FF, // blue
			'b': 0xBBCCFF, // blue white
			'a': 0xFBF8FF, // white
			'f': 0xFFFFF0, // yellow white
			'g': 0xFFFF00, // yellow
			'k': 0xFF9833, // orange
			'm': 0xBB2020, // red
			'l': 0xA52A2A, // red brown
			't': 0x964B00, // brown
			'y': 0x663300  // dark brown
		};


	}

	getDistance( distance, distanceType = 'ly' ) {

		if (distanceType.toLowerCase() == 'ly') {
			return (distance * this.LY / this.distancePixelRatio);
		}	

		if (distanceType.toLowerCase() == 'au') {
			return (distance * this.AU / this.distancePixelRatio);
		}

	}

	PCToLY (d) {

		return (d * this.PC / this.distancePixelRatio);

	}


	/**
	 * project from 3d to 2d space
	 */ 
	toScreenPosition(obj, camera) {

    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * window.innerWidth;
    var heightHalf = 0.5 * window.innerHeight;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = ( vector.x * widthHalf ) + widthHalf;
    vector.y = - ( vector.y * heightHalf ) + heightHalf;

    return { 
      x: vector.x,
      y: vector.y
    };

	}


	project2D (mesh, app) {

		app.scene.updateMatrixWorld(true);

		var position = new THREE.Vector3();
		var pos = position.setFromMatrixPosition( mesh.matrixWorld );
		
		app.camera.updateMatrixWorld(true);

		// var vector = app.projector.projectVector(pos.clone(), app.camera);
		var vector = pos.unproject(app.camera);

		var pLocal = new THREE.Vector3(0, 0, -1);
		var pWorld = pLocal.applyMatrix4( app.camera.matrixWorld );
		var dir = pWorld.sub( app.camera.position ).normalize();

		var scalar = (pos.x - app.camera.position.x) / dir.x;
		// window.utils.debug( scalar );
		if (mesh.name == 'Earth') {
  		// window.utils.debug('Earth pos', scalar);
  	}

	  if (scalar < 0) {
	  	console.log(mesh.name);
	  	// window.utils.debug('object behind camera');
	  	// return false; // this means the point was behind the camera, so discard
	  }

		vector.x = (vector.x + 1)/2 * window.innerWidth;
		vector.y = -(vector.y - 1)/2 * window.innerHeight;

		return vector;
	}



	// taken from: http://zachberry.com/blog/tracking-3d-objects-in-2d-with-three-js/
	getPosition2D ( object, app ) {

		app.scene.updateMatrixWorld(true);

		var p, v, percX, percY, left, top;

		// this will give us position relative to the world
		p = object.position.clone();

		app.camera.updateMatrixWorld(true);

		// unproject will translate position to 2d
		v = p.unproject(app.camera);

		// Pick a point in front of the camera in camera space:
		var pLocal = new THREE.Vector3(0, 0, -1);

		// Now transform that point into world space:
		var pWorld = pLocal.applyMatrix4( app.camera.matrixWorld );
		
		// You can now construct the desired direction vector:
		var dir = pWorld.sub( app.camera.position ).normalize();

		var scalar = (p.x - app.camera.position.x) / dir.x;
		//window.utils.debug( scalar );

	  if (scalar < 0) {
	  	// window.utils.debug('object behind camera');
	  	// return false; //this means the point was behind the camera, so discard
	  }
		//window.utils.debug( v );

		// translate our vector so that percX=0 represents
		// the left edge, percX=1 is the right edge,
		// percY=0 is the top edge, and percY=1 is the bottom edge.
		v.x = (v.x + 1)/2 * window.innerWidth;
		v.y = -(v.y - 1)/2 * window.innerHeight;

		return v;

	}


	toRad() {

		return Math.PI / 180;

	}


	// derived from: https://github.com/mrdoob/three.js/blob/master/examples/js/Detector.js
  isWebGLSupported() {

    try {
      
      let canvas = document.createElement("canvas");
      return !! window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));

    } catch(e) { return false; } 

  }

  // taken from: http://stackoverflow.com/questions/3177855/how-to-format-numbers-similar-to-stack-overflow-reputation-format
	numberFormat(number) {
		var repString = number.toString();

	  if ( number < 1000 ) {
			repString = number;
	  } else if ( number < 1000000 ) {
			repString = (Math.round((number / 1000) * 10) / 10) + ' K'
	  } else if ( number < 1000000000 ) {
			repString = (Math.round((number / 1000000) * 10) / 10) + ' Mio'
	  } else if ( number < 1000000000000000000 ) {
			repString = (Math.round((number / 1000000000) * 10) / 10) + ' Bio'
	  }

	  return repString;
	}



	getDimensionToTen( min, max ) {

		var size = Math.ceil( max * 100000 ) / 100000;

		if( max < 0.001 )
			size = Math.ceil( max * 10000 ) / 10000;
		else if( max < 0.01 )
			size = Math.ceil( max * 1000 ) / 1000;
		else if( max < 0.1 )
			size = Math.ceil( max * 100 ) / 100;
		else if( max < 1 )
			size = Math.ceil( max * 10 ) / 10;

		else {
			size = Math.ceil( max );
		}

		return {
			size: size,
			max: max,
			min: min,
			minPercent: Math.round(min * 100 / size) / 100,
			maxPercent: Math.round(max * 100 / size) / 100
		}

	}


	redshiftToParsec (z) {

		// light speed in km/s
		const vLight = 299792.458;

		// hubble constant
		const h0 = 74.20;


		let parsec = (((((z+1)*(z+1)-1)/((z+1)*(z+1)+1)) * vLight) / h0) * 1000000;

		return parsec;

	}



	inFrustum (app, position) {

		app.camera.updateMatrix(); 
		app.camera.updateMatrixWorld(); 

		app.frustum = new THREE.Frustum();
		var projScreenMatrix = new THREE.Matrix4();

		projScreenMatrix.multiplyMatrices( app.camera.projectionMatrix, app.camera.matrixWorldInverse );

		// app.frustum.setFromMatrix( app.camera.projectionMatrix );
		app.frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( app.camera.projectionMatrix, app.camera.matrixWorldInverse ) );


		if (app.frustum.containsPoint( position )){
		  return true;
		}

		return false;

	}



  debug(txt) {

  	if (window.isDevelopmentMode)
  		console.log(txt);

  }


  // taken from: http://jsfiddle.net/Brfp3/3/
	textCircle (ctx, text, x, y, radius, space, top){
	   space = space || 0;
	   var numRadsPerLetter = (Math.PI - space * 2) / text.length;
	   ctx.save();
	   ctx.translate(x,y);
	   var k = (top) ? 1 : -1; 
	   ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));
	   for(var i=0;i<text.length;i++){
	      ctx.save();
	      ctx.rotate(k*i*(numRadsPerLetter));
	      ctx.textAlign = "center";
	     	ctx.textBaseline = (!top) ? "top" : "bottom";
	     	ctx.fillText(text[i],0,-k*(radius));
	      ctx.restore();
	   }
	   ctx.restore();
	}


}
export var __useDefault = true;

import $ from 'jquery';

import Utils from './utils';
import Template from '../views/template';


/**
 * View base class
 * Used for all DOM - related objects
 * 
 */

export default class View {

	constructor ( options = {} ) {

		this.options = options;
		this.app = options.app;

		this.utils = new Utils();
		
		this.name = '';
		this.$view = ``;

	}

	setData() {

	}

	render() {

		this.$el = this.$view;
		return this.$el;

	}

	getHtml() {

		return this.$el.html();

	}

	appendTo( $element ) {



	}


	loadAsynch(url, data, method = 'post', callback = {}, scope = this) {

		console.log('calling', url);

    if (!data) { data = {}; }

    if (!method) { method = 'GET'; }

    $.ajax({
      url: url,
      data: data,
      dataType: 'json',
      type: method,
      success: (response) => {

        if (response && typeof(callback) == 'function') {

           callback.call(scope, response);

        }

      }
    });

  }

}

//var TooltipView = require('../../views/tooltip_view');
//var InfoboxView = require('../../views/infobox_view');

import $ from 'jquery';
import THREE from 'three.js';

import Tooltip from '../views/tooltip';

export default class CanvasElement {

  constructor ( options ) {

  	this.app = options.app;
    this.model = options.object;
    this.pos = options.pos;
    this.type = options.type;

    this.clicked = false;

    this.viewHelperGroup = new THREE.Object3D();

    this.tooltip = new Tooltip();
    this.tooltip.hide();

    this.render();

  }

  render() {

  	// render a canvas circle at the screen position
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 24;
    this.canvas.height = 24;

    var context = this.canvas.getContext('2d');
        context.beginPath();
        context.arc(12, 12, 11, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        context.strokeStyle = '#99FF66';
        context.stroke();


    // add click event (dirty)
    $(document).on('click', '#canvas', (e) => {

      // dirty: prevent multiple click events
      if (!this.clicked) {
        this.clicked = true;
        e.preventDefault();
        e.stopPropagation();

        /*
        self.infobox = new InfoboxView({
          app: self.app,
          object: self.model,
          data: self.model.properties,
          template: 'star-info'
        });

        */
      }

      this.clicked = false;

    });

  }


  registerObject (object) {

    this.object = object;

  }


  show () {

    $('#canvas').css({'opacity': 1.0});

  }

  hide () {

    $('#canvas').css({'opacity': 0.0});

  }


  showTooltip() {

    this.tooltip.updatePosition(this.pos);
    this.tooltip.setData(this.object);
    this.tooltip.show();

  }

  hideTooltip () {
    this.tooltip.hide();
  }


  updatePosition (pos) {

    this.pos = pos;

    $('#canvas').css({
      'left': pos.x - 12 + 'px',
      'top': pos.y - 12 + 'px',
      'opacity': 1.0
    });

  }


  updateObjectInfo (objectInfo) {

    this.model = objectInfo;

  }


  showViewHelper() {

    this.hideViewHelper();
    this.viewHelperGroup = new THREE.Object3D();

    if (this.app.currentDistanceLY >= 1) {

      console.log('showing helper lines');

      var pos = this.model.properties.position;

      // show two lines
      var material = new THREE.LineBasicMaterial({
        color: 0x0090ff,
        linewidth: 1
      });

      // define the geometry shape
      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
          geometry.vertices.push( new THREE.Vector3(pos.x, 0, pos.z) );

      var line1 = new THREE.Line(geometry, material);

      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(pos.x, 0, pos.z) );
          geometry.vertices.push( new THREE.Vector3(pos.x, pos.y, pos.z) );

      var line2 = new THREE.Line(geometry, material);

      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
          geometry.vertices.push( new THREE.Vector3(pos.x, pos.y, pos.z) );

      var line3 = new THREE.Line(geometry, material);

      this.viewHelperGroup.add(line1);
      this.viewHelperGroup.add(line2);
      this.viewHelperGroup.add(line3);

      this.app.scene.add(this.viewHelperGroup);

    }
  }


  hideViewHelper() {

    this.app.scene.remove(this.viewHelperGroup);

  }

}

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
import THREE from 'three.js';

import Utils from '../app/utils';
import Textures from '../helpers/textures';
import Particle from '../helpers/particle';

import Shader from './shader';

export default class ParticleStars {

	constructor ( options = {} ) {

		this.options = options;
		this.app = options.app;
  	this.stars = options.stars;

  	this.utils = new Utils();
  	this.textures = new Textures();


  	this.spectralStars = {
      'o': [],
      'b': [],
      'a': [],
      'f': [],
      'g': [],
      'k': [],
      'm': [],
      'l': [],
      't': [],
      'y': []
    };

    this.particleArray = [];
    this.particleCount = this.stars.length;

    this.habitableStars = [];

    this.sizeFlag = '';

    this.attributes = {
      sizes: [],
      colors: [],
      alpha: []
    };

    this.uniforms = {
      amplitude: { type: 'f', value: 1.0 },
      texture: { type: 't', value: this.textures.getStarMaterial() }
    };

    // every spectral class needs its own particle system that are saved 
    // to a group
    // multiple textures / colors in one particlesystem is not yet possible with three.js
    this.particleSystems = new THREE.Object3D();

    this.geometry = new THREE.BufferGeometry();

    this.setAttributes();
    this.render();

	}


	setAttributes () {

    let starLength = this.stars.length;

    let sizes = this.attributes.sizes;
    let colors = this.attributes.colors;
    let alpha = this.attributes.alpha;

    for ( var i = 0; i < this.stars.length; i++ ) {

      let spectralType = this.getSpectralType(this.stars[i]);

      if (this.spectralStars[spectralType])
        this.spectralStars[spectralType].push( this.stars[i] );

      this.stars[i].spectralType = spectralType;

      sizes[i] = this.utils.LY * 100 / this.utils.distancePixelRatio;

      //if (this.utils.spectralColors[ spectralType ] != undefined) {

        //colors[i] = new THREE.Color( this.utils.spectralColors[ spectralType ] );

      //} else {

        //colors[i] = new THREE.Color( 0xffffff );

      //}

      alpha[ i ] = 1.0;

    }



    this.stars.forEach(( star, idx ) => {

      var $span = $('<span>' + star.pl_hostname + '</span>');
          $span.addClass('star-label');
          $span.addClass('star-label-' + idx);

      /*
      $this.material = new THREE.ParticleBasicMaterial({
        map: _Textures.getStarMaterial(),
        color: window.settingsspectralColors[ star.type.substr(0, 1).toLowerCase() ],
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        size: window.settings.stars.size
      });
      */

      // if distance is unknown we assume a distance of 500 parsec
      if ( !star.dist || star.dist == 0 )
        star.dist = 500;

      if (star.pl_hostname == 'Sun')
        star.dist = 0;

      // change distance to light years
      var distance = star.dist * this.utils.PC * this.utils.LY / this.utils.distancePixelRatio;
      var distanceLY = star.dist * this.utils.PC;

      // make every star the same distance from the center to make them visible
      var normalizedDistance = this.utils.AU / this.utils.distancePixelRatio;

      // for each particle set the space position depending on its distance, right acsession and declination
      // taken from http://www.stjarnhimlen.se/comp/tutorial.html
      // var x = normalizedDistance * Math.cos( star.ra ) * Math.cos( star.dec );
      // var y = normalizedDistance * Math.sin( star.ra ) * Math.cos( star.dec );
      // var z = normalizedDistance * Math.sin( star.dec );

      star.ra = star.ra * Math.PI / 180.0;
      star.dec = star.dec * Math.PI / 180.0;

      // star distance in parsec 
      // right acsession in h 
      // declination in h 
      var x = Math.round( distance * Math.cos( (star.ra*15) ) * Math.cos( star.dec ) );
      var y = Math.round( distance * Math.sin( (star.ra*15) ) * Math.cos( star.dec ) );
      var z = Math.round( distance * Math.sin( star.dec ) );

      // check star conditions
      if ( this.checkConditions(star) ) {

        var particle = new Particle({ vector: new THREE.Vector3(x, y, z) });

        particle.properties = {
          id: star.id,
          name: star.pl_hostname,
          type: star.type,
          distance: star.dist,
          distanceLY: Math.round(star.dist * this.utils.PC),
          mass: star.mass,
          radius: star.radius,
          planets: star.pl_num,
          habitable: star.habitable,
          constellation: star.constellation,
          spectralType: star.spectralType,
          position: new THREE.Vector3(x, y, z)
        }

        // add it to the geometry
        //this.geometry.position.push( particle.position );

        //positions[idx + 0] = x / 100000;
        //positions[idx + 1] = y / 100000;
        //positions[idx + 2] = z / 100000;

        this.particleArray.push( particle );
        this.app.stars.push( particle );

        if ( parseInt(star.habitable) == 1)
          this.habitableStars.push(particle.properties);

      } else {

        console.log( 'star not in range' );

      }

    });

  
    var positions = new Float32Array( starLength * 3 );
    var starColors = new Float32Array( starLength * 3 );
    var starSizes = new Float32Array( starLength );

    var color = new THREE.Color();

    for ( var i = 0, i3 = 0; i < this.particleArray.length; i++, i3 += 3 ) {

      //positions[ i3 + 0 ] = this.particleArray[i].position.x / 100000;
      //positions[ i3 + 1 ] = this.particleArray[i].position.y / 100000;
      //positions[ i3 + 2 ] = this.particleArray[i].position.z / 100000;

      positions[ i3 + 0 ] = this.particleArray[i].position.x;
      positions[ i3 + 1 ] = this.particleArray[i].position.y;
      positions[ i3 + 2 ] = this.particleArray[i].position.z;

      starSizes[ i ] = 2000000;


      color.setHSL( i / this.particleArray.length, 1.0, 0.5 );

      starColors[ i3 + 0 ] = color.r;
      starColors[ i3 + 1 ] = color.g;
      starColors[ i3 + 2 ] = color.b;

      if (this.utils.spectralColors[ this.particleArray[i].properties.spectralType ] != undefined) {

        color = new THREE.Color( this.utils.spectralColors[ this.particleArray[i].properties.spectralType ] );

        starColors[ i3 + 0 ] = color.r;
        starColors[ i3 + 1 ] = color.g;
        starColors[ i3 + 2 ] = color.b;

      }
      

    }


    this.geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
    this.geometry.addAttribute('color', new THREE.BufferAttribute( starColors, 3 ) );
    this.geometry.addAttribute('size', new THREE.BufferAttribute( starSizes, 1 ) );

	}


  checkConditions ( star ) {

    return true;

    var distanceLY = star.dist * this.utils.PC;
    //window.utils.debug( distanceLY, star.pl_num );
    if ( star.pl_num >= 6 )
      return true;
  }


  getSpectralType (star) {

    return star.type.substr(0,1).toLowerCase().toString();

  }
 

  render () {

  	var self = this;

    this.particleMaterial = new THREE.ShaderMaterial({

      uniforms: this.uniforms,
      blending: THREE.NormalBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true

    });


    this.shader = new Shader({

      shader: 'particle-star',

      uniforms: this.uniforms,
      attributes: this.attributes

    });


    this.loadShader();


    this.particleSystem = new THREE.Points(
      this.geometry,
      this.particleMaterial
    );

    this.particleSystem.dynamic = true;

    // rotate the whole particle system by 39 degrees
    // see http://www.astronews.com/forum/archive/index.php/t-3533.html
    // particleSystem.rotation.x = -39 * (Math.PI/180);
      
    this.app.scene.add( this.particleSystem );
		
  }


  getParticleSystem () {
    return this.particleSystem;
  }


  loadShader() {

    this.shader.load( () => {

      this.particleMaterial = this.shader.getMaterial();

    });

  }



  animate () {

    var time = Date.now() * 0.0005;

    // this.particleSystem.rotation.z = 0.01 * time;

    var sizes = this.geometry.attributes.size.array;
    //var colors = this.geometry.attributes.color.array;

    //for ( var i = 0; i < this.particleArray.length; i++ ) {

      //sizes[ i ] = 100 * ( 1 + Math.sin( 0.1 * i + time ) );

    //}

    //this.geometry.attributes.size.needsUpdate = true;
    //this.geometry.attributes.color.needsUpdate = true;

  }


}
import THREE from 'three.js';

import Utils from '../app/utils';
import Geometries from '../helpers/geometry';

import Star from './spaceobjects/star';
import Planet from './spaceobjects/planet';
import Moon from './spaceobjects/moon';

export default class PlanetSystem {
  
  constructor (options = {}) {

    this.options = options;

    this.app = this.options.app;
    this.stars = this.options.system.stars;
    this.system = this.options.system;
    this.name = this.options.system.name;
    
    this.bodies = [];

    this.utils = new Utils();
    this.geometries = new Geometries();

    this.group = new THREE.Group();

    // this.options.app.scene.add(this.group);
    // this.group.position = new THREE.Vector3(0,0,0); //this.app.center;

    // this.renderTemparatureZones();
    this.render();

  }

  render() {

    console.log('rendering stars ', this.stars);

    this.stars[0].parentGroup = this.group;
    this.stars[0].meshes = this.meshes;
    this.stars[0].satellites = this.satellites;
    this.stars[0].orbits = this.orbits;
    this.stars[0].systemName = this.name;

    this.stars[0].orbitColor = this.orbitColor;

    this.starObject = new Star({ 
      group: this.group,
      app: this.app, 
      data: this.stars[0]
    });


    for ( var satellite in this.system.satellites ) {

      var object = this.system.satellites[satellite];

      // if ( object.type === 'planet' || object.type === 'dwarf-planet' || object.type === 'moon' || object.type === 'comet' ) {
      if (object.type === 'planet' || object.type === 'moon') {

        var planet = new Planet({ 
          app: this.app, 
          planetsystem: this,
          data: object, 
          group: this.group 
        });

        this.bodies.push(planet);

        this.group.add(planet.getObject());

        /*
        for ( moon in object.satellites ) {

          var obj = object.satellites[moon];

          new Moon({ 
            app: self.app, 
            planetsystem: self,
            data: obj, 
            group: planetView.objectPlane,
            visible: 0
          });

        }
        */

      }
    }

    this.bodies.push(this.starObject);

    this.group.add(this.starObject.getObject());


  }

  getObject() {

    return this.group;

  }


  renderTemparatureZones() {

    var minHZ = this.stars[0].minhz;
    var maxHZ = this.stars[0].maxhz;

    var HZPercentDimension = this.utils.getDimensionToTen( minHZ, maxHZ );

    if ( minHZ && maxHZ ) {

      console.log('render hab zone: ', minHZ, maxHZ);

      var normalizedMinHZ = this.utils.getDistance(minHZ, 'au');
      var normalizedMaxHZ = this.utils.getDistance(maxHZ, 'au');

      var centerHZ = normalizedMaxHZ - normalizedMinHZ;

      // create 2d zone temparature texture
      var canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;

      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      
      var objGradient = context.createRadialGradient( centerX, centerY, 1, centerX, centerY, canvas.width/2 );


      var colorStopMin = HZPercentDimension.minPercent - 0.1;
      var colorStopMax = HZPercentDimension.maxPercent + 0.1;

      if ( colorStopMin <= 0.0) colorStopMin = 0.1;
      if ( colorStopMax >= 1.0) colorStopMax = 0.95;

      objGradient.addColorStop( 0, 'rgba(255, 25, 25, 1.0)');
      objGradient.addColorStop( colorStopMin, 'rgba(255, 125, 25, 0.5)');
      objGradient.addColorStop( HZPercentDimension.minPercent + 0.1, 'rgba(50, 255, 50, 0.5)');
      objGradient.addColorStop( HZPercentDimension.maxPercent - 0.1, 'rgba(50, 255, 50, 0.5)');
      objGradient.addColorStop( colorStopMax, 'rgba(0, 0, 200, 0.5)');
      objGradient.addColorStop( 1.0, 'rgba(0, 0, 200, 0.01)');

      context.fillStyle = objGradient;

      context.beginPath();
      context.arc( centerX, centerY, canvas.width/2, 0, 2*Math.PI, false );
      context.fill();
      
      var texture = new THREE.Texture(canvas); 
          texture.needsUpdate = true;
          
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending
      });

      //var dimension = (centerHZ*2) + ( (centerHZ*2) * 75 / 100 )*2;
      var dimension = this.utils.getDistance(2 * HZPercentDimension.size, 'au');

      console.log(dimension);

      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry( dimension, dimension ),
        material
      );

      mesh.material.needsUpdate = true;

      //mesh.position.set( 0, - window.exoplanetsystems.systems.length * 10, 0 );
      mesh.position.set( 0, this.app.systems.length * 5, 0 );
      mesh.rotation.set( -90 * Math.PI / 180, 0, 0 );

      // render the specific limits as well   
      var innerHZLine = this.geometries.renderDashedCircle( normalizedMinHZ, new THREE.Color('rgba(255, 50, 255, 0.75)') );
      var outerHZLine = this.geometries.renderDashedCircle( normalizedMaxHZ, new THREE.Color('rgba(255, 50, 255, 0.75)') );

      this.group.add( innerHZLine );
      this.group.add( outerHZLine );

      mesh.visible = this.app.options.renderHabitableZone;

      this.group.add( mesh );
      this.habitableZone = mesh;
      // this.app.habitableZones.push( mesh );

    }
  }

};

import Component from '../app/component';

export var __useDefault = true;

export default class Search extends Component {

	init() {

		this.searchInput = $(this.node).find('input#search'),
		this.timeout = null;

		this.initControls();

	}

	initControls() {

		var self = this;

		this.searchInput.on('keyup', function(e){
			e.preventDefault();

			var val = $(this).val();

			clearTimeout(self.timeout);

			self.timeout = setTimeout(function(){
				if (val.length >= 3) {

					self.call(val);

				} else {

					$(this.node).find('ul').remove();

				}
			}, 200);

		});
	}

	call( val ){
		var self = this;

		$.ajax({
			url: $(this.node).data('url'),
			data: 'key=' + val,
			success: function(data){

				self.renderResultList(data);

			}
		});
	}

	renderResultList(data) {
		if (data) {

			$(this.node).find('ul').remove();
			$(this.node).append(data);
			
		}
	}

}
import $ from 'jquery';
import THREE from 'three.js';

export var __useDefault = true;

export default class Shader {


	constructor ( options = {} ) {

		this.options = options;

		this.shader = this.options.shader;
		this.uniforms = this.options.uniforms || [];
		this.attributes = this.options.attributes || [];

		this.isAnimateable = true;
		this.material = null;

		this.materials = {
			vertex: '',
			fragment: ''
		}

		this.i = 2;

	}


	load ( callback = {} ) {

		this.call({
			url: '../src/js/shaders/vertex-shader-'+ this.shader +'.js',
			shaderType: 'vertex',
			callback: callback
		});

		this.call({
			url: '../src/js/shaders/fragment-shader-'+ this.shader +'.js',
			shaderType: 'fragment',
			callback: callback
		});

	}


	getMaterial () {
		return this.material;
	}


	setMaterial () {

		this.material = new THREE.ShaderMaterial({  
		  uniforms: this.uniforms,
		  vertexShader: this.materials['vertex'],
		  fragmentShader: this.materials['fragment'],

			blending: THREE.NormalBlending,

		  transparent: true,
		  depthTest: false,
		  depthWrite: false
		});


		// this.uniforms.tNoise.value.wrapS = this.uniforms.tNoise.value.wrapT = THREE.RepeatWrapping;

	}


	setAttributes ( attributes = {} ) {
		this.attributes = attributes;
	}






	call ( options = {} ) {

		$.ajax({
			url: options.url,
			dataType: 'text',
			async: false,
			success: (data) => {

				this.materials[options.shaderType] = data;
				this.i--;

				if (this.i == 0) {
					this.setMaterial();
					options.callback(data);
				}

			}
		});

	}

}
import THREE from 'three.js';

import Utils from '../app/utils';

export default class SpaceObject {


	constructor (options = {}) {

		this.options = options;

		this.app = this.options.app;
		this.data = options.data;
		this.utils = new Utils();

		this.object = new THREE.Mesh();
		this.textureLoader = new THREE.TextureLoader();

		this.objectPlane = new THREE.Group();
		// this.options.group.add( this.objectPlane );

		this.hasTexture = false;
		this.hasShader = false;

		this.init();

	}

	init() {

		this.render();

		if (this.hasTexture)
			this.loadTexture();

		if (this.hasShader)
			this.loadShader();			

	}

	// @override
	render() {

	}
 

  loadTexture() {}

  loadShader() {}


  getObject() {

  	return this.objectPlane;

  }

	// @override
  animate() {}

}
import Component from '../app/component';

export var __useDefault = true;

export default class Tabs extends Component {

	init() {

		this.tabMenuItems = $(this.node).find('.tab-menu .tab-item');
		this.tabContentTabs = $(this.node).find('.tab-content .tab');

		this.initControls();

	}

	initControls() {
		
		var self = this;

		this.tabMenuItems.on('click', function(e){
			e.preventDefault();

			self.tabMenuItems.removeClass('active');
			$(this).addClass('active');

			self.toggleTabContent( $(e.currentTarget).data('id') );
		});

	}

	toggleTabContent( id ) {
		var self = this;
		var targetTabID = id;
		var targetTab = $(this.node).find('#' + targetTabID);

		if (!targetTab.length) {
			
			console.log('tab content pane not found');

		} else {

			if ( !targetTab.hasClass('active') ) {
				self.tabContentTabs.removeClass('active');
				targetTab.addClass('active');
			}

		}

	}

}

import $ from 'jquery';
import _ from 'underscore';
import THREE from 'three.js';
import Stats from 'stats';

import Utils from '../app/utils';
import PlanetSystem from './planetsystem';

import Solarsystem from '../data/solarsystem';
import ParticleStars from './particlestars';

import DistanceCircles from './distancecircles';
import CanvasElement from './canvaselement';

import Textures from '../helpers/textures';
import Shader from './shader';

import Label from '../views/label';
import InfoBox from '../views/infobox';

export default class ThreeScene {
  
  constructor (options = {}) {

  	this.utils = new Utils();
  	this.options = options;

  	this.systems = [];
  	this.orbits = [];
  	this.meshes = [];

  	this.labels = [];

  	this.stars = [];
  	this.particles = 'p';

  	this.raycaster = new THREE.Raycaster();
  	this.mouse = new THREE.Vector2();
  	this.fustum = new THREE.Frustum();


  	// to be optimized
  	this.time = Date.now();
		this.simTime = this.time;
		this.simTimeSecs = null;

		this.defaultSpeed = 100;

		this.startTime = _.now();

		// current speed (1 earth day represents 365/100 seconds in app)	
		this.currentSpeed = 100;
		this.speedStep = 100;

		this.date = new Date( this.simTime );
		this.timeElapsedSinceCameraMove = 0;
		this.timeElapsed = 0;



		this.clock = new THREE.Clock();
		this.delta = 0;
		this.timeElapsed = 0;



  	this.distanceCircles = null;

  	this.center = new THREE.Vector3(0,0,0);

  	this.currentSpeed = 100;

  	console.log('loading scene');

  	this.prepareScene();
    this.init();

  }

  prepareScene() {

  	this.scene = new THREE.Scene();
		this.renderer;
		this.camera; 
		this.cameraControls;
		this.controls;

  	if (this.utils.isWebGLSupported()) {

			this.renderer = new THREE.WebGLRenderer({
				antialias: true
			});

			this.renderer.setClearColor( 0x000000, 1 );

		} else {

			let message = new Message({text: 'No WebGL', state: 'info'});
					message.render();

			return;
		}


		// the position which the camera is currently looking at
		//this.cameraTarget = new THREE.Vector3(-4896521386, -5806265224, -1029922198);
		this.cameraTarget = new THREE.Vector3(0,0,0);

		// the current center position (planet systems will be rendered to this point)
		this.center = new THREE.Vector3(0,0,0);

		// this.cameraHelper = new CameraHelper({ app: self });

		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;

		this.container = document.getElementById('scene');
		this.container.appendChild(this.renderer.domElement);

	  // add event listeners
	  //document.addEventListener( 'mousedown', (e) => this.onDocumentMouseMove(e), false );
	  //document.addEventListener( 'mousemove', (e) => this.onDocumentMouseMove(e), false );
	  //document.addEventListener( 'mouseover', (e) => this.onDocumentMouseMove(e), false );

  }


  init() {

  	this.initCamera();
		this.initLighting();
		this.initResize();

	  this.renderStats();


	  //this.distanceCircles = new DistanceCircles({app: this});

	  this.renderCoordinateSystem('galaxy');
		this.renderGalaxyClusters();

		this.renderGalaxyGroups();

		// render global views
		this.$infoBox = new InfoBox({app: this});

	  this.animate();

  }



  initCamera( target ) {

  	var self = this;

  	if (target !== undefined || target != null)
  		self.cameraTarget = target;

		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.0001, 10000000000 );
		this.camera.updateProjectionMatrix();

		let pos = {
			x: this.utils.getDistance(1000000, 'ly')
		}

		pos.y = pos.x;
		pos.z = pos.x;

		console.log('rendering camera at:', pos.x, pos.y, pos.z);

		this.camera.position.set( pos.x, pos.y, pos.z );
		
		this.scene.add(this.camera);
		this.controls = new THREE.TrackballControls( this.camera, this.container );

		//var vector = new THREE.Vector3( this.controls.target.x, this.controls.target.y, this.controls.target.z );
  			//vector.applyQuaternion( this.camera.quaternion );

  	this.cameraTarget = this.controls.target;

		if (target !== undefined || target != null) {
			// window.utils.debug('defining new camera target', target);

			// define the camera position
			//this.cameraHelper.setCameraPosition(target);	

			// define the target which the camera shoul look at
			//this.cameraHelper.setCameraTarget(target);

		} else {
			this.camera.lookAt(this.cameraTarget);
			//this.cameraHelper.setCameraTarget( self.cameraTarget );
		}


		this.cameraPosition = new THREE.Vector3();
		this.cameraPosition = this.cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );
		this.cameraPositionOld = this.cameraPosition;

	  this.controls.rotateSpeed = 2.0;
	  this.controls.zoomSpeed = 1.8;
	  this.controls.panSpeed = 1.2;

	  //this.controls.minDistance = this.window.utils.makeDistance( 0.0001, 'au');

	  //this.controls.noZoom = false;
	  //this.controls.noPan = false;

	  this.controls.staticMoving = true;
	  this.controls.dynamicDampingFactor = 0.3;

	  //this.controls.keys = [ 65, 83, 68 ];
	  this.controls.addEventListener( 'change', this.render() );
  }


	initLighting() {

  	// create a point light
	  this.pointLight = new THREE.PointLight(0xFFFFFF, 1);
	  this.pointLight.position.set(10000, 10000, 10000);
	  this.scene.add( this.pointLight );

	  // add a very light ambient light
	  var globalLight = new THREE.AmbientLight(0xccffcc);

	  globalLight.color.setRGB( 
	  	this.options.globalLightIntensity,
	  	this.options.globalLightIntensity,
	  	this.options.globalLightIntensity
	  );

	  this.scene.add( globalLight );



	  var light = new THREE.DirectionalLight( 0xffffbb, 1 );
				light.position.set( -1000, 1000, - 1000 );

		this.scene.add( light );
  }


  renderGalaxyClusters () {
		var self = this;

		$.ajax({
		  url: '../public/data/local_group.json?time=' + Math.random(),
		  dataType: 'json',
		  success: (galaxies) => {

		  	let r = this.utils.redshiftToParsec(11.1);
		  	console.log('parsec', r);

		  	console.log(galaxies);
		  	
		  	var textures = new Textures();

				let num_particles = galaxies.length;

				let attributes = {
		      sizes: [],
		      colors: [],
		      alpha: []
		    };

		    let uniforms = {
		      amplitude: { type: 'f', value: 1.0 },
		      texture: { type: 't', value: textures.getStarMaterial() }
		    };


		    let geometry = new THREE.BufferGeometry();

		    var positions = new Float32Array( num_particles * 3 );
		    var starColors = new Float32Array( num_particles * 3 );
		    var starSizes = new Float32Array( num_particles );

		    var color = new THREE.Color(0xe0e0ff);

		    for ( var i = 0, i3 = 0; i < num_particles; i++, i3 += 3 ) {

		    	var g = galaxies[i];

		    	// var dist = this.utils.redshiftToParsec(g.z);
		    	var dist = this.utils.getDistance(g.d, 'ly'); 

		    	g.ra *= Math.PI / 180.0;
		    	g.dec *= Math.PI / 180.0;

		    	var x = dist * Math.cos( g.dec ) * Math.cos( g.ra );
      		var y = dist * Math.cos( g.dec ) * Math.sin( g.ra );
      		var z = dist * Math.sin( g.dec );

      		//x = this.utils.PCToLY(x);
      		//y = this.utils.PCToLY(y);
      		//z = this.utils.PCToLY(z);

      		// console.log(x,y,z);

		      positions[ i3 + 0 ] = x;
		      positions[ i3 + 1 ] = y;
		      positions[ i3 + 2 ] = z;

		      starSizes[ i ] = 1000000;

		      if (g.w && g.h) {

		      	starSizes[ i ] = g.w * 100;

		      }

		      //color.setHSL( i / num_particles, 1.0, 0.5 );

		      starColors[ i3 + 0 ] = color.r;
		      starColors[ i3 + 1 ] = color.g;
		      starColors[ i3 + 2 ] = color.b;


		      this.labels.push(new Label({ 
						app: this, 
						id: g.i,
						name: g.n,
						position: {x:x, y:y, z:z}
					}));

		    }


		    geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ) );
		    geometry.addAttribute('color', new THREE.BufferAttribute( starColors, 3 ) );
		    geometry.addAttribute('size', new THREE.BufferAttribute( starSizes, 1 ) );


		    var particleMaterial = new THREE.ShaderMaterial({

		      uniforms: uniforms,
		      blending: THREE.NormalBlending,
		      depthTest: false,
		      depthWrite: false,
		      transparent: true

		    });


		    var shader = new Shader({

		      shader: 'particle-star',

		      uniforms: uniforms,
		      attributes: attributes

		    });


		    shader.load( () => {

		      particleMaterial = shader.getMaterial();

		    });

		    var particleSystem = new THREE.Points(
		      geometry,
		      particleMaterial
		    );

		    particleSystem.dynamic = true;

		    // rotate the whole particle system by 39 degrees
		    // see http://www.astronews.com/forum/archive/index.php/t-3533.html
		    // particleSystem.rotation.x = -39 * (Math.PI/180);
		      
		    this.scene.add( particleSystem );

		    this.updateLabels();
		  }

		});

	}


	renderCoordinateSystem (type){
    var self = this;

    var coordinateSystems = {
    	'galaxy': {
        'group': new THREE.Group(),
        'visible': true,
        'settings': {
          'rings': 10,  
          'segments': 64,
          'degrees': 360/16,
          'distance': 11,
          'position': 1,
          'rotation': (Math.PI/2)
      	}
    	}
    };

    coordinateSystems[type].visible = true;

    console.log('Rendering coordinate system for', type);

    var settings = coordinateSystems[type].settings;
    var dist = settings.distance * this.utils.distancePixelRatio;

    var material = new THREE.LineBasicMaterial({ 
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0x101010),
      depthTest: false,
      depthWrite: false,
      transparent: false
    });

    var dashMaterial = new THREE.LineDashedMaterial({ 
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0x303030),
      opacity: 0.5,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      dashSize: dist/36, 
      gapSize: dist/36
    });

    //var axes = new THREE.AxisHelper(100);
		//this.scene.add(axes);

		// 1 mio ly
		var scaleFactor = this.utils.getDistance(100000, 'ly'); 


    // render the rings
    for (var i = 0; i < settings.rings + 1; i++) {

    	var arcShape = new THREE.Shape();
					arcShape.moveTo( 10, 0 );
					arcShape.absarc( 0, 0, 10, 0, Math.PI*2, false );
					arcShape.autoClose = true;

			var points = arcShape.createPointsGeometry(64);

			var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: new THREE.Color(0x101010), linewidth: 3 } ) );
					line.position.set( 0, 0, 0 );
					line.rotation.set( Math.PI/2, 0, 0 );
					line.scale.set( i*scaleFactor + scaleFactor, i*scaleFactor + scaleFactor, i*scaleFactor + scaleFactor );
					this.scene.add( line );


			/*
      var circle = new THREE.Shape();
          circle.moveTo(dist * i, 0 );
          circle.absarc( 0, 0, i * dist, 0, Math.PI*2, false );
      
      var points = circle.createPointsGeometry(settings.rings);

      var circleLine = new THREE.Line(points, 
        new THREE.LineBasicMaterial({ 
          color: new THREE.Color(0xff0000),
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          linewidth: 1,
          depthTest: false,
          depthWrite: false,
          transparent: true
        })
      );
      
      // add one AU as offset to move it to the center    
      // v_circle.position.set(0, -100, 0);    
      if (settings.position !== undefined)
        circleLine.position.set(settings.position, 0, 0);
      else
        circleLine.position.set(0, 0, 0);

      if (settings.rotation !== undefined) 
        circleLine.rotation.set(settings.rotation, 0, 0);
      else
        circleLine.rotation.set(Math.PI/2, 0, 0);

      coordinateSystems[type].group.add( circleLine );

      */
    }

     // render the angles
    for (var i = 0; i < settings.segments; i++) {

      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
          geometry.vertices.push( new THREE.Vector3(settings.rings * settings.distance * scaleFactor, 0, 0) );
          geometry.computeLineDistances();

      var shapeLine = null;
      if ( (i * 10) % 30 == 0 )
        shapeLine = new THREE.Line(geometry, material);
      else
        shapeLine = new THREE.Line(geometry, material);

      if (settings.position !== undefined)
        shapeLine.position.set(0, 0, 0);
      else
        shapeLine.position.set(0, 0, 0);

      if (settings.rotation !== undefined) 
        shapeLine.rotation.set(settings.rotation, 0, 10 * i * this.utils.toRad());
      else
        shapeLine.rotation.set(Math.PI/2, 0, 10 * i * this.utils.toRad());

      coordinateSystems[type].group.add( shapeLine );
    }

    coordinateSystems[type].group.position.set(0,0,0);
    this.scene.add( coordinateSystems[type].group );
  }


  renderGalaxyGroups () {

  	let positions = [
  		{x: this.utils.getDistance(27000,'ly'), y:0, z:0},
  	]

  	positions.forEach( (position) => {

  		var v = new THREE.Vector3(position);
  		var sphereGeom =  new THREE.SphereGeometry( this.utils.getDistance(400000,'ly'), 64, 32 );
			var blueMaterial = new THREE.MeshBasicMaterial({ 
				color: 0x5050ff, 
				transparent: true, 
				opacity: 0.15 
			});

			var sphere = new THREE.Mesh( sphereGeom, blueMaterial );

			sphere.position.set(-100, 50, 50);
			this.scene.add( sphere );	

  	});

  }


  renderStats ( container = $('body') ) {
  	this.stats = new Stats();

  	$(this.stats.domElement).attr('class', 'stats');
  	$(this.stats.domElement).css({
			'position': 'absolute',
			'bottom': '0',
			'z-index': 99
		});

		container.append( this.stats.domElement );
  }


  updateLabels () {

  	this.labels.forEach((label) => {
			label.updatePosition();
		});

  }


  initResize() {

		window.addEventListener('resize', () => {

      let w = window.innerWidth;
      let h = window.innerHeight;

      this.renderer.setSize( w, h );
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();

      this.updateLabels();
    });

  }


	animate ( step ){
  	this.timeElapsed = step;

    // loop on request animation loop
		// - it has to be at the begining of the function
		// - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		requestAnimationFrame( this.animate.bind( this ) );
		this.controls.update();


	  // set the time
	  this.lastTime = this.time;
	  this.time = Date.now();
	  this.dt = this.time - this.lastTime;
	  this.simTime += this.dt * this.currentSpeed;
	  this.date = new Date(this.simTime);
	  this.simTimeSecs = this.simTime;

		this.render(step);

		this.stats.update();
  }


  render (step) {
		var self = this;


		this.delta = this.clock.getDelta();
		this.timeElapsed = this.clock.getElapsedTime();

		// this.renderCount++;
		var now = _.now();
		var currentDate = new Date(now - this.startTime);
		var secondsElapsed = currentDate.getSeconds();
		var minutesElapsed = currentDate.getMinutes();
		// window.utils.debug('time since app start', minutesElapsed + 'm ' + secondsElapsed + 's');

		this.currentRenderLoops++;

		// calculate current distance from solar center
		this.cameraPosition = new THREE.Vector3();
		this.cameraPosition = this.cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );

		// distance in px
		this.distanceCamera = this.cameraPosition.distanceTo( self.cameraTarget );
		var distanceSolarCenter = this.distanceCamera * this.utils.distancePixelRatio;

		var distanceAU = parseFloat(distanceSolarCenter / this.utils.AU).toFixed(2);
		var distanceLY = parseFloat(distanceSolarCenter / this.utils.LY).toFixed(2);
		var distancePC = parseFloat(distanceLY / this.utils.PC).toFixed(2);

		this.currentDistanceLY = distanceLY;

		distanceSolarCenter = this.utils.numberFormat( this.distanceCamera * this.utils.distancePixelRatio );


		// calculate current distance from solar center
		this.cameraPosition = new THREE.Vector3();
		this.cameraPosition = this.cameraPosition.setFromMatrixPosition( this.camera.matrixWorld );

		// distance in px
		this.distanceCamera = this.cameraPosition.distanceTo( self.cameraTarget );
		var distanceSolarCenter = this.distanceCamera * this.utils.distancePixelRatio;

		var distanceAU = parseFloat(distanceSolarCenter / this.utils.AU).toFixed(0);
		var distanceLY = parseFloat(distanceSolarCenter / this.utils.LY).toFixed(0);
		var distancePC = parseFloat(distanceLY / this.utils.PC).toFixed(0);

		this.currentDistanceLY = distanceLY;

		distanceSolarCenter = this.utils.numberFormat( this.distanceCamera * this.utils.distancePixelRatio );

		//$('#distance-km').text( distanceSolarCenter );
		//$('#distance-au').text( distanceAU );
		$('#distance-ly').text( distanceLY );
		$('#distance-pc').text( distancePC );


		// check if camera position changed and recalculate star sizes
		if (this.cameraPosition.y != this.cameraPositionOld.y) {
			this.cameraPositionOld = this.cameraPosition;
			console.log('camera changed');

			this.updateLabels();
		}

		this.renderer.render( this.scene, this.camera );
	}



  onDocumentMouseMove(e) {

		e.preventDefault();

		this.updateMousePosition(e);

		//var self = this;
		//var vector = new THREE.Vector3( ( e.clientX / window.innerWidth ) * 2 - 1, - ( e.clientY / window.innerHeight ) * 2 + 1, .5 );
		// this.projector.unprojectVector( vector, this.camera );

		//vector.unproject(this.camera);

		//var rayCaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
	

		/*
		_.each( self.markers, function( marker, idx ){
			self.scene.remove( marker );
		});
		*/

		
		// var intersects = rayCaster.intersectObjects( this.meshes, true );


		//  check intersection of stars
		this.intersectStars(e);

		// var mouse = { x: 0, y: 0, z: 1 };

		

		// this where begin to transform the mouse cordinates to three.js cordinates
	  // mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
	  // mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
	    
	  // this vector caries the mouse click cordinates
	  //var mouse_vector = new THREE.Vector3(0,0,0);
	  		//mouse_vector.set( mouse.x, mouse.y, mouse.z );

	 	// this.projector.unprojectVector( mouse_vector, this.camera );
	  
	  //mouse_vector.unproject(this.camera);

	  //var direction = mouse_vector.sub( this.camera.position ).normalize();
	  //rayCaster.set( this.camera.position, direction );
	    


		// check if the user moves the mouse over a planet or host star
		/*
		_.each( this.meshes, function( mesh, idx ){
			//window.utils.debug(mesh);
			if( mesh.position ) {
				intersects = rayCaster.intersectObject( [mesh] );

				if( intersects.length > 0 ) {
	  			window.utils.debug( intersects[ 0 ].object );
	  		}
			}
		});
		*/

		// s$('#tooltip').hide();
		// self.canvasElement.hideViewHelper();
		// this.checkStarMouseCollision(e);

	}


	updateMousePosition ( e ) {

		this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
		this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

	}


	/**
	 * track mouse movement over stars
	 */
	intersectStars (e) {

		if (this.particles) {

			this.raycaster.setFromCamera( this.mouse, this.camera );

			let intersects = this.raycaster.intersectObject( this.particles );
			let INTERSECTED;

			if ( intersects.length > 0 ) {

				if ( INTERSECTED != intersects[ 0 ].index ) {

					INTERSECTED = intersects[ 0 ].index;

					// console.log(intersects[ 0 ]);
					console.log( this.loadedStars[INTERSECTED] );

					this.canvasElement.updatePosition({
						x: e.clientX,
						y: e.clientY
					});
					
					this.canvasElement.registerObject(this.loadedStars[INTERSECTED]);
					this.canvasElement.showTooltip();
					this.canvasElement.show();

				}

			} else if ( INTERSECTED !== null ) {

				INTERSECTED = null;
				this.canvasElement.hide();
				this.canvasElement.hideTooltip();

			}

		}

	}



	checkStarMouseCollision (e) {


		if (!this.isMouseOverElement(e)) {

			// check if user moves the mouse near a star
			this.stars.forEach(( star, idx ) => {

				if (star) {

					var pos = this.utils.getPosition2D( star, this );

					
					if (star.properties.id <= 100) {
						// console.log(pos.x);
					}

					if ( pos.x >= (e.clientX - 5) && pos.x <= (e.clientX + 5) ) {
						if ( pos.y >= (e.clientY - 5) && pos.y <= (e.clientY + 5) ) {

							console.log('star hovered');

							this.canvasElement.updatePosition(pos);
							this.canvasElement.updateObjectInfo(star);
							this.canvasElement.showTooltip();
							this.canvasElement.showViewHelper();

						}
					}

				}

			});

		}

	}


	// check over which element the mouse is
	isMouseOverElement (event){
		let el = document.elementFromPoint(event.clientX, event.clientY);
    return !$(el).is('canvas') && !$(el).hasClass('habitable-star-label');
	} 


}


//# sourceMappingURL=app.js.map
