let customGui;
let rotator;
let animator;

function setup() {
    createCanvas(600, 600, WEBGL);
    setupCamera();
    customGui = new CustomGUI();
    customGui.init();
    rotator = new Rotator();
    rotator.setDrawObject(drawPandaHand);
    rotator.setDrawAxis(drawAxes);
    animator = new Animator(500,100);
}
  
function draw() {
    background(220);

    drawAxes(0,-400,0);
    if (animator.isAnimating()) {
        customGui.hideButtons();
    } else {
        customGui.showButtons();
        if (customGui.checkAnimationRequest()) {
            animator.start();
        }
    }
        
    customGui.update();
    rotator.drawRotated(customGui.getAngles(),animator.getState(),customGui.getRotation());
    animator.update();
}

function setupCamera() {
    camera(250, -800, -250, 0, 0, 0, 0, 0, 1);
    ortho(-width / 4, width / 4, -height / 4, height / 4,100,1000);

}

function drawPandaHand() {
    push();
        if (customGui.wireframe) {
            noFill();
        }
        rotateZ(-PI/4);
        rotateY(PI/2);
        push();
            box(30,150,30);
            push();
                translate(35,45,0);
                box(40,20,20);
            pop();
            push();
                translate(35,-45,0);
                box(40,20,20);
            pop();
            push();
                translate(-25,0,0);
                box(20,120,30);
            pop();
        pop();
    pop();
}

function drawAxes(xPos=0,yPos=0,zPos=0) {
    push()
        translate(xPos,yPos,zPos);
        push();
            // Z-axis: Blue
            fill(0,0,255);
            translate(0,0,-20)
            box(3,3,40);
        pop();
        push();
            // Y-axis: Green
            fill(0,255,0);
            translate(0,20,0)
            box(3,40,3);
        pop();    
        push();
            // X-axis: Red
            fill(255,0,0);
            translate(20,0,0)
            box(40,3,3);
        pop();
    pop();
}