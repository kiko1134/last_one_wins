
export const prepareNextQuestion = (game) => {
    // Проверяваме дали има въпроси
    if (!game.questions || game.questions.length === 0) {
        return false;
    }

    // Ако има следващ въпрос в масива, преминаваме към него
    if (game.currentQuestion < game.questions.length - 1) {
        game.currentQuestion++;
    } else {
        // Няма следващ въпрос - играта приключва
        return false;
    }

    // Рестартираме състоянието на елиминация за всички играчи
    game.players.forEach(player => player.eliminated = false);

    return true;
}
