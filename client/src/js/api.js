export const API = {
  createGame: async (user) => {
    try {
      const res = await fetch("/game/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: [ user ] }),
      });
      return res.json();
    } catch (err) {
      console.error("Error creating game:", err);
      throw err;
    }
  },

  loadQuestion: async (round, topic, questionID) => {
    try {
      const res = await fetch(
        `/game/questions/round/${round}/topic/${topic}/questions/${questionID}`
      );
      return res.json();
    } catch (err) {
      console.error("Error loading question:", err);
      throw err;
    }
  },
};
