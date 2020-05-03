/* ENGELBART CANVAS */

var data;

// init array of Clusters
var Clusters = [];

// global vars
var w = 0;
var h = 0;
var size = 0;
// everything is based on this
var numVCells = 0;
var numHCells = 0;

var ai;

var menu;

let thought;

var destinations = [];
var prevDest = 0;

var paused = false;

function preload() {
  let params = getURLParams();
  data = loadJSON(params.data);
  font = loadFont('assets/fonts/IBMPlexMono-Regular.ttf');
  medium = loadFont('assets/fonts/IBMPlexMono-Medium.ttf');
}

function setup() {
  // update global vars on initial load
  w = windowWidth;
  h = windowHeight;
  numVCells = 40;
  size = h / numVCells;
  numHCells = int(w / size);

  createCanvas(w, h);
  background(255);

  let length = Object.keys(data).length;

  draw_grid(true);

  for (let x = 0; x < length; x++) {
    //push new SimpleCluster objects to array
    //let xDest = random(w);
    //let yDest = random(h);
    let xDest = data[x].Position[0]*w;
    let yDest = data[x].Position[1]*h;
    destinations.push([xDest, yDest]);

    Clusters.push(
      new Cluster(
      w, 
      h, 
      size, 
      int(random(numHCells)), 
      int(random(numVCells)), 
      data[x].Sentiment, 
      data[x].Popularity, 
      xDest, 
      yDest, 
      x, 
      data[x].Tag, 
      data[x].Summary
      )
      );
  }

  let engelbartDestinations = [];

  for (let i = 0; i < Clusters.length; i++) {
    engelbartDestinations.push([Clusters[i].xDest+Clusters[i].radius*Clusters[i].size, Clusters[i].yDest-Clusters[i].radius*Clusters[i].size]);
  }

  ai = new Engelbart(
    int(numHCells / 2), 
    int(numVCells / 2), 
    size, 
    engelbartDestinations
    );

  ai.display();

  menu = new Interface(w, h);

  thought = new Thought(ai.row, ai.col, 0);
  thought.update(ai.row, ai.col, ['Hi, I am Engelbart', 'Taking a look around...']);
}

var lastTime = 0;

// time of pause in ms
var timeInterval = 10000;

function draw() {
  frameRate(8);

  let timeStamp = millis();

  if (!paused) {
    // continuously draw grid
    draw_grid(false);

    // update cluster jitter and display
    for (let x = 0; x < Clusters.length; x++) {
      Clusters[x].update();
      Clusters[x].display();
    }

    /* idle animation updating every other frame */
    if (frameCount % 2 == 0) {
      if (ai.idle == 0) {
        ai.idle = 1;
      } else {
        ai.idle = 0;
      }
    }

    /* MOVEMENT */
    /* Every 4 frames */
    if (frameCount % 4 == 0) {
      ai.update();
      if (!ai.thinking && timeStamp > lastTime + timeInterval) {
        // call move if in moving state
        ai.move();
        ai.thinking = false;

        Clusters[prevDest].active = false;

        thought.active = false;
      } else if (ai.thinking) {
        // 1 second state transition
        // set time
        lastTime = timeStamp;
        ai.setDest();
        ai.talking = true;
        ai.thinking = false;
        // update thought once
        if (ai.currentDest >= 0) {
          thought.update(ai.row, ai.col, Clusters[ai.currentDest].summary, Clusters[ai.currentDest].tag);
        }
      } else if (ai.talking && timeStamp < lastTime + timeInterval) {
        // behavior for after initial load
        if (ai.currentDest >= 0) {
          // random emotion when he reaches new destination
          let max = indexOfMax(Clusters[ai.currentDest].sentimentArray);

          if (max < 3) {
            ai.emotion = 2;
          } else if (max >= 3 && max < 5) {
            ai.emotion = 1;
          } else if (max => 5) {
            ai.emotion = 0;
          }

          // set current as previous to be deactivated on move
          prevDest = ai.currentDest;

          Clusters[ai.currentDest].active = true;
          Clusters[ai.currentDest].seen = true;

          thought.active = true;
        }
        ai.thinking = false;
        ai.talking = false;
      }
    }

    // Engelbart looking around for first timeInterval
    if (frameCount % 12 == 0 && timeStamp < timeInterval) {
      ai.left = !ai.left;
    }

    thought.display();
    ai.display();

    menu.update();
    menu.display();
    
    /* --- HOVER --- 
    Clusters that have been seen will show cluster area and hashtag on hover
    */
    let count = 0;
    for (let i = 0; i < Clusters.length; i++) {
      let radius = Clusters[i].radius;
      if (Clusters[i].seen && !Clusters[i].active && Clusters[i].xDest-radius*20 < mouseX && mouseX < Clusters[i].xDest+radius*20 && Clusters[i].yDest-radius*20 < mouseY && mouseY < Clusters[i].yDest+radius*20 && count < 1) {
        
        // show cluster area
        push();
        noFill();
        stroke(58, 76, 248);
        strokeWeight(3);
        square(Clusters[i].xDest-this.size*radius, Clusters[i].yDest-this.size*radius, this.size*radius*2, 3, 3, 3, 3);
        pop();

        let tagLength = Clusters[i].tag.length + 1;
        let size = (tagLength*9)+7;

        push();
        translate(mouseX+8, mouseY+8);
        fill(58, 76, 246);
        stroke(58, 76, 246);
        rect(0, 0, size, 30, 3, 3, 3, 3);

        fill(255);
        noStroke();
        textFont(font);
        textSize(14);
        text('#' + Clusters[i].tag, 6, 18);
        pop();
        
        count++;
      }
    }
  }
}

// function to draw grid
function draw_grid(init) {
  for (let i = 0; i < numHCells + 2; i++) {
    for (let j = 0; j < numVCells + 1; j++) {
      // add stroke to each rect, will likely replace this in the future with even absolute spacing
      strokeWeight(3);
      stroke(255, 255, 255);
      // on load, opacity set to 0
      if (init) {
        fill(200, 215, 255);
      } else {
        fill(200, 215, 255, 70);
      }
      // draw square for each cell
      square((i - 1) * size, (j - 1) * size, size, 3, 3, 3, 3);
    }
  }
}

/* pause/unpause when p pressed */
function keyTyped() {
  if (key == 'p') {
    paused = !paused;
  }
}

function mousePressed() {
  // call clicked for every Cluster, trigger clicked()
  let count = 0;
  for (let x = 0; x < Clusters.length; x++) {
    if (count < 1) {
      if (Clusters[x].clicked()) {
        count++;
      }
    }
  }

  if (12.8*20.15-3 < mouseX && mouseX < 15.2*20.15-3 && 20.15 < mouseY && mouseY < 20.15*3) {
    window.open('https://github.com/garrettvercoe/engelbart');
  }
}

function indexOfMax(arr) {
  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
