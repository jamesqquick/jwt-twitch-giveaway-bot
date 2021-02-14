const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        const username = tags.username;
        const msg = giveaway.checkForWinner(username, message);
        client.say(channel, msg);
    },
};
