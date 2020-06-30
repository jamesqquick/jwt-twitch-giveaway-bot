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
    channels: ['jamesqquick'],
});
let entries = {};
let acceptingEntries = true;

client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self) return;
    const isAdminMessage = tags.username === process.env.TWITCH_USERNAME;
    if (message === '!startGiveaway' && isAdminMessage) {
        console.log('Starting');
        startAcceptingEntries();
    } else if (message === '!stopGiveaway' && isAdminMessage) {
        stopAcceptingEntries();
    } else if (message === '!enter') {
        addEntry(channel, tags.username);
    }
});

const startAcceptingEntries = () => {
    entries = {};
    console.log('Give away is turned on');
    acceptingEntries = true;
};

const stopAcceptingEntries = () => {
    generateTokens(NUM_WINNERS, Object.keys(entries));
    acceptingEntries = false;
};

const addEntry = (channel, username) => {
    entries[username] = true;
    client.say(channel, `Thanks for entering, @${username}!`);
};
