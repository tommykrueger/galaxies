import Component from '../app/component';

export var __useDefault = true;

export default class Tabs extends Component {

	init() {

		this.tabMenuItems = $(this.node).find('.tab-menu .tab-item');
		this.tabContentTabs = $(this.node).find('.tab-content .tab');

		this.initControls();

	}

	initControls() {
		
		var self = this;

		this.tabMenuItems.on('click', function(e){
			e.preventDefault();

			self.tabMenuItems.removeClass('active');
			$(this).addClass('active');

			self.toggleTabContent( $(e.currentTarget).data('id') );
		});

	}

	toggleTabContent( id ) {
		var self = this;
		var targetTabID = id;
		var targetTab = $(this.node).find('#' + targetTabID);

		if (!targetTab.length) {
			
			console.log('tab content pane not found');

		} else {

			if ( !targetTab.hasClass('active') ) {
				self.tabContentTabs.removeClass('active');
				targetTab.addClass('active');
			}

		}

	}

}