require('dotenv').config();
const Giveaway = require('jwt-giveaway');

let giveaway;

const getGiveaway = () => {
    if (!giveaway) {
        giveaway = new Giveaway(
            process.env.NUM_WINNERS,
            process.env.SIGNING_KEY
        );
    }
    return giveaway;
};

module.exports = {
    getGiveaway,
};
