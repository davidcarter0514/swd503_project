const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema(
    {
        name: {type: String, required: [true, 'Name is required'], minlength: [2, 'Name must be 2 chars long'] },
        dob: {type: Date, required: [true, 'DOB is required']},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Child', childSchema);