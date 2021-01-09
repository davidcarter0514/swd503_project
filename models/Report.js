const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema(
    {
        period: {type: String, required: [true, 'Period is required']},
        startdate: {type: Date, required: [true, 'Start date is required']},
        enddate: {type: Date, required: [true, 'End date is required']},
        report: {type: String},
        child: {type: String, required: [true, 'Child is required']},
        owner: {type: String, required: [true]}
    },
    {timestamps: true}
);

module.exports = mongoose.model('Report', reportSchema);