import THREE from 'three.js';

import Log from '../app/log';
import Utils from '../app/utils';


/**
 * Helper class to define custom textures used for THREE.js rendering
 * Textures rendered to 2d canvas
 */
export default class Textures {


  constructor ( options = {} ) {
    this.options = options;
    this.utils = new Utils();
  }


  getStarMaterial ( showShininess ) {
	
		// create the star texture
		var canvas = document.createElement( 'canvas' );
				canvas.width = 512;
				canvas.height = 512;

		//var col = new THREE.Color(color);
		var context = canvas.getContext( '2d' );

		var gradient = context.createRadialGradient( 
			canvas.width / 2, 
			canvas.height / 2, 
			0, 
			canvas.width / 2, 
			canvas.height / 2, 
			canvas.width / 2 
		);

		gradient.addColorStop( 0, 'rgba(200, 200, 255, 1.0)');
		gradient.addColorStop( 0.05, 'rgba(150, 150, 255, 1.0)');
		gradient.addColorStop( 0.1, 'rgba(215, 215, 215, 0.35)' );
		gradient.addColorStop( 1.0, 'rgba(0,0,0,0.0)' );

		context.fillStyle = gradient;
		context.fillRect( 0, 0, canvas.width, canvas.height );

		if ( showShininess ) {
			context.beginPath();
			context.lineWidth = 2;

			// top - bottom 
      context.moveTo(canvas.width/2, 0);
      context.lineTo(canvas.width/2, canvas.height);

      // left - right
      context.moveTo(0, canvas.height/2);
      context.lineTo(canvas.width, canvas.height/2);

      // set line color
      context.strokeStyle = 'rgba(255,255,255,0.75)';
      context.stroke();
		} 

		var texture = new THREE.Texture(canvas); 
				texture.needsUpdate = true;

		return texture;
	}


}

