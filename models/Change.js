const mongoose = require('mongoose');
const { Schema } = mongoose;

const changeSchema = new Schema(
    {
        datetime: {type: Date, required: [true, 'Date is required']},
        type: {type: String, required: [true, 'Type is required']},
        notes: {type: String},
        child: {type: mongoose.Schema.Types.ObjectId, ref: "Child", required: [true, 'Child is required']},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Change', changeSchema);