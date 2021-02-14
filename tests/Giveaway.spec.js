const Giveaway = require('../Giveaway');

describe('Giveaway class', () => {
    let giveaway;
    const mockClient = {
        say: jest.fn().mockImplementation(() => {
            console.log('saying stuff!');
        }),
    };
    beforeEach(() => {
        giveaway = new Giveaway(1, mockClient);
    });

    test('should set acceptingEntries to false when creating a new instance of Giveaway', () => {
        expect(giveaway.acceptingEntries).toBe(false);
    });

    test('should set acceptingEntries to true when calling startAcceptingEntries', () => {
        giveaway.startAcceptingEntries();
        expect(giveaway.acceptingEntries).toBe(true);
    });
});
