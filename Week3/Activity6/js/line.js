class Line {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 30, right: 10, left: 30 }
    }

    // Call a class function
    this.initVis();
  }

  initVis() {
      


      updateVis(); //leave this empty for now...
  }


  //leave this empty for now
 updateVis() { 
   
   renderVis(); 

 }


 //leave this empty for now...
 renderVis() { 

  }



}