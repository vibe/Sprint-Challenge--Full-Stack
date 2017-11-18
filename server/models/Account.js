const Mongoose = require('mongoose');

const AccountSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    budgetedAmount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

const model = Mongoose.model('Account', AccountSchema);


module.exports = model;