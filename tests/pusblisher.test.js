const EventPublisher = require('../eventPublisher');
const {
    VALIDATED_INVOICE,
} = require('../constant');
const Event = require('../event');
const EventStore = require('../eventStore');

const eventPublisher = new EventPublisher();

/*test('When event are persisted', () => {
    const mockSave = jest.fn();
    jest.mock('../eventStore', () => {
        return jest.fn().mockImplementation(() => {
          return { save: mockSave };
        });
    });
    eventPublisher.publish([new Event(VALIDATED_INVOICE)], new EventStore());
    expect(mockSave).toHaveBeenCalled();
});*/

test('When events are published then events in memory', () => {
    const mockCallback = jest.fn(event => event);
    eventPublisher.subscribe(VALIDATED_INVOICE, mockCallback);
    eventPublisher.subscribe(VALIDATED_INVOICE, mockCallback);
    expect(eventPublisher.dictionnary.has(VALIDATED_INVOICE)).toBe(true);
    expect(eventPublisher.dictionnary.get(VALIDATED_INVOICE)).toEqual([mockCallback, mockCallback]);
});

test('When events are published then call event handler', () => {
    const mockPublisherHandler = jest.fn(event => event);
    eventPublisher.subscribe(VALIDATED_INVOICE, mockPublisherHandler);
    eventPublisher.publish([new Event(VALIDATED_INVOICE)], new EventStore());
    expect(mockPublisherHandler.mock.calls.length).toBe(1);
});