const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

const generateTokens = (numberOfWinners, entries) => {
    const winningNumbers = getWinningNumbers(numberOfWinners, entries);
    const tokens = [];
    for (let i = 0; i < entries.length; i++) {
        const data = {
            winner: winningNumbers.includes(i) ? true : false,
            username: entries[i],
        };
        var token = jwt.sign(data, process.env.SIGNING_KEY);
        tokens.push(token);
    }

    fs.writeFile('tokens.txt', tokens.join('\n'), (err) => {
        if (err) {
            console.error(err);
        }
    });
    return tokens;
};

const getWinningNumbers = (numberOfWinners, entries) => {
    const winningNumbers = [];
    for (let i = 0; i < numberOfWinners; i++) {
        let randomNum;
        do {
            randomNum = Math.floor(Math.random() * entries.length);
        } while (randomNum === undefined || winningNumbers.includes(randomNum));

        winningNumbers.push(randomNum);
    }
    return winningNumbers;
};

module.exports = { generateTokens };
//select random winners

//TODO: verify token
//TODO: user to submit winning token
