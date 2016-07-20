import THREE from 'three.js';

import View from '../app/view';
import Template from '../views/template';

export default class InfoBox extends View {
  

  constructor ( options = {} ) {

    super();

    this.app = options.app;

    this.$template = $(`

      <div class="infobox">
        <div class="infobox-header"> <span class="infobox-close-btn">&times;</span> </div>
        <div class="infobox-content"> </div>
      </div>

    `);

    this.render();
    this.initEvents();

  }


  render () {
    
    $('body').append( this.$template );

  }


  initEvents () {


    this.$template.find('.infobox-close-btn').on('click', (e) => {
      
      this.remove();

    });


  }


  setHtml ( $html ) {

    this.$template.find('.infobox-content').html( $html );

  }


  show () {

    this.$template.fadeIn('fast');

  }


  remove () {

    this.$template.fadeOut('fast');

  }


}