export var __useDefault = true;

export default class Log {

  init () {}

  info (message) {
  	this.print(message, 'info');
  }

  error (message) {
		this.print(message, 'error');
  }

  print (message, type = 'info') {
  	if (typeof(console) === 'object' && window.console.log) {
  		console.log(message);
  	}
  }
}