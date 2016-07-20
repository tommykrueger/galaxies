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