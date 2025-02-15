import { questionsDB } from "../server/src/models/data.js";

export const prepareNextQuestion = (game) => {
    const currentRoundKey = `round${game.currentRound}`;
    // If there is next question for the current topic
    if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic] &&
        questionsDB[currentRoundKey].topics[game.currentTopic].questions[game.currentQuestion + 1]
    ) {
        game.currentQuestion++;
    }
    // If there are not, check for next topic in the current round
    else if (
        questionsDB[currentRoundKey] &&
        questionsDB[currentRoundKey].topics[game.currentTopic + 1]
    ) {
        game.currentTopic++;
        game.currentQuestion = 1;
    }
    // If there are not next questions in the current round - check for the next round
    else if (questionsDB[`round${game.currentRound + 1}`]) {
        game.currentRound++;
        game.currentTopic = 1;
        game.currentQuestion = 1;
    } else {
        // No questions - end game
        return false;
    }
    // Restart elimination state for every player
    game.players.forEach(player => player.eliminated = false);
    return true;
}
