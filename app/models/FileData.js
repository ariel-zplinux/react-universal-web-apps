import mongoose from '../infra/db-manager';

const fileDataSchema = mongoose.Schema({
    _id: String,
    value: String
});
const FileData = mongoose.model("FileData", fileDataSchema);

export default FileData;