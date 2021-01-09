const mongoose = require('mongoose');
const { Schema } = mongoose;

const changeSchema = new Schema(
    {
        datetime: {type: Date, required: [true, 'Date is required']},
        type: {type: String, required: [true, 'Type is required']},
        notes: {type: String},
        child: {type: String, required: [true, 'Child is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Change', changeSchema);