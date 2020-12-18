const mongoose = require('mongoose');
const { Schema } = mongoose;

const childSchema = new Schema(
    {
        name: {type: String, required: [true, 'Name is required'], minlength: [2, 'Name must be 2 chars long'] },
        knownas: {type: String},
        alias: {type: String},
        dob: {type: Date, required: [true, 'DOB is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Child', childSchema);