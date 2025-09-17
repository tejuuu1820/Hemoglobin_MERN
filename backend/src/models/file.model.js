const { default: mongoose } = require("mongoose");

const customSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    meta_data: {
        type: Object,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    }
})

const File = mongoose.model('File', customSchema)

module.exports = File