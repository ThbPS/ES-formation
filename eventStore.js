module.exports = class EventStore {
    #aggegrateId;
    #aggregateName;
    data = new Map();

    constructor(aggegrateId, aggregateName) {
        this.#aggegrateId = aggegrateId;
        this.#aggregateName = aggregateName;
    }

    save(events, version) {
        this.data.set(this.#aggegrateId, { events: events, version: version });
    }

    get(aggegrateId) {
        return this.data.get(aggegrateId);
    }
};