export class Timer {
    constructor(timerElement, duration = 30, onTimeUp = null) {
        this.timerElement = timerElement;
        this.duration = duration;
        this.remainingTime = duration;
        this.interval = null;
        this.onTimeUp = onTimeUp;
    }

    start() {
        this.stop();
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
            this.start();
        }
    }

    reset(newDuration, newOnTimeUp) {
        this.stop();
        this.duration = newDuration;
        this.remainingTime = newDuration;
        if (newOnTimeUp) {
            this.onTimeUp = newOnTimeUp;
        }
        this.updateDisplay();
        this.start();
    }

    updateDisplay() {
        if (this.timerElement) {
            this.timerElement.textContent = this.remainingTime;
        }
    }
}
