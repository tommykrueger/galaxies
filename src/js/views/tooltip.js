import View from '../app/view';

import Template from './template';

export default class Tooltip extends View {
  
  constructor ( options = {} ) {

    super();

    this.$template = $('<div id="tooltip"></div>');
    this.render();
  }


  render () {

    $('body').append(this.$template);

  }


  setData (data) {

    let template = new Template({
      template: 'tooltipStarTemplate',
      data: data
    });

    this.$template.html( template.render() );

  }


  updatePosition (pos) {

    this.$template.css({
      left: pos.x + 18,
      top: pos.y
    });

  }


  remove (){

    this.$template.remove();

  }

  show () {

    this.$template.show();

  }

  hide () {

    this.$template.hide();

  }


}
