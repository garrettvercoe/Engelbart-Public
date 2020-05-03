class Engelbart {
  constructor(x, y, size, destinations) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.row = x * size;
    this.col = y * size;
    this.idle = 0;
    this.destinations = destinations;
    this.destCoords = [];
    this.nextDest = -1;
    this.currentDest = -1;

    //this.unseen = destinations;
    // create list to populated with the indices of unseen destinations
    this.unseen = [];
    for (let i = 0; i < destinations.length; i++){
      this.unseen.push(i);
    }

    /* state */
    this.moving = false;
    this.thinking = true;
    this.talking = false;

    /* animation */
    this.left = false;
    this.emotion = 0;
  }

  /* function for updating state */
  update() {
    let row = int(this.destCoords[0]/this.size);
    let col = int(this.destCoords[1]/this.size);

    if (!this.talking && this.x == row && this.y == col) {
      // at destination
      this.moving = false;
      this.thinking = true;
    }
  }
  display() {
    // need to add going through move queue
    this.row = this.x * this.size;
    this.col = this.y * this.size;

    fill(255);
    stroke(58, 76, 246);

    let weight = 3;
    let engelbartWidth = 2 * this.size - weight;
    strokeWeight(weight);

    // idle position
    let vertIdle = this.col + engelbartWidth/5;
    if (this.idle == 1) {
      vertIdle = this.col + engelbartWidth/4.5;
    }

    // move animation state
    let moveAnim = this.row+engelbartWidth/4;
    if (this.moving) {
      if (this.left) {
        moveAnim = this.row+engelbartWidth/6;
      } else {
        moveAnim = this.row+engelbartWidth/3;
      }
    }

    let noseTip = 3*engelbartWidth/9;
    let mouth = 0;
    if (this.left) {
      noseTip = engelbartWidth/9;
      mouth = (4*engelbartWidth/9);
    }

    let smile = 4*engelbartWidth/9;
    if (this.emotion == 1) {
      smile = 5*engelbartWidth/9;
    } else if (this.emotion == 2) {
      smile = 6*engelbartWidth/9;
    }

    /* Draw his face */
    square(this.row, this.col, engelbartWidth, 3, 3, 3, 3);
    fill(58, 76, 246);
    noStroke();

    /* MAKE FACE based on relative dimensions for scalability */
    push();
    translate(moveAnim, vertIdle);
    scale(0.9);
    // left eye
    rect(0, 0, engelbartWidth/9, 2*engelbartWidth/9);

    // right eye
    rect((4*engelbartWidth/9), 0, engelbartWidth/9, 2*engelbartWidth/9);

    // nose
    square((2*engelbartWidth/9), (engelbartWidth/9), engelbartWidth/9);
    square(noseTip, (2*engelbartWidth/9), engelbartWidth/9);
    square((2*engelbartWidth/9), (3*engelbartWidth/9), engelbartWidth/9);

    // mouth
    rect((engelbartWidth/9), (5*engelbartWidth/9), engelbartWidth/3, engelbartWidth/9);
    square(mouth, smile, engelbartWidth/9);
    pop();
  }

  // handles movement specifics, called in update
  /* calculates move list */
  move() {
    this.currentDest = this.nextDest;

    this.moving = true;

    let dest = this.destCoords;
    // find row and col closest
    let row = int(dest[0]/this.size);
    let col = int(dest[1]/this.size);

    /* MOVEMENT LOGIC */
    if (this.x > row) {
      this.x--;
      this.left = true;
    } else if (this.x < row) {
      this.x++;
      this.left = false;
    } else if (this.y < col) {
      this.y++;
    } else if (this.y > col) {
      this.y--;
    }
  }

  /* set the destination once, to be called in thinking state */
  setDest() {
    if (this.unseen.length > 0) {
      
      let remove = int(random(this.unseen.length));
      // gets random unseen destination index
      let index = this.unseen[remove];
      
      //console.log(index);
      this.destCoords = this.destinations[index];
      //print('WHY: ' + str(this.destCoords));
      this.nextDest = index;
      this.unseen.splice(remove, 1);
      //console.log(this.unseen);
    } else {
      let index = int(random(this.destinations.length));
      this.destCoords = this.destinations[index];
      this.nextDest = index;
    }
  }
}
