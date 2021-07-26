let society;
let startTime;
let frameCount;
let currentFrameRate;
let gridCanvas;


function setup() {
  createCanvas(1280, 720);
  frameRate(60);

  prepareGridCanvas();

  society = new Society(gridCanvas);
  startTime = performance.now();
  frameCount = 0;
  currentFrameRate = 0;
}

function prepareGridCanvas() {
  gridCanvas = createImage(100, 100);
  gridCanvas.loadPixels();

  clearGridCanvas();
}

function clearGridCanvas() {
  for (let i = 0; i < gridCanvas.width; i++) {
    for (let j = 0; j < gridCanvas.height; j++) {
        gridCanvas.set(i, j, color(0, 0, 0));
    }
  }
}

function draw() {
  background(255);

  society.update(deltaTime);

  frameCount++;
  if(performance.now()-startTime >= 200) {
    currentFrameRate = Math.round(frameCount*5);
    frameCount = 0;
    startTime = performance.now();
  }

  fill(0);
  textAlign(LEFT);
  textSize(9);
  text("FPS: " + currentFrameRate, 5, 10);

}