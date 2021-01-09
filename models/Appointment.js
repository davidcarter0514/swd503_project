const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
    {
        title: {type: String, required: [true, 'Title is required'], minlength: [2, 'Title must be 2 chars long'] },
        datetime: {type: Date, required: [true, 'Date is required']},
        location: {type: String},
        child: {type: String, required: [true, 'Child is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Appointment', appointmentSchema);