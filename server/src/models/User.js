import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import bcrypt from 'bcrypt';

const AutoIncrement = AutoIncrementFactory(mongoose);

const UserSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    username: { type: String, required: true, maxlength: 32 },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});

UserSchema.plugin(AutoIncrement, { inc_field: 'id' });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
