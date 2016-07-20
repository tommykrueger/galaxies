import THREE from 'three.js';

import Utils from '../../app/utils';
import SpaceObject from '../spaceobject';

import Shader from '../shader';

import Label from '../../views/label';

export default class Planet extends SpaceObject {

 
  render () {

  	console.log('rendering planet', this.data);


  	this.hasTexture = true;
  	this.texture = this.data.texture;
  	this.planetsystem = this.options.planetsystem;


  	// orbit desciption

		this.eccentricity 						= this.data.eccentricity || 0.0;
		this.semiMajorAxis 						= this.data.semiMajorAxis || 1;
		this.inclination 							= this.data.inclination || 0;

		this.rotationPeriod 					= this.data.rotationPeriod || null;
		this.rotationClockwise 				= this.data.rotationClockwise;
		this.longitudeAscendingNode 	= this.data.longitudeAscendingNode || 0;


		// assumed one earth year if not given
		this.siderealOrbitPeriod 			= this.data.siderealOrbitPeriod || 365;


  	this.radius = this.data.radius || this.utils.radiusEarth;


  	// for non solar system planets
  	if ( this.data.type == 'planet' && this.radius < 1000 ) {
			this.radius *= this.utils.radiusEarth;
		}

		if (this.data.orbit_color !== undefined) 
			this.data.orbitColor = this.data.orbit_color;

		if (this.data.confirmed == undefined)
			this.data.confirmed = 1;


		// used for longitude of the ascending node
		this.referencePlane = new THREE.Object3D();

		// base plane holds the orbit ellipse and inclination
		this.basePlane = new THREE.Object3D();

		// pivot holds the planet sphere shape
	  this.pivot = new THREE.Object3D();

	  // planet plane is used for additional objects like moons
	  // moons will be added as child objects to this group
		this.objectPlane = new THREE.Object3D();


		this.referencePlane.add( this.basePlane );
		this.basePlane.add(this.pivot);
		this.pivot.add(this.objectPlane);
	 	this.options.group.add( this.referencePlane );


	 	this.color = new THREE.Color( this.utils.planetDefaultColor );

	 	var geometry = new THREE.SphereGeometry( this.radius / this.utils.radiusPixelRatio, 32, 32 );
		var material = new THREE.MeshLambertMaterial({ 
			color: 0xffffff
		});

		var planetTransparency = 1.0;

		if (!this.data.confirmed) {
			planetTransparency = 0.25;
		}


	  this.object = new THREE.Mesh(geometry, material);
		this.object.name = this.data.name;
		this.object.properties = {
			name: this.data.name,
			realName: this.realName,
			radius: this.radius.toFixed(2),
			distance: (this.data.distance * this.utils.PC).toFixed(4),
			siderealOrbitPeriod: this.siderealOrbitPeriod,
			semiMajorAxis: this.semiMajorAxis,
			eccentricity: this.eccentricity,
			inclination: this.inclination,
			rotationPeriod: this.rotationPeriod,
			image: this.texture,
			temparature: this.data.temp,
			masse: this.data.masse,
			habitable: this.data.habitable,
			esi: this.data.esi,
			habitableMoon: this.data.habitableMoon,
			method: this.data.method,
			year: this.data.year,
			type: this.data.type,
			tempClass: this.data.tempClass,
			confirmed: this.data.confirmed,
			texture: this.texture
		};

		this.object.spaceRadius = this.radius / this.utils.radiusPixelRatio;
		this.objectPlane.add(this.object);
		// this.planetsystem.meshes.push(this.object);
		this.app.meshes.push(this.object);

	




		this.renderOrbit();
		this.initLabel();
		
  }


