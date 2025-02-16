import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    answer: { type: String, required: true }
});


export default mongoose.model('Question', QuestionSchema);
