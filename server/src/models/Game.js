import mongoose from 'mongoose';
// import AutoIncrementFactory from 'mongoose-sequence';

// const AutoIncrement = AutoIncrementFactory(mongoose);

const GameSchema = new mongoose.Schema({
    gameID: { type: String, required: true },
    winnerID: { type: String, required: true }
});

// GameSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('Game', GameSchema);
