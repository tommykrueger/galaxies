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