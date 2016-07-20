import Log from './app/log';
import ThreeScene from './components/threescene.js';


export default class App {
  
  constructor () {

    this.THREESCENE = new ThreeScene();
    this.setDevelopmentMode();

  }


  setDevelopmentMode () {

    window.isDevelopmentMode = true;

  }

};

new App();