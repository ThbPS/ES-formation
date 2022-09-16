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
const EventStore = require('../eventStore');
const RetributionCommissionCommandHandler = require('../retributionCommissionCommandHandler');
const EventPubliser = require('../eventPublisher');
const sendInvoiceCommand = require('../sendInvoiceCommand');

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

test('Retribution commission handler publish and persist events data', () => {
    const invoice = {
        invoiceId: 123456,
        amount: 12,
    };
    const aggegrateId = 1;
    const version = 1;

    const store = new EventStore(aggegrateId, VALIDATED_INVOICE);
    const publisher = new EventPubliser();
    const retributionCommissionCommandHandler = new RetributionCommissionCommandHandler(publisher, store);
    const invoiceEvent = new Event(VALIDATED_INVOICE, invoice);

    // mock an invoice event
    store.save([invoiceEvent], 1);
    expect(store.get(aggegrateId)).toEqual({ events: [invoiceEvent], version: version });

    // mock publisher handler
    const mockPublisherHandler = jest.fn(event => event);
    publisher.subscribe(INVOICE_SENT, mockPublisherHandler);

    retributionCommissionCommandHandler.sendInvoice(new sendInvoiceCommand(aggegrateId, invoice.invoiceId, invoice.amount));
    expect(mockPublisherHandler.mock.calls.length).toBe(1);
});