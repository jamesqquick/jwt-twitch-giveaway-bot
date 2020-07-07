require('dotenv').config();
const tmi = require('tmi.js');
const { generateTokens, verifyToken } = require('./tokenGenerator');
const NUM_WINNERS = 2;
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
let acceptingEntries = false;

client.connect();
client.on('message', (channel, tags, message, self) => {
    if (self) return;

    const isAdmin = tags.username === process.env.TWITCH_USERNAME;
    //General Commands
    if (acceptingEntries && message === '!enter' && !isAdmin) {
        addEntry(channel, tags.username);
    } else if (!acceptingEntries && message.startsWith('!winner') && !isAdmin) {
        checkForWinner(tags.username, message);
    }
    //admin commands from here on
    else if (!isAdmin && message.startsWith('!')) {
        //client.say(channel, `@${tags.username}, you can't do that!!`);
        //ignore it
    } else if (message === '!startGiveaway') {
        startAcceptingEntries();
    } else if (message === '!stopGiveaway') {
        stopAcceptingEntries(channel);
    }
});

const startAcceptingEntries = () => {
    entries.clear();
    console.log('Give away is turned on');
    acceptingEntries = true;
};

const checkForWinner = (username, message) => {
    const token = message.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
        return client.say(
            process.env.TWITCH_USERNAME,
            `${username}, you can't fool me. That token isn't valid`
        );
    } else if (decoded.username !== username) {
        return client.say(
            process.env.TWITCH_USERNAME,
            `${username}, you must have stolen someone else's token`
        );
    } else if (!decoded.winner) {
        return client.say(
            process.env.TWITCH_USERNAME,
            `${username},that's not a winner`
        );
    } else {
        console.log(`${username} IS A WINNER!!!`);
        client.say(process.env.TWITCH_USERNAME, `${username} IS A WINNER!!`);
    }
};

const stopAcceptingEntries = (channel) => {
    acceptingEntries = false;
    console.log(entries);
    const entriesArray = [...entries];
    const tokens = generateTokens(NUM_WINNERS, entriesArray);
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
