require('dotenv').config();
const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();
module.exports = {
    callback: (channel, tags, message, self, client) => {
        if (!tags.badges || !tags.badges.broadcaster) {
            client.say(channel, 'Only the streamer can run this command.');
            return console.log('Only the streamer can run this command');
        }
        giveaway.start();
        client.say(
            channel,
            'The giveaway has started. Please use the !enter command to enter.'
        );
        console.log('Giveaway is turned on');
    },
};
