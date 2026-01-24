import credits.aleo;
program zk_pay_proofs_privacy_v6.aleo;

struct InvoiceData:
    expiry_height as u32;
    status as u8;

mapping invoices:
    key as field.public;
    value as InvoiceData.public;

mapping salt_to_invoice:
    key as field.public;
    value as field.public;

function create_invoice:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as field.private;
    input r3 as u32.public;
    cast r0 into r4 as field;
    cast r1 into r5 as field;
    hash.bhp256 r4 into r6 as field;
    hash.bhp256 r5 into r7 as field;
    hash.bhp256 r2 into r8 as field;
    add r6 r7 into r9;
    add r9 r8 into r10;
    async create_invoice r10 r3 r2 into r11;
    output r10 as field.public;
    output r11 as zk_pay_proofs_privacy_v6.aleo/create_invoice.future;

finalize create_invoice:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as field.public;
    mul r1 360u32 into r3;
    is.neq r1 0u32 into r4;
    add block.height r3 into r5;
    ternary r4 r5 0u32 into r6;
    cast r6 0u8 into r7 as InvoiceData;
    set r7 into invoices[r0];
    set r0 into salt_to_invoice[r2];

function pay_invoice:
    input r0 as credits.aleo/credits.record;
    input r1 as address.private;
    input r2 as u64.private;
    input r3 as field.private;
    call credits.aleo/transfer_private r0 r1 r2 into r4 r5;
    cast r1 into r6 as field;
    cast r2 into r7 as field;
    hash.bhp256 r6 into r8 as field;
    hash.bhp256 r7 into r9 as field;
    hash.bhp256 r3 into r10 as field;
    add r8 r9 into r11;
    add r11 r10 into r12;
    async pay_invoice r12 r3 into r13;
    output r4 as credits.aleo/credits.record;
    output r5 as credits.aleo/credits.record;
    output r13 as zk_pay_proofs_privacy_v6.aleo/pay_invoice.future;

finalize pay_invoice:
    input r0 as field.public;
    input r1 as field.public;
    get salt_to_invoice[r1] into r2;
    assert.eq r0 r2;
    get invoices[r2] into r3;
    is.neq r3.expiry_height 0u32 into r4;
    branch.eq r4 false to end_then_0_0;
    lte block.height r3.expiry_height into r5;
    assert.eq r5 true;
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    position end_otherwise_0_1;
    assert.eq r3.status 0u8;
    cast r3.expiry_height 1u8 into r6 as InvoiceData;
    set r6 into invoices[r2];

function get_invoice_status:
    input r0 as field.public;
    async get_invoice_status r0 into r1;
    output r1 as zk_pay_proofs_privacy_v6.aleo/get_invoice_status.future;

finalize get_invoice_status:
    input r0 as field.public;
    get invoices[r0] into r1;

constructor:
    assert.eq edition 0u16;
