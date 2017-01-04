import mongoose from '../infra/db-manager';

const messageSchema = mongoose.Schema({
    content: String,
    username: String,
    userId: String,
    date: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

export default Message;