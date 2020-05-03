/* CLUSTER CLASS */

class Cluster {
  constructor(w, h, size, x, y, sentiment, popularity, xDest, yDest, id, tag, summary) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.sentimentArray = sentiment;
    // radius determined by popularity value
    this.radius = int(popularity/7);
    this.absPosX = w/2;
    this.absPosY = h/2;
    this.xDest = int(xDest/size)*size;
    this.yDest = int(yDest/size)*size;
    this.xRow = 0;
    this.yRow = 0;
    this.positions = [[w/2, h/2], [w/2, h/2], [w/2, h/2], [w/2, h/2], [w/2, h/2], [w/2, h/2], [w/2, h/2], [w/2, h/2]];
    this.cells = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    this.seen = false;
    this.id = id;
    this.tag = tag;
    this.active = false;

    this.summary = summary;

    this.colors = [color(221, 88, 230), color(174, 97, 245), color(144, 102, 250), color(100, 107, 255), color(68, 108, 255), color(68, 177, 255), color(80, 214, 153), color(82, 218, 119)];
    this.blue = color(68, 108, 255);
  }

  update() {
    for (let i=0; i<this.sentimentArray.length; i++) {
      let d = sqrt( sq(this.positions[i][0] - this.xDest) + sq(this.positions[i][1] - this.yDest) ) + 20;
      let xjitter = 0.75*d * random(-this.radius, this.radius);
      let yjitter = 0.75*d * random(-this.radius, this.radius);

      this.positions[i][0] += (this.xDest - this.positions[i][0]) / 10;
      this.positions[i][1] += (this.yDest - this.positions[i][1]) / 10;

      let randX = this.positions[i][0] + xjitter;
      let randY = this.positions[i][1] + yjitter;

      this.cells[i][0] = int(randX / this.size);
      this.cells[i][1] = int(randY / this.size);
    }
  }

  clicked() {
    if (this.seen && this.xDest-this.radius*20 < mouseX && mouseX < this.xDest+this.radius*20 && this.yDest-this.radius*20 < mouseY && mouseY < this.yDest+this.radius*20) {
      let url = 'https://twitter.com/hashtag/' + this.tag + '?lang=en';
      window.open(url);
      return true;
    }
  }

  display() {

    /* Temporary reveal of cluster areas */
    //push();
    //noFill();
    //stroke(58, 76, 248, 70);
    //strokeWeight(3);
    //square(this.xDest-(this.radius*20), (this.yDest-this.radius*20), 20*this.radius*2, 3, 3, 3, 3);
    //pop();

    for (let i=0; i<this.sentimentArray.length; i++) {
      /* MAP to colors array */
      if (this.sentimentArray[i]>0.1) {
        if (this.seen) {
          fill(this.colors[i]);
        } else if (!this.seen) {
          fill(this.blue);
          //fill(this.colors[i]);
        }
        square(this.cells[i][0]*this.size, this.cells[i][1]*this.size, this.size, 3, 3, 3, 3);
      }
    }
  }
}
