const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenseSchema = new Schema(
    {
        type: {type: String, required: [true, 'type is required']},
        mileage: {type: Number},
        amount: {type: Number, required: [true, 'Amount is required']},
        appointment: {type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: [true]},
        appointment_title: {type: String, required: [true]},
        appointment_date_string: {type: String},
        appointment_date: {type: Date, required: [true]},
        appointment_location: {type: String},
        child: {type: mongoose.Schema.Types.ObjectId, ref: "Child", required: [true]},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Expense', expenseSchema);