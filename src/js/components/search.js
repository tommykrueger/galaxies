import Component from '../app/component';

export var __useDefault = true;

export default class Search extends Component {

	init() {

		this.searchInput = $(this.node).find('input#search'),
		this.timeout = null;

		this.initControls();

	}

	initControls() {

		var self = this;

		this.searchInput.on('keyup', function(e){
			e.preventDefault();

			var val = $(this).val();

			clearTimeout(self.timeout);

			self.timeout = setTimeout(function(){
				if (val.length >= 3) {

					self.call(val);

				} else {

					$(this.node).find('ul').remove();

				}
			}, 200);

		});
	}

	call( val ){
		var self = this;

		$.ajax({
			url: $(this.node).data('url'),
			data: 'key=' + val,
			success: function(data){

				self.renderResultList(data);

			}
		});
	}

	renderResultList(data) {
		if (data) {

			$(this.node).find('ul').remove();
			$(this.node).append(data);
			
		}
	}

}