class Rotator {
    constructor() {
        this._drawobject = null;
        this._drawAxes = null;
    }

    /* Set the draw function for the object to be rotated
    *  Input: drawfunc - the function that draws the object to be rotated
    */
    setDrawObject(drawfunc) {
        this._drawobject = drawfunc;
    }
    
    /* Set the draw function for the local frame axes
    *  Input: drawfunc - the function that draws the local frame axes
    */
    setDrawAxis(drawfunc) {
        this._drawAxes = drawfunc;
    }

    /*
    * Draw the current rotation axis
    * Input: rotState - the current rotation axis
    * Options: "X", "Y", "Z"
    *         0 - no rotation axis
    */
    drawRotationAxis(rotState) {
        push();
        strokeWeight(3);
        if (rotState == "X") {
          push();  
            stroke(255,0,0);
            line(500,0,0,-500,0,0);
          pop();
        } else if (rotState == "Y") {
          push();
            stroke(0,255,0);
            line(0,-500,0,0,500,0);
          pop();
        } else if (rotState == "Z") {
          push();
            stroke(0,0,255);
            line(0,0,-500,0,0,500);
          pop();
        }
        pop();
      }

    /* Draw the object rotated by the given angles
    *  Input: angles [roll, pitch, yaw] - Rotation Angles in radians
    *         animatorState [i,j,k,rotAxis] - State of the animator
    *         rotationType [convention, rotAxis] - Rotation convention ("RPY" or "Euler"), Current Rotation Axis ("X", "Y", "Z)
    *         drawLocalFrame - Draw the local frame axes (default: true)
    */
    drawRotated(angles, animatorState = [1,1,1,0], rotationType = ["RPY",""] ,drawLocalFrame = true) {
        if (rotationType[1] != 0) {
          animatorState[3] = rotationType[1];
        }
        if (rotationType[0] == "RPY") {
            this.drawRPY(angles,animatorState,drawLocalFrame);
        } else if (rotationType[0] == "Euler") {
            this.drawEul(angles,animatorState,drawLocalFrame);
        }
    }

    /* Draw the object rotated by the given angles using the RPY convention
    *  Input: angles [roll, pitch, yaw] - Rotation Angles in radians
    *         animatorState [i,j,k,rotAxis] - State of the animator
    *         drawLocalFrame - Draw the local frame axes (default: true)
    */
    drawRPY(angles, animatorState = [1,1,1,0], drawLocalFrame = true) {
        let rotationOrder = ["X", "Y", "Z"];
        let roll  = -angles[0]*animatorState[0];
        let pitch = -angles[1]*animatorState[1];
        let yaw   = angles[2]*animatorState[2];
        let rotAxis = 0;
        if (animatorState[3] != 0) { rotAxis = rotationOrder[animatorState[3] - 1]; }
        push()
            rotateZ(yaw);
            rotateY(pitch);
            rotateX(roll);
            this._drawobject();
            if (drawLocalFrame) { this._drawAxes(); }
        pop()
        this.drawRotationAxis(rotAxis); // Outside of push/pop to draw in world coordinates
    }

    /* Draw the object rotated by the given angles using the Euler convention
    *  Input: angles [roll, pitch, yaw] - Rotation Angles in radians
    *         animatorState [i,j,k,rotAxis] - State of the animator
    *         drawLocalFrame - Draw the local frame axes (default: true)
    * Note: Taken directly from ROS TF2 library (see https://docs.ros.org/en/jade/api/tf2/html/classtf2_1_1Quaternion.html#a668c459d4d837dda4169fc7320afe628)
    */
    drawEul(angles, animatorState = [1,1,1,0], drawLocalFrame = true) {
        
        let rotationOrder = ["Z", "X", "Y"];
        let roll  = -angles[0]*animatorState[0];
        let pitch = -angles[1]*animatorState[1];
        let yaw   = angles[2]*animatorState[2];
        let rotAxis = 0;
        if (animatorState[3] != 0) { rotAxis = rotationOrder[animatorState[3] - 1]; }

        // Calculate quaternion from Euler angles
        let cosPitch = cos(pitch / 2);
        let sinPitch = sin(pitch / 2);
        let cosYaw = cos(yaw / 2);
        let sinYaw = sin(yaw / 2);
        let cosRoll = cos(roll / 2);
        let sinRoll = sin(roll / 2);
        
        let x = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw
        let y = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw
        let w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw
        let z = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw
        
        let norm = x * x + y * y + z * z;
      
        // Normalize quaternion (and handle division by zero)
        if (norm < 1e-9) {
          x = 1;
          y = 0;
          z = 0;
        } else {
          norm = sqrt(norm);
          x /= norm;
          y /= norm;
          z /= norm;
        }
      
        // Convert quaternion to axis-angle
        let angle = 2*acos(w);
        let axis = createVector(x,y,-z) // invert z-axis to match p5.js coordinate system (p5 is left-handed, ROS is right-handed)

        push();
            rotate(angle,axis)
            this._drawobject();
            if (drawLocalFrame) { 
              this._drawAxes();
            }
            this.drawRotationAxis(rotAxis); // Inside of push/pop to draw in local coordinates
        pop();
    }
}