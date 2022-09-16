module.exports = class EventPublisher {
    dictionnary = new Map();

    publish(events, eventStore, version) {
        eventStore.save(events, version);
        events.forEach(event => {
            const { name } = event;
            const callbacks = this.dictionnary.get(name);
            if (callbacks)
                callbacks.forEach(callback => callback(event));
        });
    }

    subscribe(eventType, callback) {
        const callbacks = this.dictionnary.get(eventType);
        if (!callbacks) {
            this.dictionnary.set(eventType, [callback]);
        } else {
            callbacks.push(callback);
            this.dictionnary.set(eventType, callbacks);
        }
    }
}