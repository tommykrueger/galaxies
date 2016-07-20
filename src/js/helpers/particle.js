
export default class Particle {

  constructor ( options ) {

    // define the position of the particle
		this.position = options.vector;

		// initialize size with init value
		this.size = 256;

		// field for additional 
		this.properties = {};
  }

}
