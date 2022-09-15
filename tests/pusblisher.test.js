const EventPublisher = require('../eventPublisher');
const {
    VALIDATED_INVOICE,
} = require('../constant');
const Event = require('../event');
const EventStore = require('../eventStore');

const eventPublisher = new EventPublisher();
const mockCallback = jest.fn(event => event);
eventPublisher.subscribe(VALIDATED_INVOICE, mockCallback);
eventPublisher.subscribe(VALIDATED_INVOICE, mockCallback);
test('When publisher subscribe an event', () => {
    expect(eventPublisher.dictionnary.has(VALIDATED_INVOICE)).toBe(true);
    expect(eventPublisher.dictionnary.get(VALIDATED_INVOICE)).toEqual([mockCallback, mockCallback]);
});

test('When publisher publish an event', () => {
    eventPublisher.publish([new Event(VALIDATED_INVOICE)], new EventStore());
    expect(mockCallback.mock.calls.length).toBe(2);
});