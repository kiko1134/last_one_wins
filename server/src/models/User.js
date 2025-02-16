import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    username: { type: String, required: true, maxlength: 32 },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

UserSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('User', UserSchema);
