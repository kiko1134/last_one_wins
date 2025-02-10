export class Timer {
    constructor(timerElement, duration = 30, onTimeUp = null) {
        this.timerElement = timerElement;
        this.duration = duration;
        this.remainingTime = duration;
        this.interval = null;
        this.onTimeUp = onTimeUp;
    }

    start() {
        this.remainingTime = this.duration;
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();
            if (this.remainingTime <= 0) {
                this.stop();
                if (this.onTimeUp) this.onTimeUp();
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    resume() {
        if (!this.interval && this.remainingTime > 0) {
            this.interval = setInterval(() => {
                this.remainingTime--;
                this.updateDisplay();
                if (this.remainingTime <= 0) {
                    this.stop();
                    if (this.onTimeUp) this.onTimeUp();
                }
            }, 1000);
        }
    }

    updateDisplay() {
        this.timerElement.textContent = this.remainingTime;
    }
}
