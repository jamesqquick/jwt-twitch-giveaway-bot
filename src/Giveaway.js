const { generateTokens, verifyToken } = require('./TokenGenerator');
const { TokenExpiredError } = require('jsonwebtoken');

module.exports = class Giveaway {
    constructor(numWinners) {
        this.numWinners = numWinners;
        this.entries = new Set();
        this.acceptingEntries = false;
    }

    startAcceptingEntries(client) {
        this.entries.clear();
        this.acceptingEntries = true;
    }

    checkForWinner(username, message) {
        if (this.acceptingEntries) return;
        const token = message.split(' ')[1];
        const { error, decoded } = verifyToken(token);
        let returnMsg;
        if (error) {
            if (error instanceof TokenExpiredError) {
                returnMsg = `${username}, you can't fool me. THAT TOKEN IS EXPIRED!!`;
            } else {
                returnMsg = `${username}, you can't fool me. THAT TOKEN ISN'T VALID`;
            }
        } else if (decoded.data.username !== username) {
            returnMsg = `${username}, you must have stolen someone else's token`;
        } else if (!decoded.data.winner) {
            returnMsg = `${username},that's not a winner`;
        } else {
            returnMsg = `${username} IS A WINNER!!`;
        }
        return returnMsg;
    }

    addEntry(channel, username) {
        if (!this.acceptingEntries) return;
        this.entries.add(username);
    }

    stopAcceptingEntries(channel) {
        this.acceptingEntries = false;
        const entriesArray = [...this.entries];
        const tokens = generateTokens(process.env.NUM_WINNERS, entriesArray);
        const userToTokenMap = {};
        entriesArray.forEach((entry, i) => {
            userToTokenMap[entry] = tokens[i];
        });
        return userToTokenMap;
    }
};
