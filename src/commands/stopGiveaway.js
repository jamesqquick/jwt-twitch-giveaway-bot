const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        if (!tags.badges || !tags.badges.broadcaster) {
            return console.log('Only the streamer can run this command');
        }
        const userToTokenMap = giveaway.stopAcceptingEntries(channel);
        console.log(userToTokenMap);
        for (let key in userToTokenMap) {
            client.say(channel, `${key}: ${userToTokenMap[key]}`);
        }
    },
};
