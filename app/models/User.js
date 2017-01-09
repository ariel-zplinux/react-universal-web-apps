import mongoose from '../infra/db-manager';

const userSchema = mongoose.Schema({
    name: String,
    ip: { type: String, default: "localhost" },
    date: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

export default User;