export function showNotification(message, duration = 3000) {
    const notificationEl = document.getElementById('notification');
    notificationEl.textContent = message;
    notificationEl.style.paddingLeft = '1rem';
    notificationEl.style.paddingRight = '1rem';
    setTimeout(() => {
        notificationEl.textContent = '';
        notificationEl.style.paddingLeft = '0';
        notificationEl.style.paddingRight = '0';
    }, duration);
}

export function displayScoreboard(scores, winner) {
    const scoreboardContent = document.getElementById('scoreboard-content');
    let html = `<h3>Победител: ${winner}</h3><ul>`;
    scores.forEach(player => {
        html += `<li>${player.username}: ${player.score} точки</li>`;
    });
    html += '</ul>';
    scoreboardContent.innerHTML = html;
    const scoreboardModal = document.getElementById('scoreboard-modal');
    scoreboardModal.style.display = 'block';
}

export function closeScoreboardModal() {
    const scoreboardModal = document.getElementById('scoreboard-modal');
    scoreboardModal.style.display = 'none';
}
