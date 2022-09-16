module.exports = class sendInvoiceCommand {
    aggregateId;
    invoiceId;
    amount = 0;

    constructor(aggregateId, invoiceId, amount) {
        this.aggregateId = aggregateId;
        this.invoiceId = invoiceId;
        this.amount = amount;
    }
}