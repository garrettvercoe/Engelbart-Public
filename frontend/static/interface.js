class Interface {

  constructor(w, h) {
    // fixed size for interface
    this.base = 20.15;
    this.w = w;
    this.h = h;
    this.link1 = false;
    this.link2 = false;
    
    this.colors = [color(221, 88, 230), color(174, 97, 245), color(144, 102, 250), color(100, 107, 255), color(68, 108, 255), color(68, 177, 255), color(80, 214, 153), color(82, 218, 119)];
  }

  update() {
    /* Menu interaction and display */
    if (7.5*20.15 < mouseX && mouseX < 12.8*20.15-3 && 20.15 < mouseY && mouseY < 20.15*3) {
      this.link1 = true;
    } else {
      this.link1 = false;
    }
    if (12.8*20.15-3 < mouseX && mouseX < 15.2*20.15-3 && 20.15 < mouseY && mouseY < 20.15*3) {
      this.link2 = true;
    } else {
      this.link2 = false;
    }
  }

  display() {
    push();
    fill(58, 76, 246);
    stroke(58, 76, 246);
    rect(this.base, this.base, 5.5*this.base-3, 2*this.base);
    
    
    if (this.link1) {
      fill(58, 76, 246);
    } else if (!this.link1){
      fill(255);
    }
    rect(6.5*this.base-3, this.base, 6.3*this.base, 2*this.base);
    
    if (!this.link2) {
      fill(255);
    } else if (this.link2) {
      fill(58, 76, 246);
    }
    rect(12.7*this.base-3, this.base, 2.5*this.base+3, 2*this.base);
    pop();

    //push();
    //fill(68, 108, 255);
    //stroke(68, 108, 255);
    //rect(this.base, 3*this.base, 5.5*this.base-3, this.base);
    //pop();

    textFont(medium);
    textSize(16);
    fill(255);
    text('Engelbart', this.base*1.5, this.base*2.25);

    textFont(font);
    if (this.link1 == false) {
      fill(58, 76, 246);
    } else {
      fill(255);
    }
    text('Where am I?', 7*this.base-3, 2.25*this.base);
    if (this.link2 == false) {
      fill(58, 76, 246);
    } else {
      fill(255);
    }
    text('</>', 13.3*this.base-3, 2.25*this.base);

    //fill(255);
    //textSize(10);
    //text('Beta Build B0.9', 1.5*this.base, 3.75*this.base);
    
    // drop down sentiment scale
    if(this.link1 == true){
      push();
      stroke(58, 76, 246);
      fill(255);
      rect(this.base, 3*this.base, 14.2*this.base, 7*this.base);
      
      
      fill(58, 76, 246);
      noStroke();
      square(3.4*this.base, 5.4*this.base, 20.15-3, 3, 3, 3, 3);
      textSize(12);
      text('This is Cyberspace, a virtual public\nspace created from live Twitter data', 1.5*this.base, 4*this.base);
      text('Each     represents how people are\nfeeling about a topic', 1.5*this.base, 6*this.base);
      
      text('Negative', 2.5*this.base, 9.2*this.base);
      text('Positive', 2.5*this.base+170, 9.2*this.base);
      
      for (let i = 0; i < this.colors.length; i++){
        fill(this.colors[i]);
        square(2.5*this.base+i*30, 7.5*this.base, 20.15-3, 3, 3, 3, 3);
      }
      pop();
    }

    push();
    // border
    noFill();
    stroke(58, 76, 246);
    strokeWeight(7);
    rect(0, 0, this.w, this.h);
    pop();
  }
}
