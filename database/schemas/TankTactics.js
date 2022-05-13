const mongoose = require("mongoose");

const TankTacticsSchema = mongoose.Schema({
    gameId: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    users: {
        type: mongoose.SchemaTypes.Array,
        default: [],
    },
    messageId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channelId: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    open: {
        type: mongoose.SchemaTypes.Boolean,
        default: true,
    },
    public : {
        type: mongoose.SchemaTypes.Boolean,
        default: true,
    },
    // Game Settings

});

module.exports = mongoose.model("TankTactics", TankTacticsSchema);