const Event = require('./event');
const {
    UNVALIDATED_INVOICE,
    VALIDATED_INVOICE,
    GENERATED_SEPA,
    INVOICE_SENT
} = require('./constant');
const invoiceProjection = require('./invoicesProjection');

module.exports = class RetributionCommission {
    hasPendingInvoice;

    unvalidateInvoice() {
        return new Event(UNVALIDATED_INVOICE);
    }

    generateSepa() {
        return new Event(GENERATED_SEPA);
    }

    static apply(EventsList) {
        const decisionProjection = new invoiceProjection();
        EventsList.forEach(event => {
            decisionProjection.When(event);
        });
        return decisionProjection;
    }

    static sendInvoice(sendInvoiceCommand, EventsList) {
        const decisionProjection = this.apply(EventsList);
        if (decisionProjection.invoiceToValidate) {
            throw new Error('Invoice sent error');
        }

        return [
            new Event(INVOICE_SENT, {
                invoiceId: sendInvoiceCommand.invoiceId,
                amount: sendInvoiceCommand.amount,
            })
        ];
    }

    static validateInvoice(EventsList) {
        const projection = this.apply(EventsList);
        return new Event(VALIDATED_INVOICE, {
            invoiceId: 123456,
            amount: 12,
            create
        });
    }

    // créer méthod apply "statique", param list event, retourne objet qui contient la projection des propriétés pour la prise de décision
    // --> va contenir haspendinginvoice true / false 
    // dépile et construis un objet avec les infos pour la prise de décision

    // méthodes / command a passé en statique, param list event + param nécessaire à la command
    // les méthodes vont appeler apply avec en param les events reçus de l'ext --> va renvoyer un obj qui aide à la prise de décision
    // --> la méthode prend la décision, return event / la décision prise

}