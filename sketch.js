let customGui;
let rotator;
let animator;
let cameraControls = [];
let orthoPersp = true;

function setup() {
    createCanvas(600, 600, WEBGL);
    setupCameraControls();
    
    customGui = new CustomGUI();
    rotator = new Rotator();
    animator = new Animator(500,100);

    customGui.init();
    rotator.setDrawObject(drawPandaHand);
    rotator.setDrawAxis(drawAxesLines);
}
  
function draw() {
    background(220);

    drawAxesLines(0,-400,0);
    updateCamera();

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

function setupCameraControls() {
    cameraControls.push(createSlider(0, PI/2, PI/8, 0.01)); // Elevation
    cameraControls.push(createSlider(-PI, PI, -PI/2.75, 0.01)); // Azimuth
    cameraControls.push(createSlider(0, 1, 0.25, 0.01)); // Zoom
    cameraControls.push(createButton('Orthographic / Perspective'));
    cameraControls.push(createButton('Reset Camera'));
    cameraControls.push(createDiv('<b>Camera Controls</b>'));
    cameraControls.push(createDiv('Elevation'));
    cameraControls.push(createDiv('Azimuth'));
    cameraControls.push(createDiv('Zoom'));

    for (let i = 5; i < cameraControls.length; i++) {
        cameraControls[i].style('font-size','20px');
        cameraControls[i].style('text-align','center');
        if (i >= 6) {
            cameraControls[i].style('width','129px');
            cameraControls[i].position(2 + (i-6) * 133,620);
        }
    }
    // Perspective toggle button
    cameraControls[3].style('width','99px');
    cameraControls[3].style('height','48px');       
    cameraControls[3].position(400,601);
    cameraControls[3].mousePressed(() => { orthoPersp = !orthoPersp; });
    // Camera reset button
    cameraControls[4].style('width','99px');
    cameraControls[4].style('height','48px');       
    cameraControls[4].position(500,601);
    cameraControls[4].mousePressed(() => { 
        cameraControls[0].value(PI/8);
        cameraControls[1].value(-PI/2.75);
        cameraControls[2].value(0.25);
    });
    // Controls label
    cameraControls[5].position(0,650);
    cameraControls[5].style('width','600px');
    cameraControls[5].style('background-color','lightgray');
}

function updateCamera() {
    // let elevation = 2*0.144;
    // let azimuth = -2*0.634;
    // let distance = 874;
    let elevation = cameraControls[0].value();
    let azimuth = cameraControls[1].value();
    let zoom = cameraControls[2].value();
    let distance = 1000 * (1-0.75*zoom)
    let orthoMultiplier = 2 + 4*zoom;

    let xPos = distance * cos(elevation) * cos(azimuth);
    let yPos = distance * cos(elevation) * sin(azimuth);
    let zPos = -distance * sin(elevation);
    camera(xPos, yPos, zPos, 0, 0, 0, 0, 0, 1);

    if (orthoPersp) {
        ortho(-width / orthoMultiplier, width / orthoMultiplier, -height / orthoMultiplier, height / orthoMultiplier,100,distance*2);
    } else {
        perspective();
    }

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

function drawAxesBoxes(xPos=0,yPos=0,zPos=0) {
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

function drawAxesLines(xPos=0,yPos=0,zPos=0) {
    push()
        translate(xPos,yPos,zPos);
        strokeWeight(5);
        strokeCap(SQUARE);
        push();
            // Origin: Black
            fill(0);
            sphere(1);
        pop();
        push();
            // Z-axis: Blue
            stroke(0,0,255);
            line(0,0,0,0,0,-40);
        pop();
        push();
            // Y-axis: Green
            stroke(0,255,0);
            line(0,0,0,0,40,0);    
        pop();    
        push();
            // X-axis: Red
            stroke(255,0,0);
            line(0,0,0,40,0,0);
        pop();
    pop();
}