  renderOrbit () {

  	var self = this;
	  var circle = new THREE.Shape();
	  //circle.moveTo(this.position[0], 0);

	  if ( this.eccentricity >= -1 ) {

	  	// aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise
			var ellipseCurve = new THREE.EllipseCurve(

				(self.eccentricity * 100 * self.semiMajorAxis / 100) / this.utils.distancePixelRatio,
				0,
	   		self.semiMajorAxis / this.utils.distancePixelRatio, 

	   		// taken from http://en.wikipedia.org/wiki/Semi-minor_axis
				( self.semiMajorAxis * Math.sqrt(1 - Math.pow(self.eccentricity, 2) ) ) / this.utils.distancePixelRatio, 
	    	0, 
	    	2.0 * Math.PI,
	    	false

	    );

			var ellipseCurvePath = new THREE.CurvePath();
					ellipseCurvePath.add(ellipseCurve);

			var ellipseGeometry = ellipseCurvePath.createPointsGeometry(512);
					// ellipseGeometry.computeTangents();

			// render solid line		
			/*
			var orbitMaterial = new THREE.LineBasicMaterial({
			  color: window.settings.orbitColors[ App.systems.length ],
			  blending: THREE.AdditiveBlending,
			  depthTest: true,
			  depthWrite: false,
			  opacity: window.settings.orbitTransparency,
				linewidth: window.settings.orbitStrokeWidth,
			  transparent: true
			});
			*/

			var orbitTransparency = this.utils.orbitTransparency;

			if (!self.data.confirmed) {
				orbitTransparency = 0.25;
			}

			var orbitColor = this.utils.orbitColors[ this.app.systems.length ];
			
			if (self.data.type == 'comet' || self.data.type == 'dwarf-planet') {
				orbitColor = 0x909090;
				orbitTransparency = 0.25;
			}

			if (this.data.orbitColor) {
				orbitColor = this.data.orbitColor;
			}

			// render dashed line
			var orbitMaterial = new THREE.LineDashedMaterial({
			  color: orbitColor,
			  blending: THREE.AdditiveBlending,
			  depthTest: true,
			  depthWrite: true,
			  opacity: orbitTransparency,
				linewidth: 1,
			  transparent: true,
			  dashSize: this.utils.AU / 100000, 
			  gapSize: this.utils.AU / 100000 
			});

			var line = new THREE.Line(ellipseGeometry, orbitMaterial);
			
			if (!self.data.confirmed) {
				ellipseGeometry.computeLineDistances();
				line = new THREE.Line(ellipseGeometry, orbitMaterial, THREE.LinePieces);
			}

			line.orbitColor = this.utils.orbitColors[ this.app.systems.length ];
			// line.orbitColorHover = window.settings.Colors[ App.systems.length ].orbitHover;

			this.referencePlane.rotation.y = this.longitudeAscendingNode * Math.PI/2;
			line.rotation.set(Math.PI/2, 0, 0);

			if ( this.type != 'camera' ) {

		  	this.basePlane.add(line);

		  	/*
		  	self.planetsystem.orbits.push({ 
		  		line: line ,
		  		name: self.data.name.replace(' ', '-').toLowerCase(), 
		  		type: self.data.type
		  	});
		  	*/

		  	this.app.orbits.push({ 
		  		line: line ,
		  		name: self.data.name.replace(' ', '-').toLowerCase(), 
		  		type: self.data.type
		  	});

	  	}

		} else {

			// x, y, radius, start, end, anti-clockwise
			circle.absarc(0, 0, self.semiMajorAxis / this.utils.distancePixelRatio, 0, Math.PI*2, false);

			var points = circle.createPointsGeometry(128);
		  v_circle = new THREE.Line(
		  	points, 
				new THREE.LineBasicMaterial({ 
					//color: self.orbitColor,
					color: this.utils.orbitColors[ self.app.systems.length ],
					opacity: this.utils.orbitTransparency,
					linewidth: 1,
					transparent: true,
					depthTest: false,
			  	depthWrite: false
				})
			);

		  v_circle.rotation.set(Math.PI/2, 0, 0);

		  self.basePlane.add(v_circle);
		  self.planetsystem.orbits.push({ 
		  	line: v_circle,
		  	name: self.data.name, 
		  	type: self.data.type
		  });

		  self.app.orbits.push({ 
	  		line: v_circle,
	  		name: self.data.name, 
	  		type: self.data.type
	  	});

		}

		this.basePlane.inclination = 1;
		this.basePlane.rendertype = 'basePlane';
		this.basePlane.rendername = this.name;

		// set the inclination
		if ( this.inclination > 0) {
			this.basePlane.inclination = this.inclination;
			this.basePlane.rotation.set(this.inclination * Math.PI / 180.0, 0, 0);
		}


  }


  initLabel () {

		this.label = new Label({ 
			app: this.app, 
			object: this,
			data: this.object.properties, 
			planetsystem: this.planetsystem,
			visible: this.visible 
		});

  }


  loadTexture() {

  	this.textureLoader.load('img/materials/'+ this.texture, (texture) => {

			let material = new THREE.MeshBasicMaterial({
			  map: texture,
			  shading: THREE.SmoothShading, 
			  blending: THREE.NormalBlending, 
			  color: 0xffffff, 
			  depthTest: true,
	      depthWrite: true
			});

			this.object.material = material;

		});

  }


  loadShader() {

  	this.shader.load( () => {

			this.object.material = this.shader.getMaterial();

		});

  }


  animate ( step ) {

  	if (this.rotationPeriod) {

  		if (this.rotationClockwise === false)
				this.object.rotation.y -= 100 / (24 * 60 * 60);    

			else
				this.object.rotation.y += 100 / (24 * 60 * 60);    	
  	}


  	if (this.pivot) {
	    	
				if (this.eccentricity > -1) {

			    var aRadius = this.semiMajorAxis / this.utils.distancePixelRatio;
			    var bRadius = aRadius * Math.sqrt(1.0 - Math.pow(this.eccentricity, 2.0));

			    // get the current angle
			    // the orbit period is always calculated in days, so here
			    // we need to change it to seconds
			    var angle = this.app.simTimeSecs / (this.siderealOrbitPeriod * 24 * 60 * 60 * 10) * Math.PI*2 * -1;

			    var x = aRadius * Math.cos(angle) + (this.eccentricity * 100 * this.semiMajorAxis / 100) / this.utils.distancePixelRatio;
			    var y = 0;
			    var z = bRadius * Math.sin(angle);

			    this.pivot.position.set(x, y, z);
			    this.app.scene.updateMatrixWorld();

			    var vector = new THREE.Vector3();
							vector.setFromMatrixPosition( this.pivot.matrixWorld );


					this.setPosition(vector);

				}

				else
					this.pivot.rotation.y += 1 / this.siderealOrbitPeriod;
    }



  	/* 
  	if (this.shader.isAnimateable) {

  		this.shader.uniforms.amplitude.value = 2.5 * Math.sin( this.object.rotation.y * 0.125 );
			this.shader.uniforms.color.value.offsetHSL( 0.0005, 0, 0 );

			// console.log(step, Math.sin(step));


  		for ( var i = 0; i < this.displacement.length; i++ ) {

				this.displacement[ i ] = Math.sin( 0.1 * i);
				this.displacement[ i ] = Math.sin(step * i * Math.random());

			}

  		// this.shader.uniforms.time.value += 0.05;
  		this.object.geometry.attributes.displacement.needsUpdate = true;

  	}
  	*/

  }


  setPosition (vector) {

  	this.object.position.set( vector.x, vector.y, vector.z );
		this.object.__dirtyPosition = true;

  }


  getObject() {

  	return this.objectPlane;

  }

}