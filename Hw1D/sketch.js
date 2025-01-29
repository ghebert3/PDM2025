function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  angleMode(DEGREES)
}

function draw() {
  background(240,150,220);

  fill(120,700,85)
  stroke('white')
  strokeWeight(4);
  circle(430, 330, 280)
 

  fill(0, 90, 100) 
  let x = 430, y = 330;
  let radius1 = 50;
  let radius2 = 140;
  let npoints = 5; 
  let angle = 360 / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
for (let i = 0; i < 10; i++) {
  let r = i % 2 ? radius1 : radius2; 
  let angle = -90 + i * halfAngle; 
  vertex(x + cos(angle) * r, y + sin(angle) * r);
}
endShape(CLOSE);



}  