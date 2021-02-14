const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        const username = tags.username;
        if (!giveaway.acceptingEntries) {
            return client.say(
                channel,
                'Sorry, the giveaway is not currently running'
            );
        }
        if (tags.mod || (tags.badges && tags.badges.broadcaster)) {
            client.say(
                channel,
                `Sorry ${username}, mods and the streamer aren't allowed to enter`
            );
            return console.log("Mods can't enter");
        }
        giveaway.addEntry(channel, username);
        console.log('User was entered', username);
        client.say(channel, `Thanks for entering ${username}`);
    },
};
