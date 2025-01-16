function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES)
}

function draw() {
  background(150,255,100);
  fill(0)
  square(700, 200, 100)

  fill(200,120,200)
  circle(730, 237, 20)
  circle(770, 237, 20)

  fill(0,0,100) 
  arc(750, 260, 75, 25, 0, 180)
  
  
  beginShape();
  vertex(790, 200)
  vertex(690, 175)
  vertex(700, 190)
  vertex(730, 160)
  vertex(765, 190)
  vertex(770, 150)
  vertex(820, 200)
  endShape(CLOSE);


}  
