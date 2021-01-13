const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema(
    {
        period: {type: String, required: [true, 'Period is required']},
        startdate: {type: Date, required: [true, 'Start date is required']},
        enddate: {type: Date},
        report: {type: String},
        child: {type: mongoose.Schema.Types.ObjectId, ref: "Child", required: [true, 'Child is required']},
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true]}
    },
    {timestamps: true}
);
reportSchema.index({report: 'text'});
module.exports = mongoose.model('Report', reportSchema);