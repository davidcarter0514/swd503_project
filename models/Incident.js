const mongoose = require('mongoose');
const { Schema } = mongoose;

const incidentSchema = new Schema(
    {
        date: {type: Date, required: [true, 'Date is required']},
        title: {type: String, required: [true, 'Title is required']},
        description: {type: String},
        child: {type: String, required: [true, 'Child is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Incident', incidentSchema);