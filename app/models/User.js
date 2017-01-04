import mongoose from '../infra/db-manager';

const userSchema = mongoose.Schema({
    content: String,
    username: String,
    userId: String,
    date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

export default User;