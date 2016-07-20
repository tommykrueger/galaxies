import THREE from 'three.js';

import View from '../app/view';
import Template from '../views/template';

export default class Label extends View {
  

  constructor ( options = {} ) {

    super();

    this.app = options.app;
    this.id = options.id;
    this.name = options.name;

    this.position = options.position || { x:0, y:0, z:0};
    // this.planetsystem = options.planetsystem;

    // this.planetsystemName = this.planetsystem.name.toLowerCase().replace(' ', '-');
    // this.planetName = this.data.name.toLowerCase().replace(' ', '-');

    this.$template = $(`

      <span id="${this.id}" class="label label-${this.name} label-${this.name}">
        <span class="label-marker"></span>
        ${this.name}
      </span>

    `);

    this.render();
    this.initEvents();

  }


  render () {
    
    $('#labels').append( this.$template );

  }


  initEvents () {


    this.$template.on('click', (e) => {
      
      let $btn = $(e.currentTarget);
      let id = $btn.attr('id');

      this.loadAsynch('../server/galaxy.php?id=' + id, {}, 'GET', this.showInfo, this);

      console.log('load planet data');

    });


    this.$template.on('mouseover', (e) => {

      console.log('planet mouseover');

    });

    this.$template.on('mouseout', (e) => {
      
      console.log('planet mouseout');

    });

  }


  remove () {

    this.$template.remove();

  }


  updatePosition (object = null) {

    if (!object) {

      object = new THREE.Object3D(this.position);
      object.position.set(this.position.x, this.position.y, this.position.z);

    }

    //let pos = window.utils.getPosition2D( mesh.parent.parent, self.camera, self.projector);
    

    if (this.utils.inFrustum(this.app, object.position)) {

      let pos = this.utils.toScreenPosition( object, this.app.camera );

      this.$template.css({
        'display': 'block',
        'left': pos.x + 'px',
        'top': pos.y + 'px'
      });

    } else {

      this.$template.css('display', 'none');

    }


  }

  showInfo (response) {

    console.log('showing info', response);

    let template = new Template({
      data: response,
      template: 'galaxyInfo'
    });

    this.app.$infoBox.setHtml( template.render() );
    this.app.$infoBox.show();  

  }

}