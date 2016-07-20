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