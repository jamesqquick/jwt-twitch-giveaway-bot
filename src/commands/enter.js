const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        const username = tags.username;

        // if (tags.mod || (tags.badges && tags.badges.broadcaster)) {
        //     client.say(
        //         channel,
        //         `Sorry ${username}, mods and the streamer aren't allowed to enter`
        //     );
        //     return console.log("Mods can't enter");
        // }
        const { err, data } = giveaway.enter(username);
        client.say(channel, err || data.msg);
    },
};
