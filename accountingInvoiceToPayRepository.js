const Event = require('./event');

const {
    UNVALIDATED_INVOICE,
    VALIDATED_INVOICE,
    GENERATED_SEPA,
    INVOICE_SENT
} = require('./constant');

/**
 *  Projection de lecture AccountingInvoiceToPayProjection
    Quand une facture est Validée, la facture est ajouté a la liste (InvoiceId) + Amount total
    Quand le fichier SEPA  gen, la facture est retiré de la liste
 */

module.exports = class AccountingInvoiceToPayRepository {

    save(invoices) {
        // save in repo
        return 'oui';
    }

}