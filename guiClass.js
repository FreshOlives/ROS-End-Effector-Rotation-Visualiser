/* Description: Custom GUI class for Rotation Visualization
* 
* This class is used to create a custom GUI for the rotation visualization.
* The GUI manages all display text and stores user inputs.
*/

class CustomGUI {
    constructor() {
        // Buttons
        this._animateButton = createButton('Animate');
        this._wireframeButton = createButton('Toggle Wireframe');
        this._EulButton = createButton('Euler');
        this._RPYButton = createButton('RPY');
        this._resetButton = createButton('Reset');
        // Inputs
        this._rollInput = createInput("0","number");
        this._pitchInput = createInput("0","number")
        this._yawInput = createInput("0","number")
        this._rollSlider = createSlider(-180, 180, 0, 1);
        this._pitchSlider = createSlider(-180, 180, 0, 1);
        this._yawSlider = createSlider(-180, 180, 0, 1);
        // For Syncing Sliders and Inputs
        this.prevRoll = 0;
        this.prevPitch = 0;
        this.prevYaw = 0;
        // Labels
        this._rollLabel = createDiv("Roll")
        this._pitchLabel = createDiv("Pitch")
        this._yawLabel = createDiv("Yaw")
        // Currently Selected Rotation Type
        this.rotationType = "RPY";
        this._rotationTypeLabel = createDiv("Current Rotation Type: " + this.rotationType)
        // Toggle wireframe view
        this.wireframe = false;
        // Animation Requesed?
        this.animationRequested = false;

    }

    /*
    * Initialize the GUI
    */
    init() {
        this._animateButton.position(610, 10);
        this._animateButton.size(100,50);
        
        this._EulButton.position(720, 70);
        this._EulButton.size(100,50);
        
        this._RPYButton.position(610, 70);
        this._RPYButton.size(100,50);
        
        this._wireframeButton.position(610, 130);
        this._wireframeButton.size(100,50);
        
        this._resetButton.position(720, 10);
        this._resetButton.size(100,50);
        
        this._rollLabel.position(665,205)
        this._rollInput.position(610,200)
        this._rollSlider.position(700,204)
        this._rollInput.size(40,20)
        
        this._pitchLabel.position(665,235)
        this._pitchInput.position(610,230)
        this._pitchSlider.position(700,234)
        this._pitchInput.size(40,20)
        
        this._yawLabel.position(665,265)
        this._yawInput.position(610,260)
        this._yawSlider.position(700,264)
        this._yawInput.size(40,20)
        
        this._rotationTypeLabel.position(10, 10)

        // Button Callbacks
        // Inline functions used to avoid scope issues (cant use 'this' in callback functions)
        this._EulButton.mousePressed(() => this.rotationType = "Euler");
        this._RPYButton.mousePressed(() => this.rotationType = "RPY");
        this._animateButton.mousePressed(() => this.animationRequested = true);
        this._wireframeButton.mousePressed(() => this.wireframe = !this.wireframe);
        this._resetButton.mousePressed(() => this.resetAngles(this._rollInput,this._pitchInput,this._yawInput));
    }

    /* 
    * Update the GUI.
    * Synchronize input methods and display the current rotation type.
    */
    update() {
        // Sync Sliders and Inputs
        if (this.prevRoll != this._rollInput.value()) {
            this._rollSlider.value(this._rollInput.value());
        } else if (this.prevRoll != this._rollSlider.value()) {
            this._rollInput.value(this._rollSlider.value());
        }
        if (this.prevPitch != this._pitchInput.value()) {
            this._pitchSlider.value(this._pitchInput.value());
        } else if (this.prevPitch != this._pitchSlider.value()) {
            this._pitchInput.value(this._pitchSlider.value());
        }
        if (this.prevYaw != this._yawInput.value()) {
            this._yawSlider.value(this._yawInput.value());
        } else if (this.prevYaw != this._yawSlider.value()) {
            this._yawInput.value(this._yawSlider.value());
        }
        this.prevRoll = this._rollInput.value();
        this.prevPitch = this._pitchInput.value();
        this.prevYaw = this._yawInput.value();

        // Display Rotation Type Selection
        if (this.rotationType == "Euler") {
            this._EulButton.style('background-color', 'rgb(0,255,0)');
            this._RPYButton.style('background-color', 'rgb(255,255,255)');
            this._rotationTypeLabel.html("<b>Rotation Mode: Euler Convention</b> <p><b style='color:blue;'>Roll (Local Z)</b> &#8594 <b style='color:red'> Pitch (Local X)</b> &#8594 <b style='color:green'>Yaw (Local Y)</b></p>");
        } else if (this.rotationType == "RPY") {
            this._RPYButton.style('background-color', 'rgb(0,255,0)');
            this._EulButton.style('background-color', 'rgb(255,255,255)');
            this._rotationTypeLabel.html('<b>Rotation Mode: RPY Convention</b> <p><b style="color:red;">Roll (Global X)</b> &#8594 <b style="color:green"> Pitch (Global Y)</b> &#8594 <b style="color:blue">Yaw (Global Z)</b></p>');
        }
    }

    /*
    * Reset the angles to 0
    * Input: rollInput, pitchInput, yawInput (p5.js input objects)
    */
    resetAngles(rollInput, pitchInput, yawInput) {
        rollInput.value(0);
        pitchInput.value(0);
        yawInput.value(0);
    }

    /*
    * Get the current rotation type
    * Returns: "Euler" or "RPY"
    */
    getRotation() {
        return this.rotationType;
    }

    /*
    * Get the angles from the GUI inputs
    * Returns: [roll, pitch, yaw]
    */
    getAngles() {
        return [this._rollInput.value()*PI/180, this._pitchInput.value()*PI/180, this._yawInput.value()*PI/180];
    }

    /*
    * Check if an animation has been requested
    * If an animation has been requested, reset the flag
    * Returns: true if an animation has been requested, false otherwise
    */
    checkAnimationRequest() {
        if (this.animationRequested) {
            this.animationRequested = false;
            return true;
        }
        return false;
    }

    /*
    * Show the GUI buttons
    */
    showButtons() {
        this._EulButton.show()
        this._RPYButton.show()
        this._resetButton.show()
        this._animateButton.show()
    }

    /*
    * Hide the GUI buttons
    * Used when an animation is in progress
    */
    hideButtons() {
        this._EulButton.hide()
        this._RPYButton.hide()
        this._resetButton.hide()
        this._animateButton.hide()
    }
}