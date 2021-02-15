const { getGiveaway } = require('../Utils');
const giveaway = getGiveaway();

module.exports = {
    callback: (channel, tags, message, self, client) => {
        if (!tags.badges || !tags.badges.broadcaster) {
            return console.log('Only the streamer can run this command');
        }
        const { err, data } = giveaway.stop(channel);

        if (err) return;
        const { userToTokenMap } = data;
        console.log(userToTokenMap);
        for (let key in userToTokenMap) {
            client.say(channel, `${key}: ${userToTokenMap[key]}`);
        }
        client.say(
            channel,
            `The giveaway has ended. Thank you for your participation!! Please decode your JSON Web Token at jwt.io to find out if you are a winner. If you are a winner, respond back in chat by running the "!winner" command followed by your token`
        );
    },
};
