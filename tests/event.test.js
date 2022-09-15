const RetributionCommission = require('../retributionCommission');
const {
    UNVALIDATED_INVOICE,
    VALIDATED_INVOICE,
    GENERATED_SEPA,
    INVOICE_SENT
} = require('../constant');
const Event = require('../event');


const InvoicesProjection = require('../invoicesProjection');
const AccountingInvoiceToPayProjection = require('../accountingInvoiceToPayProjection');

test('When WhenInvoiceReceived', () => {
    const invoicesProjection = new InvoicesProjection();
    invoicesProjection.When(new Event(INVOICE_SENT, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    waitingInvoices = invoicesProjection.getWaitingInvoices();

    expect(waitingInvoices.length).toBe(1);
    expect(waitingInvoices[0].invoiceId).toBe(123456);
    expect(waitingInvoices[0].amount).toBe(12);
    expect(waitingInvoices[0].createdAt).toBe('2022-09-13');
});

test('When WhenInvoiceValidated', () => {
    const invoicesProjection = new InvoicesProjection();
    invoicesProjection.When(new Event(INVOICE_SENT, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    invoicesProjection.When(new Event(VALIDATED_INVOICE, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    waitingInvoices = invoicesProjection.getWaitingInvoices();

    expect(waitingInvoices.length).toBe(0);
});

test('When WhenInvoiceUnvalidated', () => {
    const invoicesProjection = new InvoicesProjection();
    invoicesProjection.When(new Event(INVOICE_SENT, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    invoicesProjection.When(new Event(UNVALIDATED_INVOICE, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    waitingInvoices = invoicesProjection.getWaitingInvoices();

    expect(waitingInvoices.length).toBe(0);
});

test('When WhenInvoiceUnvalidated', () => {
    const invoicesProjection = new InvoicesProjection();
    invoicesProjection.When(new Event(INVOICE_SENT, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    invoicesProjection.When(new Event(UNVALIDATED_INVOICE, {
        invoiceId: 123456,
        amount: 12,
        createdAt: '2022-09-13'
    }));
    waitingInvoices = invoicesProjection.getWaitingInvoices();

    expect(waitingInvoices.length).toBe(0);
});


test('When invoice to pay is validated', () => {
    const accountingInvoiceToPayProjection = new AccountingInvoiceToPayProjection();
    const invoice = {
        invoiceId: 123456,
        amount: 12,
    };
    accountingInvoiceToPayProjection.When(new Event(VALIDATED_INVOICE, invoice));
    const waitingInvoices = accountingInvoiceToPayProjection.waitingInvoices;
    expect(waitingInvoices).toEqual([invoice]);
});

test('When sepa is generated', () => {
    const invoice = {
        invoiceId: 123456,
        amount: 12,
    };
    const accountingInvoiceToPayProjection = new AccountingInvoiceToPayProjection();
    accountingInvoiceToPayProjection.When(new Event(VALIDATED_INVOICE, invoice));
    accountingInvoiceToPayProjection.When(new Event(GENERATED_SEPA, invoice));
    const waitingInvoices = accountingInvoiceToPayProjection.waitingInvoices;
    expect(waitingInvoices.length).toBe(0);
});

/**
 *  Projection de lecture AccountingInvoiceToPayProjection
    Quand une facture est Validée, la facture est ajouté a la liste (InvoiceId) + Amount total
    Quand le fichier SEPA  gen, la facture est retiré de la liste
 */

// describe('Given an invoice is sent', () => {
//     const retributionCommission = new RetributionCommission();
//     describe('When the invoice is sent', () => {
//         test('Then seller sent event', () => {
//             const sendInvoice = retributionCommission.send();
//             expect(sendInvoice.name).toBe(INVOICE_SENT);
//         });
//         test('If an invoice is sent we cannot send another', () => {
//             try {
//                 retributionCommission.send();
//             } catch (error) {
//                 expect(error.message).toBe('Invoice sent error');
//             }
//         });
//     });
// });

// describe('Given an invoice is sent to accounting', () => {
//     const retributionCommission = new RetributionCommission();
//     describe('When the invoice is validated', () => {
//         test('Then the invoice is validated', () => {
//             const validateInvoice = retributionCommission.validate();
//             expect(validateInvoice.name).toBe(VALIDATED_INVOICE);
//         });
//         test('Then the invoice is unvalidated', () => {
//             const unvalidateInvoice = retributionCommission.unvalidateInvoice();
//             expect(unvalidateInvoice.name).toBe(UNVALIDATED_INVOICE);
//         });
//         test('Then a SEPA file is generated', () => {
//             expect(retributionCommission.generateSepa().name).toBe(GENERATED_SEPA);
//         });
//     });
// });