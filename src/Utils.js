require('dotenv').config();
const Giveaway = require('./Giveaway');

let giveaway;

const getGiveaway = () => {
    if (!giveaway) {
        giveaway = new Giveaway(process.env.NUM_WINNERS);
    }
    return giveaway;
};

module.exports = {
    getGiveaway,
};
