const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        const username = tags.username;
        const token = message.split(' ')[1];
        const { err, data } = giveaway.checkForWinner(username, token);
        client.say(channel, err || data.msg);
    },
};
