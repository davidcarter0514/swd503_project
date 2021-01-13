const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedSchema = new Schema(
    {
        datetime: {type: Date, required: [true, 'Date is required']},
        amount: {type: Number, required: [true, 'Amount is required']},
        child: {type: mongoose.Schema.Types.ObjectId, ref: "Child", required: [true, 'Child is required']},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Feed', feedSchema);