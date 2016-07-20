
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

		// this.renderGalaxyGroups();

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

		this.galaxyPositions = [];

		$.ajax({
		  url: '../public/data/local_group.json?time=' + Math.random(),
		  //url: '../public/data/galaxies.json?time=' + Math.random(),
		  dataType: 'json',
		  success: (galaxies) => {

		  	//let r = this.utils.redshiftToParsec(11.1);
		  	//console.log('parsec', r);

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

		      var size = 1000000;

		      if (g.w && g.h) {
		      	size = g.w * 100;
		      }

		      starSizes[ i ] = size;


		      this.galaxyPositions.push({
		      	id: g.i,
      			name: g.n,
      			position: new THREE.Vector3(x,y,z), 
      			size: size || 1
    			});

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
		    this.renderGalaxyConnections();

		    /*
		    var line = new THREE.Line( 
		    	geometry, 
		    	new THREE.LineBasicMaterial({ 
		    		color: 0xffffff, opacity: 0.5
		    	}) 
		    );

				this.scene.add( line );
				*/
		  }

		});

	}


	renderGalaxyConnections () {

		// radius in ly
		var r = 50000000;

		
		var material = new THREE.LineBasicMaterial({ color: 0x5f7fef, transparent: true, opacity: 0.15});

		this.galaxyPositions.forEach( (g1) => {

			this.galaxyPositions.forEach( (g2) => {

				if (g1.id != g2.id) {

					var d = this.utils.getDistance(g1.position.distanceTo(g2.position), 'ly');

					if ( d && d <= r) {

						var geometry = new THREE.Geometry();

						geometry.vertices.push(g1.position);
	    			geometry.vertices.push(g2.position);

	    			var line = new THREE.Line(geometry, material);

						this.scene.add(line);

	    		}
	    	}

			});

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

