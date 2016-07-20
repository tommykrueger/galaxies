import $ from 'jquery';

import Utils from '../app/utils';

export default class Template {

	constructor ( options = {} ) {

		this.utils = new Utils();
		this.templates = [];

		this.data = options.data;
		this.template = options.template;

		this.templates['tooltipStarTemplate'] = $(`

			<div class="headline">${this.data.pl_hostname}</div>

			<div class="property">
			  <div class="label"><span>Type</span></div>
			  <div class="value"><span>${this.data.type}</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Distance (Parsec)</span></div>
			  <div class="value"><span>${this.data.dist}</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Distance (Light Years)</span></div>
			  <div class="value"><span>${ (this.data.dist * this.utils.PC).toFixed(2) }</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Mass (Sun Masses)</span></div>
			  <div class="value"><span>${this.data.mass}</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Radius (Sun Radii)</span></div>
			  <div class="value"><span>${this.data.radius}</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Planets</span></div>
			  <div class="value"><span>${this.data.pl_num}</span></div>
			</div>

			<div class="property">
			  <div class="label"><span>Habitable Planets</span></div>
			  <div class="value"><span>${this.data.habitable}</span></div>
			</div>

		`);


		this.templates['galaxyInfo'] = $(`

			<div class="image-wrapper"> 
				<img src="../public/img/galaxies/${this.data.image}" />
			</div>

			<div class="headline">${this.data.name}</div>

			<div class="description">Type: ${this.data.description}</div>

			<div class="property">Type: ${this.data.type}</div>
			<div class="property">Distance: ${ this.data.dist * 1000 } LY</div>
			<div class="property">Group: ${this.data.galaxy_group}</div>

		`);

	}


	render () {

		return this.templates[this.template];

	}

}