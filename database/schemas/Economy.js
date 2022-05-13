const mongoose = require("mongoose");

const EconomySchema = mongoose.Schema({ 
    userId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    money: {
        wallet: {
            type: mongoose.SchemaTypes.Number,
            default: 10000,
        },
        bank: {
            type: mongoose.SchemaTypes.Number,
            default: 0,
        },
        maxBank: {
            type: mongoose.SchemaTypes.Number,
            default: 100000,
        },
    },
    items: {
        type: mongoose.SchemaTypes.Array,
        default: [],
    },
});

module.exports = mongoose.model("Economy", EconomySchema);
