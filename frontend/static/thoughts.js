class Thought {
  constructor(x, y, time) {
    this.x = x;
    this.y = y - 40.3;
    this.time = time;
    this.text = ['Hi, I am Engelbart'];
    this.active = true;

    this.count = 0;
    this.runningSum = 0;
    this.totalLength = 0;
    this.currentText = 0;
    // char storage
    this.textArray = [[], [], []];
    // text to display
    this.displayText = ['', '', ''];

    this.tag = '';
  }

  update(x, y, text, tag) {
    this.x = x;
    this.y = y - 40.3;
    this.text = text;
    this.tag = '#' + tag;

    this.textArray = [[], [], []];

    this.totalLength = 0;

    for (let i = 0; i < this.text.length; i++) {
      for (let j = 0; j < text[i].length; j++) {
        this.textArray[i][j] = text[i].charAt(j);
        this.totalLength++;
      }
    }

    this.displayText = ['', '', ''];
    this.count = 0;
    this.runningSum = 0;
    this.currentText = 0;
  }

  display() {
    if (this.totalLength > this.count) {
      this.displayText[this.currentText] += this.textArray[this.currentText][this.count-this.runningSum];
      if (this.displayText[this.currentText].length == this.textArray[this.currentText].length) {

        this.runningSum = this.count + 1;
        this.currentText++;
      }

      this.count++;
    }

    /* iterate through what is in the displayText array
     each entry in displayText is another square */
    for (let i = 0; i < this.displayText.length; i++) {
      let textLength = this.displayText[i].length;
      let size = (textLength*9)+7;

      push();
      // changes location of text box depending on thoughts order
      translate(this.x, this.y - (36 * i));

      if (this.active && this.displayText[i].length > 0) {
        fill(255);
        stroke(58, 76, 246);
        rect(0, 0, size, 30, 3, 3, 3, 3);

        fill(58, 76, 246);
        noStroke();
        textFont(font);
        textSize(14);
        text(this.displayText[i], 6, 18);
      }
      pop();
    }

    if (this.active && this.tag != '#undefined') {
      let tagLength = this.tag.length;
      let size = (tagLength*9)+7;

      push();
      translate(this.x, this.y + 90);
      fill(58, 76, 246);
      stroke(58, 76, 246);
      rect(0, 0, size, 30, 3, 3, 3, 3);

      fill(255);
      noStroke();
      textFont(font);
      textSize(14);
      text(this.tag, 6, 18);
      pop();
    }
  }
}
