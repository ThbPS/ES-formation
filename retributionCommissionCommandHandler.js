const RetributionCommission = require("./retributionCommission");
module.exports = class RetributionCommissionCommandHandler {
    #eventStore;
    #eventPublisher;

    constructor(eventPublisher, eventStore) {

        this.#eventPublisher = eventPublisher;
        this.#eventStore = eventStore;
    }

    sendInvoice(sendInvoiceCommand) {
        const store = this.#eventStore.get(sendInvoiceCommand.aggregateId);
        const events = RetributionCommission.sendInvoice(sendInvoiceCommand, store.events);
        this.#eventPublisher.publish(events, this.#eventStore, store.version);
    }
}