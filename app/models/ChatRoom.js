import mongoose from '../infra/db-manager';

const chatRoomSchema = mongoose.Schema({
    name: String,
    date: { type: Date, default: Date.now }
});
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export default ChatRoom;