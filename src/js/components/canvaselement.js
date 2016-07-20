
//var TooltipView = require('../../views/tooltip_view');
//var InfoboxView = require('../../views/infobox_view');

import $ from 'jquery';
import THREE from 'three.js';

import Tooltip from '../views/tooltip';

export default class CanvasElement {

  constructor ( options ) {

  	this.app = options.app;
    this.model = options.object;
    this.pos = options.pos;
    this.type = options.type;

    this.clicked = false;

    this.viewHelperGroup = new THREE.Object3D();

    this.tooltip = new Tooltip();
    this.tooltip.hide();

    this.render();

  }

  render() {

  	// render a canvas circle at the screen position
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 24;
    this.canvas.height = 24;

    var context = this.canvas.getContext('2d');
        context.beginPath();
        context.arc(12, 12, 11, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        context.strokeStyle = '#99FF66';
        context.stroke();


    // add click event (dirty)
    $(document).on('click', '#canvas', (e) => {

      // dirty: prevent multiple click events
      if (!this.clicked) {
        this.clicked = true;
        e.preventDefault();
        e.stopPropagation();

        /*
        self.infobox = new InfoboxView({
          app: self.app,
          object: self.model,
          data: self.model.properties,
          template: 'star-info'
        });

        */
      }

      this.clicked = false;

    });

  }


  registerObject (object) {

    this.object = object;

  }


  show () {

    $('#canvas').css({'opacity': 1.0});

  }

  hide () {

    $('#canvas').css({'opacity': 0.0});

  }


  showTooltip() {

    this.tooltip.updatePosition(this.pos);
    this.tooltip.setData(this.object);
    this.tooltip.show();

  }

  hideTooltip () {
    this.tooltip.hide();
  }


  updatePosition (pos) {

    this.pos = pos;

    $('#canvas').css({
      'left': pos.x - 12 + 'px',
      'top': pos.y - 12 + 'px',
      'opacity': 1.0
    });

  }


  updateObjectInfo (objectInfo) {

    this.model = objectInfo;

  }


  showViewHelper() {

    this.hideViewHelper();
    this.viewHelperGroup = new THREE.Object3D();

    if (this.app.currentDistanceLY >= 1) {

      console.log('showing helper lines');

      var pos = this.model.properties.position;

      // show two lines
      var material = new THREE.LineBasicMaterial({
        color: 0x0090ff,
        linewidth: 1
      });

      // define the geometry shape
      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
          geometry.vertices.push( new THREE.Vector3(pos.x, 0, pos.z) );

      var line1 = new THREE.Line(geometry, material);

      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(pos.x, 0, pos.z) );
          geometry.vertices.push( new THREE.Vector3(pos.x, pos.y, pos.z) );

      var line2 = new THREE.Line(geometry, material);

      var geometry = new THREE.Geometry();
          geometry.vertices.push( new THREE.Vector3(0, 0, 0) );
          geometry.vertices.push( new THREE.Vector3(pos.x, pos.y, pos.z) );

      var line3 = new THREE.Line(geometry, material);

      this.viewHelperGroup.add(line1);
      this.viewHelperGroup.add(line2);
      this.viewHelperGroup.add(line3);

      this.app.scene.add(this.viewHelperGroup);

    }
  }


  hideViewHelper() {

    this.app.scene.remove(this.viewHelperGroup);

  }

}
