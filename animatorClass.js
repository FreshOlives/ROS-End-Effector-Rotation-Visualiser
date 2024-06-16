class Animator {
    constructor(waitDelay, nFrames) {
        this.nFrames = nFrames;
        this.i = nFrames;
        this.j = nFrames;
        this.k = nFrames;
        this.isWaiting = false;
        this.waitDelay = waitDelay;
        this.rotState = 0;
        this.isActive = false;
    }

    update() {
        if (!this.isActive) {
          return;
        }
        
        if (this.isWaiting) {
          if (millis() - this.waitStart < this.waitDelay) {
            return;
          }
          this.isWaiting = false;
        }
        
        if (this.i == this.nFrames - 1) {
          this.isWaiting = true;
          this.waitStart = millis();
          this.i += 1;
          return;
        }
        if (this.j == this.nFrames - 1) {
          this.isWaiting = true;
          this.waitStart = millis();
          this.j += 1;
          return;
        }
        if (this.k == this.nFrames - 1) {
          this.isActive = false;
          this.rotState = 0;
          this.k += 1;
          return;
        }
        
        if (this.i < this.nFrames - 1) {   
          this.rotState = 1;
          this.i += 1;
        } else if (this.j < this.nFrames - 1){
          this.rotState = 2;
          this.j += 1;
        } else if (this.k < this.nFrames - 1){
          this.rotState = 3;
          this.k += 1;
        }
    }

    start() { 
        this.i = 0;
        this.j = 0;
        this.k = 0;
        this.isActive = true;
        this.isWaiting = true;
        this.waitStart = millis();
    }

    isAnimating() { return this.isActive; }

    getState() { return [this.i/this.nFrames, this.j/this.nFrames, this.k/this.nFrames, this.rotState]; }
}