const Event = require('./event');

const {
    UNVALIDATED_INVOICE,
    VALIDATED_INVOICE,
    GENERATED_SEPA,
    INVOICE_SENT
} = require('./constant');

module.exports = class InvoicesProjection {
    waitingInvoices = [];

    getWaitingInvoices() {
        return this.waitingInvoices;
    }

    When(event) {
        switch (event.name) {
            case INVOICE_SENT:
                this.WhenInvoiceReceived(event.invoice);
                break;
            case VALIDATED_INVOICE:
                this.WhenInvoiceValidated(event.invoice);
                break;
            case UNVALIDATED_INVOICE:
                this.WhenInvoiceUnvalidated(event.invoice);
                break;
            default: 
                throw console.error('Not handled');
        }
    }

    WhenInvoiceReceived(invoice) {
        this.waitingInvoices.push(invoice);
    }

    WhenInvoiceValidated(invoice) {
        this.removeFromList(invoice);
    }

    WhenInvoiceUnvalidated(invoice) {
        this.removeFromList(invoice);
    }

    removeFromList(invoice) {
        this.waitingInvoices = this.waitingInvoices.filter((el) => el.invoiceId !== invoice.invoiceId);
    }

}