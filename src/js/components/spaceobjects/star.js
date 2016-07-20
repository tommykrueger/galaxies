import THREE from 'three.js';

import Utils from '../../app/utils';
import SpaceObject from '../spaceobject';

import Shader from '../shader';

export default class Star extends SpaceObject {

 
  render () {


  	// this.hasTexture = true;
  	this.hasShader = true;

		// Stars are rendered as glowing light source
		// render as lens flare

		/*
		this.textureLensFlare = THREE.TextureLoader.load( "img/lensflare0.png" );

	  var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
				light.color.setHSL( 0.25, 0.9, 0.5 );
				//light.position.set( 0, 0, 0 );
				
		// App.bulgeLight = light;
		light.intensity = 0.01;
		this.app.scene.add( light );

		var flareColor = new THREE.Color( 0xffffff );
				//flareColor.setHSL( 0.55, 0.9, 0.5 + 0.7 );
				flareColor.setHSL( 0.25, 0.4, 0.5 + 0.7 );

		var lensFlare = new THREE.LensFlare( this.textureLensFlare, 128, 0.0, THREE.AdditiveBlending, flareColor );

		lensFlare.add( this.textureLensFlare, 32, 0.0, THREE.AdditiveBlending );
		lensFlare.add( this.textureLensFlare, 32, 1.0, THREE.AdditiveBlending );

		// lensFlare.add( this.textureLensFlare, 60, 0.6, THREE.AdditiveBlending );
		// lensFlare.add( this.textureLensFlare, 70, 0.7, THREE.AdditiveBlending );
		// lensFlare.add( this.textureLensFlare, 120, 0.9, THREE.AdditiveBlending );
		// lensFlare.add( this.textureLensFlare, 70, 1.0, THREE.AdditiveBlending );

		lensFlare.customUpdateCallback = function(){ return false; };
		//lensFlare.position = light.position;

		// App.bulge = lensFlare;
		// this.app.scene.add( lensFlare );

		*/

		this.rotationPeriod = this.utils.defaultStarRotationPeriod;

		this.radius = this.utils.radiusSun * this.data.radius / this.utils.radiusStarPixelRatio;

		// render star as geometry
		//var geometry = new THREE.IcosahedronGeometry( 20, 4 );

		var geometry = new THREE.SphereBufferGeometry( this.radius, 128, 128 );



		this.shader = new Shader({

			shader: 'animated-star',

			uniforms: {
				//amplitude: { value: 1.0 },
				//color: { value: new THREE.Color( 0xff2200 ) },
				//time: { value: 1.0 },
				//resolution: { value: new THREE.Vector2() }
				tExplosion: {
            type: "t", 
            value: THREE.ImageUtils.loadTexture('img/explosion.png')
        },
        time: { // float initialized to 0
            type: "f", 
            value: 0.0 
        }
			}

		});


		this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: false, 
      depthTest: true,
      depthWrite: true
    });


		this.displacement = new Float32Array( geometry.attributes.position.count );
			
		geometry.addAttribute( 'displacement', new THREE.BufferAttribute( this.displacement, 1 ) );


		this.object = new THREE.Mesh( geometry, this.material );

		this.object.name = this.data.name;
		this.object.properties = {
			type: 'star',
			name: this.data.name,
			radius: this.data.radius,
			mass: this.data.mass,
			temp: this.data.temp,
			distance: ( this.data.dist * this.utils.PC ).toFixed(2),
			distanceLY: ( this.data.dist * this.utils.PC ).toFixed(2),
			minhz: this.data.minhz / 1000,
			maxhz: this.data.maxhz / 1000,
			planets: this.data.planets,
			habitable: this.data.habitable,
			texture: 'sun.jpg',
			spectralClass: this.data.spec.toLowerCase() || '-'
		}


		this.renderStarGlow();

		this.app.meshes.push( this.object );
		this.objectPlane.add( this.object );
		


		//this.app.meshes.push( this.object );
		//this.app.scene.add( this.object );

		/*
		material = new THREE.SpriteMaterial({ 
			//map: self.app.textures.getStarMaterial(),
			map: THREE.TextureLoader.load( "img/lensflare0.png" ),
			color: 0xab9000,
			alignment: THREE.SpriteAlignment.center,
			useScreenCoordinates: false,
      sizeAttenuation: true,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending 
    });

		// example: http://stemkoski.github.io/Three.js/Simple-Glow.html
		var sprite = new THREE.Sprite( material );
		// sprite.position = new THREE.Vector3(0, 0, 0);
		sprite.scale.set( 
			this.data.radius * 512 * 2, 
			this.data.radius * 512 * 2, 
			1.0 
		);
		
		this.object.add(sprite);
		*/
		// self.app.scene.add( sprite );

		
  }


  renderStarGlow() {

  	var spriteMaterial = new THREE.SpriteMaterial({ 
			//map: self.app.textures.getStarMaterial(),
			map: THREE.ImageUtils.loadTexture( "img/lensflare0.png" ),
			color: 0xab9000,
			useScreenCoordinates: false,
      sizeAttenuation: true,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending 
    });

		// example: http://stemkoski.github.io/Three.js/Simple-Glow.html
		var sprite = new THREE.Sprite( spriteMaterial );
		// sprite.position = new THREE.Vector3(0, 0, 0);
		sprite.scale.set( 
			this.radius * 1024 * 2, 
			this.radius * 1024 * 2, 
			1.0 
		);
		
		this.object.add(sprite);

  }


  loadTexture() {

  	this.textureLoader.load('img/materials/sun.jpg', (texture) => {

			let material = new THREE.MeshBasicMaterial({
			  map: texture,
			  shading: THREE.SmoothShading, 
			  blending: THREE.AdditiveBlending, 
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


  getObject() {

  	return this.objectPlane;

  }


  animate ( step ) {

  	if (this.rotationPeriod) {

  		if (this.rotationClockwise === false)
				this.object.rotation.y -= 100 / (24 * 60 * 60);    

			else
				this.object.rotation.y += 100 / (24 * 60 * 60);    	
  	}


  	if (this.shader.isAnimateable) {

  		this.shader.uniforms.time.value = 0.0275 * this.app.timeElapsed;

  		//this.shader.uniforms.amplitude.value = 2.5 * Math.sin( this.object.rotation.y * 0.125 );
			//this.shader.uniforms.color.value.offsetHSL( 0.0005, 0, 0 );

			// console.log(step, Math.sin(step));


  		for ( var i = 0; i < this.displacement.length; i++ ) {

				//this.displacement[ i ] = Math.sin( 0.1 * i);

				//noise[ i ] += 0.5 * ( 0.5 - Math.random() );
				//noise[ i ] = THREE.Math.clamp( noise[ i ], -5, 5 );

				//this.displacement[ i ] = Math.sin(step * i * Math.random());

			}

  		// this.shader.uniforms.time.value += 0.05;
  		//this.object.geometry.attributes.displacement.needsUpdate = true;

  		// console.log(this.displacement[10]);

  	}

  }

}