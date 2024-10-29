const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    room: {
        roomnumber: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
    },
    packageDetails: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
    },
    totalAmount: { type: Number, required: true },
    paymentDetails: {
        cardnum: { type: String, required: true },
        cvv: { type: String, required: true },
        expiryDate: { type: String, required: true },
        name: { type: String, required: true },
    }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
