import View from '../app/view';

export default class Dialog extends View {
  

  constructor ( options = {} ) {

    super();

    this.title = options.title;
    this.text = options.text;
    this.action = options.action;

    this.prepareTemplate();
    this.render();
    this.initEvents();

  }


  prepareTemplate () {

    this.$template = $(`<div class="dialog"></div>`);

    this.$title = $(`<div class="dialog-title">${this.title}</div>`);
    this.$text = $(`<div class="dialog-text">${this.text}</div>`);
    this.$actions = $(`<div class="dialog-actions"><button class="button button-featured button-large hidden action-btn">Start</button></div>`);

    this.$template.append( this.$title );
    this.$template.append( this.$text );
    this.$template.append( this.$actions );

  }


  render () {
    
    $('body').append(this.$template);

  }


  initEvents () {


    this.$template.find('.button-round').on('click', (e) => {
      
      let $btn = $(e.currentTarget);
      let resolution = $btn.data('resolution');

      this.$template.find('.button-round').not(this).removeClass('active');
      $btn.toggleClass('active');

      this.action.scope.setResolution(resolution);

      this.$template.find('.action-btn').removeClass('hidden');

    });


    this.$template.find('.action-btn').on('click', (e) => {

      this.close();
      this.action.scope[this.action.function]();

    });

  }


  close () {

    this.$template.remove();

  }

}