require('dotenv').config();
const tmi = require('tmi.js');
const { generateTokens } = require('./tokenGenerator');
const NUM_WINNERS = 1;
const client = new tmi.Client({
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true,
    },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_PASSWORD,
    },
    channels: [process.env.TWITCH_USERNAME],
});
let entries = new Set();
let acceptingEntries = true;

client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self) return;

    const isAdmin = tags.username === process.env.TWITCH_USERNAME;

    if (acceptingEntries && message === '!enter' && !isAdmin) {
        addEntry(channel, tags.username);
    } else if (message === '!startGiveaway') {
        if (!isAdmin) {
            client.say(channel, `@${tags.username}, you can't do that!!`);
        } else {
            startAcceptingEntries();
        }
    } else if (message === '!stopGiveaway') {
        if (!isAdmin) {
            client.say(channel, `@${tags.username}, you can't do that!!`);
        } else {
            stopAcceptingEntries(channel);
        }
    }
    //TODO: create winner command to verify the token from a user
});

const startAcceptingEntries = () => {
    entries.clear();
    console.log('Give away is turned on');
    acceptingEntries = true;
};

const stopAcceptingEntries = (channel) => {
    acceptingEntries = false;
    console.log(entries);
    const entriesArray = [...entries];
    const tokens = generateTokens(NUM_WINNERS, entriesArray);
    console.log(tokens);
    entriesArray.forEach((entry, i) => {
        try {
            client.say(channel, `@${entry} - ${tokens[i]}`);
            // client.whisper(entry, tokens[i]);
        } catch (err) {
            console.error(err);
        }
    });
};

const addEntry = (channel, username) => {
    entries.add(username);
    console.log('User was entered', username);
    client.say(channel, `Thanks for entering ${username}`);
    // client.whisper(username, `Thanks for entering, @${username}!`);
};
