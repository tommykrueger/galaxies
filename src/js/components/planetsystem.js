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
