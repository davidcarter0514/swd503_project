const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema(
    {
        title: {type: String, required: [true, 'Title is required'], minlength: [2, 'Title must be 2 chars long'] },
        date: {type: Date, required: [true, 'Date is required']},
        location: {type: String},
        expenses:[{type: mongoose.Schema.Types.ObjectId, ref: "Expense"}],
        child: {type: mongoose.Schema.Types.ObjectId, ref: "Child", required: [true, 'Child is required']},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Appointment', appointmentSchema);