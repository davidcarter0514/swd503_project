const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedSchema = new Schema(
    {
        datetime: {type: Date, required: [true, 'Date is required']},
        amount: {type: Number, required: [true, 'Amount is required']},
        child: {type: String, required: [true, 'Child is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Feed', feedSchema);