function startTimer(duration, callback) {
    return setTimeout(callback, duration * 1000);
}

function stopTimer(timerId) {
    clearTimeout(timerId);
}

module.exports = { startTimer, stopTimer };
