const Event = require('./event');

const {
    UNVALIDATED_INVOICE,
    VALIDATED_INVOICE,
    GENERATED_SEPA,
    INVOICE_SENT
} = require('./constant');

const AccountingInvoiceToPayRepository = require('./accountingInvoiceToPayRepository');

module.exports = class AccountingInvoiceToPayProjection {
    waitingInvoices = [];
    accountingInvoiceToPayRepository = new AccountingInvoiceToPayRepository();

    When(event) {
        switch (event.name) {
            case VALIDATED_INVOICE:
                this.waitingInvoices.push({
                    invoiceId: event.invoice.invoiceId,
                    amount: event.invoice.amount
                });
                this.accountingInvoiceToPayRepository.save(this.waitingInvoices);
                break;
            case GENERATED_SEPA:
                this.waitingInvoices = this.waitingInvoices.filter((el) => el.invoiceId !== event.invoice.invoiceId);
                this.accountingInvoiceToPayRepository.save(this.waitingInvoices);
                break;
            default:
                throw new Error('Not handled');
        }
    }

}