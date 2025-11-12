import express from 'express';
import Invoice from '../models/Invoice.js';
import CorporateData from '../models/CorporateData.js';
import { ConsignmentUsage } from '../models/ConsignmentAssignment.js';
import { authenticateCorporate, authenticateAdmin } from '../middleware/auth.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const router = express.Router();

// Function to generate HTML invoice
const generateHTMLInvoice = (invoiceData, corporate) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return '-';
    }
    return parsed.toLocaleDateString('en-GB');
  };

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Lakh', 'Crore'];

    if (num === 0) return 'Zero Rupees Only';

    const splitNumber = (n) => {
      const result = [];
      result.push(n % 1000);
      n = Math.floor(n / 1000);
      while (n > 0) {
        result.push(n % 100);
        n = Math.floor(n / 100);
      }
      return result;
    };

    const convertChunk = (chunk) => {
      let words = '';

      if (chunk > 99) {
        words += `${ones[Math.floor(chunk / 100)]} Hundred `;
        chunk %= 100;
      }

      if (chunk > 19) {
        words += `${tens[Math.floor(chunk / 10)]} `;
        chunk %= 10;
      }

      if (chunk > 0) {
        words += `${ones[chunk]} `;
      }

      return words.trim();
    };

    const chunks = splitNumber(Math.floor(num));
    const words = [];

    for (let i = chunks.length - 1; i >= 0; i--) {
      if (chunks[i] === 0) continue;
      words.push(`${convertChunk(chunks[i])} ${scales[i]}`.trim());
    }

    const rupees = words.join(' ').trim();
    const paise = Math.round((num - Math.floor(num)) * 100);
    const paiseWords = paise > 0 ? ` and ${convertChunk(paise)} Paise` : '';

    return `${rupees}${paiseWords} Only`;
  };

  const invoiceDate = formatDate(invoiceData.invoiceDate || new Date());
  const dueDate = formatDate(invoiceData.dueDate);
  const periodStart = formatDate(invoiceData.invoicePeriod?.startDate);
  const periodEnd = formatDate(invoiceData.invoicePeriod?.endDate);
  const amountInWords = numberToWords(invoiceData.grandTotal || 0);
  const totalShipments = invoiceData.shipments?.length || 0;

  const shipmentRows = (invoiceData.shipments || []).map((shipment, index) => {
    const weightValue = shipment.weight ? `${shipment.weight} kg` : '-';
    const awbChargeDisplay = shipment.awbCharge !== undefined ? formatCurrency(shipment.awbCharge) : '₹ -';
    const otherCharges = shipment.otherCharges ? formatCurrency(shipment.otherCharges) : '₹ -';
    const freight = formatCurrency(shipment.freightCharges);
    const amount = formatCurrency(shipment.totalAmount);

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${formatDate(shipment.bookingDate)}</td>
        <td>${shipment.serviceType || 'NON-DOX'}</td>
        <td>${shipment.destination || '-'}</td>
        <td>${shipment.consignmentNumber || '-'}</td>
        <td>${weightValue}</td>
        <td>${awbChargeDisplay}</td>
        <td>${otherCharges}</td>
        <td>${freight}</td>
        <td>${amount}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consolidated Invoice</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 0;
      padding: 32px;
      background-color: #f3f6fb;
      color: #1f2937;
    }
    .invoice-wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 22px 65px rgba(15, 23, 42, 0.15);
      border: 1px solid rgba(203, 213, 225, 0.7);
      overflow: hidden;
    }
    .invoice-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 36px;
      background: linear-gradient(135deg, #ecfdf5, #e0f2f1);
      border-bottom: 2px solid #b2dfdb;
    }
    .logo-box {
      width: 96px;
      height: 96px;
      border-radius: 16px;
      background: linear-gradient(135deg, #fff9c4, #ffecb3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #8d6e63;
      letter-spacing: 0.12em;
    }
    .header-contact {
      flex: 1;
      text-align: center;
      color: #0f172a;
    }
    .header-contact h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .header-contact p {
      margin: 6px 0;
      font-size: 14px;
      color: #4b5563;
    }
    .invoice-badge {
      background: linear-gradient(135deg, #0f766e, #22c55e);
      color: #ffffff;
      padding: 14px 36px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      box-shadow: 0 12px 30px rgba(15, 118, 110, 0.35);
    }
    .section {
      padding: 28px 36px;
    }
    .party-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
    .party-card {
      border-radius: 16px;
      padding: 24px 26px;
      border: 1px solid rgba(255, 176, 153, 0.45);
      background: linear-gradient(135deg, rgba(255, 234, 226, 0.95), rgba(255, 246, 241, 0.9));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .party-card h3 {
      margin: 0 0 14px;
      font-size: 18px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #d97706;
    }
    .party-card p {
      margin: 6px 0;
      font-size: 14px;
      line-height: 1.65;
      color: #374151;
    }
    .party-card strong {
      font-size: 16px;
      color: #0f172a;
    }
    .meta-strip {
      margin-top: 26px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 18px;
    }
    .meta-box {
      border-radius: 14px;
      padding: 18px 20px;
      background: linear-gradient(135deg, #ecfeff, #e0f2fe);
      border: 1px solid rgba(125, 211, 252, 0.6);
      box-shadow: 0 10px 25px rgba(14, 165, 233, 0.12);
    }
    .meta-box span {
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0284c7;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .meta-box strong {
      font-size: 16px;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
    }
    thead tr {
      background: linear-gradient(135deg, #0f766e, #0f9d58);
      color: #ffffff;
    }
    thead th {
      padding: 14px 12px;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 600;
    }
    tbody td {
      padding: 14px 12px;
      font-size: 13px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    tbody tr:hover {
      background: rgba(16, 185, 129, 0.1);
    }
    .summary-wrapper {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 28px;
      margin-top: 32px;
    }
    .notes-stack {
      display: grid;
      gap: 18px;
    }
    .note-card {
      border-radius: 16px;
      padding: 20px 24px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      background: linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.9));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .note-card h4 {
      margin: 0 0 12px;
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #0f172a;
    }
    .note-card p,
    .note-card li {
      margin: 0;
      font-size: 13px;
      line-height: 1.7;
      color: #475569;
    }
    .note-card ul {
      padding-left: 18px;
      margin: 0;
    }
    .summary-card {
      border-radius: 16px;
      padding: 22px 24px;
      background: linear-gradient(135deg, rgba(224, 242, 241, 0.95), rgba(236, 253, 245, 0.9));
      border: 1px solid rgba(45, 212, 191, 0.45);
      box-shadow: 0 14px 30px rgba(45, 212, 191, 0.18);
    }
    .summary-card table {
      width: 100%;
      border-collapse: collapse;
    }
    .summary-card td {
      padding: 10px 4px;
      font-size: 14px;
      color: #0f172a;
    }
    .summary-card td:last-child {
      text-align: right;
      font-weight: 600;
    }
    .summary-card tr:not(:last-child) td {
      border-bottom: 1px dashed rgba(15, 118, 110, 0.25);
    }
    .grand-total-box {
      margin-top: 18px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #0f766e, #059669);
      border-radius: 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .bank-card {
      border-radius: 16px;
      padding: 20px 24px;
      border: 1px solid rgba(96, 165, 250, 0.4);
      background: linear-gradient(135deg, rgba(239, 246, 255, 0.95), rgba(219, 234, 254, 0.9));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
    .footer {
      padding: 22px 36px 36px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px dashed rgba(148, 163, 184, 0.4);
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="invoice-header">
      <div class="logo-box">LOGO</div>
      <div class="header-contact">
        <h1>Our Courier & Logistics Services (I) Pvt.Ltd</h1>
        <p>www.oclservices.com · account@oclservices.com</p>
        <p>+91 9085969696 · +91 123456789</p>
      </div>
      <div class="invoice-badge">Invoice</div>
    </div>

    <div class="section">
      <div class="party-grid">
        <div class="party-card">
          <h3>Biller</h3>
          <p><strong>Our Courier & Logistics Services (I) Pvt.Ltd</strong></p>
          <p>Rehabari, Guwahati, Kamrup</p>
          <p>GSTIN/UIN: 18AACCO3877C1ZE</p>
          <p>State Name: Assam, Code: 18</p>
          <p>Contact: 9085969696</p>
          <p>E-Mail: oclindia2016@gmail.com</p>
        </div>
        <div class="party-card">
          <h3>Bill To</h3>
          <p><strong>${corporate.companyName || '-'}</strong></p>
          <p>${corporate.fullAddress || corporate.companyAddress || '-'}</p>
          <p>GSTIN/UIN: ${corporate.gstNumber || 'N/A'}</p>
          <p>State: ${corporate.state || '-'}</p>
          <p>Contact: ${corporate.contactNumber || '-'}</p>
          <p>E-Mail: ${corporate.email || '-'}</p>
        </div>
      </div>

      <div class="meta-strip">
        <div class="meta-box">
          <span>Invoice Date</span>
          <strong>${invoiceDate}</strong>
        </div>
        <div class="meta-box">
          <span>Invoice No.</span>
          <strong>${invoiceData.invoiceNumber}</strong>
        </div>
        <div class="meta-box">
          <span>Invoice Period</span>
          <strong>${periodStart} to ${periodEnd}</strong>
        </div>
        <div class="meta-box">
          <span>Total Shipments</span>
          <strong>${totalShipments}</strong>
        </div>
        <div class="meta-box">
          <span>Due Date</span>
          <strong>${dueDate}</strong>
        </div>
      </div>
    </div>

    <div class="section">
      <table>
        <thead>
          <tr>
            <th>Sl.No.</th>
            <th>Date</th>
            <th>Type</th>
            <th>Destination</th>
            <th>AWB No.</th>
            <th>Weight</th>
            <th>AWB</th>
            <th>Others</th>
            <th>Freight</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${shipmentRows}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="summary-wrapper">
        <div class="notes-stack">
          <div class="note-card">
            <h4>Amount In Words</h4>
            <p>${amountInWords}</p>
          </div>
          <div class="note-card">
            <h4>Terms & Conditions</h4>
            <ul>
              <li>Invoice amount to be paid by same days from the date of invoice.</li>
              <li>Payment should be crossed account payee cheque/demand draft or digital transfer in favour of Our Courier & Logistics Services (I) Pvt.Ltd.</li>
              <li>Interest @ 3% per month will be charged on payment.</li>
            </ul>
          </div>
          <div class="bank-card">
            <h4 style="margin:0 0 12px;font-size:15px;text-transform:uppercase;letter-spacing:0.07em;color:#0f172a;">Bank Details</h4>
            <p style="margin:4px 0;font-size:13px;color:#1f2937;">Bank: SBI</p>
            <p style="margin:4px 0;font-size:13px;color:#1f2937;">Account No: 1234567890</p>
            <p style="margin:4px 0;font-size:13px;color:#1f2937;">IFSC: SBIN0001234</p>
          </div>
        </div>
        <div class="summary-card">
          <table>
            <tr>
              <td>Total</td>
              <td>${formatCurrency(invoiceData.subtotal)}</td>
            </tr>
            <tr>
              <td>AWB Charges</td>
              <td>${formatCurrency(invoiceData.awbChargesTotal)}</td>
            </tr>
            <tr>
              <td>Fuel Charge (${invoiceData.fuelChargePercentage || 0}%)</td>
              <td>${formatCurrency(invoiceData.fuelSurchargeTotal)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${formatCurrency(invoiceData.totalBeforeTax || (invoiceData.subtotal + invoiceData.awbChargesTotal + invoiceData.fuelSurchargeTotal))}</td>
            </tr>
            <tr>
              <td>CGST</td>
              <td>${formatCurrency(invoiceData.cgstTotal)}</td>
            </tr>
            <tr>
              <td>SGST</td>
              <td>${formatCurrency(invoiceData.sgstTotal)}</td>
            </tr>
            <tr>
              <td>IGST</td>
              <td>${formatCurrency(invoiceData.igstTotal)}</td>
            </tr>
          </table>
          <div class="grand-total-box">
            <span>Grand Total</span>
            <span>${formatCurrency(invoiceData.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>This is a computer generated invoice and does not require any official signature. Kindly notify us immediately in case you find any discrepancy in the details of transactions.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Get settlement summary for corporate
router.get('/summary', authenticateCorporate, async (req, res) => {
  try {
    const summary = await Invoice.getInvoiceSummary(req.corporate._id);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Settlement summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settlement summary'
    });
  }
});

// Get all invoices for corporate
router.get('/invoices', authenticateCorporate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { corporateId: req.corporate._id };
    if (status && ['unpaid', 'paid', 'overdue'].includes(status)) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const invoices = await Invoice.find(query)
      .sort({ invoiceDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Invoice.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// Get specific invoice details
router.get('/invoices/:invoiceId', authenticateCorporate, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.invoiceId,
      corporateId: req.corporate._id
    });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoice details'
    });
  }
});

// Generate invoice for unpaid shipments (Admin only)
router.post('/generate-invoice', authenticateAdmin, async (req, res) => {
  try {
    const { corporateId, startDate, endDate, shipments } = req.body;
    
    // Validate required fields
    if (!corporateId || !startDate || !endDate || !shipments || !Array.isArray(shipments)) {
      return res.status(400).json({
        success: false,
        error: 'Corporate ID, date range, and shipments are required'
      });
    }
    
    // Get corporate details
    const corporate = await CorporateData.findById(corporateId);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        error: 'Corporate not found'
      });
    }
    
    // Check if invoice already exists for this period
    const existingInvoice = await Invoice.findOne({
      corporateId: corporateId,
      'invoicePeriod.startDate': new Date(startDate),
      'invoicePeriod.endDate': new Date(endDate)
    });
    
    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        error: 'Invoice already exists for this period'
      });
    }
    
    // Get corporate pricing to get fuel charge percentage
    const CorporatePricing = (await import('../models/CorporatePricing.js')).default;
    const pricing = await CorporatePricing.findOne({ 
      corporateClient: corporateId,
      status: 'approved'
    });
    
    // Use fuel charge percentage from pricing, default to 15% if not found
    const fuelChargePercentage = pricing?.fuelChargePercentage || 15;
    
    // Generate invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber();
    
    // Calculate totals
    let subtotal = 0;
    let awbChargesTotal = 0;
    let fuelSurchargeTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    
    const processedShipments = shipments.map(shipment => {
      const freightCharges = parseFloat(shipment.freightCharges) || 0;
      const awbCharge = 50; // 50rs per AWB
      const fuelSurcharge = freightCharges * (fuelChargePercentage / 100); // Dynamic fuel surcharge percentage
      const cgst = freightCharges * 0.09; // 9% CGST
      const sgst = freightCharges * 0.09; // 9% SGST
      const totalAmount = freightCharges + awbCharge + fuelSurcharge + cgst + sgst;
      
      subtotal += freightCharges;
      awbChargesTotal += awbCharge;
      fuelSurchargeTotal += fuelSurcharge;
      cgstTotal += cgst;
      sgstTotal += sgst;
      
      return {
        consignmentNumber: shipment.consignmentNumber,
        bookingDate: new Date(shipment.bookingDate),
        destination: shipment.destination,
        serviceType: shipment.serviceType === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: parseFloat(shipment.weight) || 0,
        freightCharges: freightCharges,
        awbCharge: awbCharge,
        fuelSurcharge: fuelSurcharge,
        cgst: cgst,
        sgst: sgst,
        totalAmount: totalAmount
      };
    });
    
    const grandTotal = subtotal + awbChargesTotal + fuelSurchargeTotal + cgstTotal + sgstTotal;
    
    // Create invoice
    const invoice = new Invoice({
      invoiceNumber: invoiceNumber,
      corporateId: corporateId,
      companyName: corporate.companyName,
      companyAddress: corporate.fullAddress,
      gstNumber: corporate.gstNumber,
      state: corporate.state,
      stateCode: '18', // Default to Assam
      contactNumber: corporate.contactNumber,
      email: corporate.email,
      invoicePeriod: {
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
      shipments: processedShipments,
      subtotal: subtotal,
      awbChargesTotal: awbChargesTotal,
      fuelSurchargeTotal: fuelSurchargeTotal,
      fuelChargePercentage: fuelChargePercentage,
      cgstTotal: cgstTotal,
      sgstTotal: sgstTotal,
      grandTotal: grandTotal,
      amountInWords: '', // Will be set by pre-save middleware
      status: 'unpaid',
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // 30 days from now
      termsAndConditions: [
        'Invoice Amount To Be Paid By Same Days From The Date Of Invoice',
        'Payment Should Be Crossed Account Payee Cheque/Demand Draft or Digital Transfer Our Courier & Logistics Services (I) Pvt.Ltd',
        'Interest @ 3% Per Month Will Be Charged On Payment'
      ],
      createdBy: req.admin._id
    });
    
    await invoice.save();
    
    // Mark shipments as invoiced
    const shipmentIds = shipments.map(s => s._id);
    await ConsignmentUsage.markAsInvoiced(shipmentIds, invoice._id);
    
    console.log(`✅ Invoice generated: ${invoiceNumber} for ${corporate.companyName}`);
    
    res.json({
      success: true,
      message: 'Invoice generated successfully',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        grandTotal: invoice.grandTotal,
        dueDate: invoice.dueDate,
        invoiceId: invoice._id
      }
    });
    
  } catch (error) {
    console.error('Generate invoice error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate invoice'
      });
    }
  }
});

// Mark invoice as paid (Admin only)
router.patch('/invoices/:invoiceId/mark-paid', authenticateAdmin, async (req, res) => {
  try {
    const { paymentMethod, paymentReference } = req.body;
    
    if (!paymentMethod || !paymentReference) {
      return res.status(400).json({
        success: false,
        error: 'Payment method and reference are required'
      });
    }
    
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    await invoice.markAsPaid(paymentMethod, paymentReference);
    invoice.lastModifiedBy = req.admin._id;
    await invoice.save();
    
    console.log(`✅ Invoice ${invoice.invoiceNumber} marked as paid`);
    
    res.json({
      success: true,
      message: 'Invoice marked as paid successfully',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        paymentDate: invoice.paymentDate,
        paymentMethod: invoice.paymentMethod,
        paymentReference: invoice.paymentReference
      }
    });
    
  } catch (error) {
    console.error('Mark invoice paid error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark invoice as paid'
    });
  }
});

// Get unpaid shipments for invoice generation (Admin only)
router.get('/unpaid-shipments/:corporateId', authenticateAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }
    
    // Get unpaid shipments from consignment usage
    const unpaidShipments = await ConsignmentUsage.findUnpaidForInvoice(
      req.params.corporateId, 
      startDate, 
      endDate
    );
    
    // Format shipment data for invoice
    const formattedShipments = unpaidShipments.map(usage => {
      const bookingData = usage.bookingData;
      return {
        _id: usage._id,
        consignmentNumber: usage.consignmentNumber,
        bookingDate: usage.usedAt,
        destination: bookingData.destinationData?.city || 'N/A',
        serviceType: bookingData.shipmentData?.natureOfConsignment === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: bookingData.shipmentData?.actualWeight || bookingData.shipmentData?.chargeableWeight || 0,
        freightCharges: usage.freightCharges || 0,
        totalAmount: usage.totalAmount || 0
      };
    });
    
    res.json({
      success: true,
      data: {
        shipments: formattedShipments,
        totalShipments: formattedShipments.length,
        totalAmount: formattedShipments.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
      }
    });
    
  } catch (error) {
    console.error('Get unpaid shipments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unpaid shipments'
    });
  }
});

// Get consolidated invoice for admin (Admin only) - One invoice with all consignments
router.get('/admin/consolidated-invoice', authenticateAdmin, async (req, res) => {
  try {
    const { corporateId } = req.query;
    console.log('Admin consolidated invoice request - corporateId:', corporateId);
    
    if (!corporateId) {
      return res.status(400).json({
        success: false,
        error: 'Corporate ID is required'
      });
    }
    
    let actualCorporateId;
    
    // corporateId can be either ObjectId or string corporateId (like A00001)
    if (corporateId.match(/^[0-9a-fA-F]{24}$/)) {
      // It's an ObjectId
      console.log('Using corporateId as ObjectId:', corporateId);
      actualCorporateId = corporateId;
    } else {
      // It's a string corporateId, need to find the actual ObjectId
      console.log('Looking up corporate by string corporateId:', corporateId);
      const CorporateData = (await import('../models/CorporateData.js')).default;
      const corporate = await CorporateData.findOne({ corporateId: corporateId });
      if (corporate) {
        console.log('Found corporate:', corporate.companyName, 'ObjectId:', corporate._id);
        actualCorporateId = corporate._id;
      } else {
        console.log('Corporate not found for corporateId:', corporateId);
        return res.json({
          success: true,
          data: {
            consolidatedInvoice: null,
            summary: {
              totalBills: 0,
              totalAmount: 0,
              totalFreight: 0,
              gstAmount: 0
            }
          }
        });
      }
    }
    
    // Get unpaid FP shipments (same query as corporate settlement)
    const query = {
      corporateId: actualCorporateId,
      paymentStatus: 'unpaid',
      paymentType: 'FP', // Only FP shipments are included in settlement
      status: 'active'
    };
    
    console.log('Querying ConsignmentUsage with:', query);
    
    const ConsignmentUsage = (await import('../models/ConsignmentAssignment.js')).ConsignmentUsage;
    const unpaidShipments = await ConsignmentUsage.find(query)
      .sort({ usedAt: 1 }) // Sort by date ascending
      .lean();
    
    console.log('Found unpaid shipments:', unpaidShipments.length);
    
    if (unpaidShipments.length === 0) {
      return res.json({
        success: true,
        data: {
          consolidatedInvoice: null,
          summary: {
            totalBills: 0,
            totalAmount: 0,
            totalFreight: 0,
            gstAmount: 0
          }
        }
      });
    }
    
    // Get corporate details
    const CorporateData = (await import('../models/CorporateData.js')).default;
    const corporate = await CorporateData.findById(actualCorporateId);
    
    // Format all shipments into a single consolidated invoice
    const shipments = unpaidShipments.map(usage => {
      const bookingData = usage.bookingData;
      return {
        _id: usage._id,
        consignmentNumber: usage.consignmentNumber,
        bookingReference: usage.bookingReference,
        bookingDate: usage.usedAt,
        destination: bookingData.destinationData?.city || 'N/A',
        serviceType: bookingData.shipmentData?.natureOfConsignment === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: bookingData.shipmentData?.actualWeight || bookingData.shipmentData?.chargeableWeight || 0,
        freightCharges: usage.freightCharges || 0,
        totalAmount: usage.totalAmount || 0,
        status: usage.status,
        paymentStatus: usage.paymentStatus
      };
    });
    
    // Calculate totals
    const totalAmount = unpaidShipments.reduce((sum, usage) => sum + (usage.totalAmount || 0), 0);
    const totalFreight = unpaidShipments.reduce((sum, usage) => sum + (usage.freightCharges || 0), 0);
    
    // Create consolidated invoice
    const consolidatedInvoice = {
      _id: `consolidated-${actualCorporateId}`,
      invoiceNumber: `CONS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
      corporateId: actualCorporateId,
      companyName: corporate?.companyName || 'Unknown Company',
      companyAddress: corporate?.companyAddress || 'Unknown Address',
      gstNumber: corporate?.gstNumber || '',
      state: corporate?.state || 'Unknown',
      contactNumber: corporate?.contactNumber || '',
      email: corporate?.email || '',
      invoiceDate: new Date().toISOString(),
      invoicePeriod: {
        startDate: shipments.length > 0 ? shipments[0].bookingDate : new Date().toISOString(),
        endDate: shipments.length > 0 ? shipments[shipments.length - 1].bookingDate : new Date().toISOString()
      },
      shipments: shipments,
      subtotal: totalFreight,
      fuelSurchargeTotal: 0,
      cgstTotal: 0,
      sgstTotal: 0,
      grandTotal: totalAmount,
      status: 'unpaid',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      amountInWords: 'Amount in words'
    };
    
    res.json({
      success: true,
      data: {
        consolidatedInvoice: consolidatedInvoice,
        summary: {
          totalBills: unpaidShipments.length,
          totalAmount: totalAmount,
          totalFreight: totalFreight,
          gstAmount: totalAmount - totalFreight
        }
      }
    });
    
  } catch (error) {
    console.error('Get admin consolidated invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consolidated invoice'
    });
  }
});

// Get all invoices (Admin only)
router.get('/admin/invoices', authenticateAdmin, async (req, res) => {
  try {
    const { corporateId, status, page = 1, limit = 10 } = req.query;
    console.log('Admin invoices request - corporateId:', corporateId, 'status:', status);
    
    const query = {};
    if (corporateId) {
      // corporateId can be either ObjectId or string corporateId (like A00001)
      // First try to find by ObjectId, if that fails, find by string corporateId
      if (corporateId.match(/^[0-9a-fA-F]{24}$/)) {
        // It's an ObjectId
        console.log('Using corporateId as ObjectId:', corporateId);
        query.corporateId = corporateId;
      } else {
        // It's a string corporateId, need to find the actual ObjectId
        console.log('Looking up corporate by string corporateId:', corporateId);
        const CorporateData = (await import('../models/CorporateData.js')).default;
        const corporate = await CorporateData.findOne({ corporateId: corporateId });
        if (corporate) {
          console.log('Found corporate:', corporate.companyName, 'ObjectId:', corporate._id);
          query.corporateId = corporate._id;
        } else {
          console.log('Corporate not found for corporateId:', corporateId);
          // Corporate not found, return empty result
          return res.json({
            success: true,
            data: {
              invoices: [],
              pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: parseInt(limit)
              }
            }
          });
        }
      }
    }
    if (status && ['unpaid', 'paid', 'overdue'].includes(status)) {
      query.status = status;
    }
    
    console.log('Final query:', query);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const invoices = await Invoice.find(query)
      .populate('corporateId', 'companyName corporateId email contactNumber')
      .sort({ invoiceDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await Invoice.countDocuments(query);
    console.log('Found invoices:', invoices.length, 'Total:', total);
    
    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get all invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch invoices'
    });
  }
});

// Get overdue invoices (Admin only)
router.get('/admin/overdue', authenticateAdmin, async (req, res) => {
  try {
    const overdueInvoices = await Invoice.findOverdue()
      .populate('corporateId', 'companyName corporateId email contactNumber')
      .sort({ dueDate: 1 })
      .lean();
    
    res.json({
      success: true,
      data: overdueInvoices
    });
    
  } catch (error) {
    console.error('Get overdue invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overdue invoices'
    });
  }
});

// Get unpaid bills for corporate (Corporate users)
router.get('/unpaid-bills', authenticateCorporate, async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.usedAt = {};
      if (startDate) {
        dateFilter.usedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to endDate to include the entire end date
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        dateFilter.usedAt.$lt = endDateObj;
      }
    }
    
    // Get unpaid FP shipments with date filter (TP shipments are excluded from settlement)
    const query = {
      corporateId: req.corporate._id,
      paymentStatus: 'unpaid',
      paymentType: 'FP', // Only FP shipments are included in settlement
      status: 'active',
      ...dateFilter
    };
    
    const unpaidShipments = await ConsignmentUsage.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await ConsignmentUsage.countDocuments(query);
    
    // Format shipment data for display
    const formattedBills = unpaidShipments.map(usage => {
      const bookingData = usage.bookingData;
      return {
        _id: usage._id,
        consignmentNumber: usage.consignmentNumber,
        bookingReference: usage.bookingReference,
        bookingDate: usage.usedAt,
        destination: bookingData.destinationData?.city || 'N/A',
        serviceType: bookingData.shipmentData?.natureOfConsignment === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: bookingData.shipmentData?.actualWeight || bookingData.shipmentData?.chargeableWeight || 0,
        freightCharges: usage.freightCharges || 0,
        totalAmount: usage.totalAmount || 0,
        status: usage.status,
        paymentStatus: usage.paymentStatus
      };
    });
    
    // Calculate totals
    const totalAmount = unpaidShipments.reduce((sum, usage) => sum + (usage.totalAmount || 0), 0);
    const totalFreight = unpaidShipments.reduce((sum, usage) => sum + (usage.freightCharges || 0), 0);
    
    res.json({
      success: true,
      data: {
        bills: formattedBills,
        summary: {
          totalBills: total,
          totalAmount: totalAmount,
          totalFreight: totalFreight,
          gstAmount: totalAmount - totalFreight
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get unpaid bills error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unpaid bills'
    });
  }
});

// Generate consolidated invoice from unpaid bills (Corporate users)
router.post('/generate-invoice', authenticateCorporate, async (req, res) => {
  try {
    const { bills } = req.body;
    
    // Validate required fields
    if (!bills || !Array.isArray(bills) || bills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bills array is required and must not be empty'
      });
    }
    
    // Get all unpaid FP shipments for this corporate (TP shipments are excluded from settlement)
    const unpaidShipments = await ConsignmentUsage.find({
      _id: { $in: bills },
      corporateId: req.corporate._id,
      paymentStatus: 'unpaid',
      paymentType: 'FP', // Only FP shipments are included in settlement
      status: 'active'
    }).lean();
    
    if (unpaidShipments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No unpaid bills found for the specified IDs'
      });
    }
    
    // Get corporate details
    const corporate = await CorporateData.findById(req.corporate._id);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        error: 'Corporate not found'
      });
    }
    
    // Get corporate pricing to get fuel charge percentage
    const CorporatePricing = (await import('../models/CorporatePricing.js')).default;
    const pricing = await CorporatePricing.findOne({ 
      corporateClient: req.corporate._id,
      status: 'approved'
    });
    
    // Use fuel charge percentage from pricing, default to 15% if not found
    const fuelChargePercentage = pricing?.fuelChargePercentage || 15;
    
    // Generate invoice number
    const invoiceNumber = await Invoice.generateInvoiceNumber();
    
    // Calculate totals
    let subtotal = 0;
    let awbChargesTotal = 0;
    let fuelSurchargeTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    
    let periodStartDate = null;
    let periodEndDate = null;

    const processedShipments = unpaidShipments.map(usage => {
      const bookingData = usage.bookingData || {};
      const rawBookingDate = bookingData.bookingDate || usage.usedAt || usage.createdAt;
      const bookingDateObj = rawBookingDate ? new Date(rawBookingDate) : null;
      if (bookingDateObj && !Number.isNaN(bookingDateObj.getTime())) {
        if (!periodStartDate || bookingDateObj < periodStartDate) {
          periodStartDate = bookingDateObj;
        }
        if (!periodEndDate || bookingDateObj > periodEndDate) {
          periodEndDate = bookingDateObj;
        }
      }

      const freightCharges = parseFloat(usage.freightCharges) || 0;
      const awbCharge = 50; // 50rs per AWB
      const fuelSurcharge = freightCharges * (fuelChargePercentage / 100); // Dynamic fuel surcharge percentage
      const cgst = freightCharges * 0.09; // 9% CGST
      const sgst = freightCharges * 0.09; // 9% SGST
      const totalAmount = freightCharges + awbCharge + fuelSurcharge + cgst + sgst;
      
      subtotal += freightCharges;
      awbChargesTotal += awbCharge;
      fuelSurchargeTotal += fuelSurcharge;
      cgstTotal += cgst;
      sgstTotal += sgst;
      
      return {
        consignmentNumber: usage.consignmentNumber,
        bookingDate: bookingDateObj ? bookingDateObj.toISOString() : null,
        destination: bookingData.destinationData?.city || 'N/A',
        serviceType: bookingData.shipmentData?.natureOfConsignment === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: bookingData.shipmentData?.actualWeight || bookingData.shipmentData?.chargeableWeight || 0,
        freightCharges: freightCharges,
        awbCharge: awbCharge,
        fuelSurcharge: fuelSurcharge,
        cgst: cgst,
        sgst: sgst,
        totalAmount: totalAmount
      };
    });
    
    const grandTotal = subtotal + awbChargesTotal + fuelSurchargeTotal + cgstTotal + sgstTotal;
    const totalBeforeTax = subtotal + awbChargesTotal + fuelSurchargeTotal;
    
    // Create invoice
    const invoice = new Invoice({
      invoiceNumber: invoiceNumber,
      corporateId: req.corporate._id,
      companyName: corporate.companyName,
      companyAddress: corporate.fullAddress,
      gstNumber: corporate.gstNumber,
      state: corporate.state,
      stateCode: '18', // Default to Assam
      contactNumber: corporate.contactNumber,
      email: corporate.email,
      invoicePeriod: {
        startDate: new Date(Math.min(...unpaidShipments.map(s => new Date(s.usedAt)))),
        endDate: new Date(Math.max(...unpaidShipments.map(s => new Date(s.usedAt))))
      },
      shipments: processedShipments,
      subtotal: subtotal,
      awbChargesTotal: awbChargesTotal,
      fuelSurchargeTotal: fuelSurchargeTotal,
      fuelChargePercentage: fuelChargePercentage,
      cgstTotal: cgstTotal,
      sgstTotal: sgstTotal,
      grandTotal: grandTotal,
      amountInWords: '', // Will be set by pre-save middleware
      status: 'unpaid',
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // 30 days from now
      termsAndConditions: [
        'Invoice Amount To Be Paid By Same Days From The Date Of Invoice',
        'Payment Should Be Crossed Account Payee Cheque/Demand Draft or Digital Transfer Our Courier & Logistics Services (I) Pvt.Ltd',
        'Interest @ 3% Per Month Will Be Charged On Payment'
      ],
      createdBy: req.corporate._id
    });
    
    await invoice.save();
    
    // Mark shipments as invoiced
    const shipmentIds = unpaidShipments.map(s => s._id);
    await ConsignmentUsage.markAsInvoiced(shipmentIds, invoice._id);
    
    console.log(`✅ Consolidated invoice generated: ${invoiceNumber} for ${corporate.companyName}`);
    
    res.json({
      success: true,
      message: 'Consolidated invoice generated successfully',
      data: {
        invoiceNumber: invoice.invoiceNumber,
        grandTotal: invoice.grandTotal,
        dueDate: invoice.dueDate,
        invoiceId: invoice._id,
        totalBills: unpaidShipments.length
      }
    });
    
  } catch (error) {
    console.error('Generate consolidated invoice error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(e => e.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate consolidated invoice'
      });
    }
  }
});

// Download consolidated invoice (Corporate users)
router.get('/download-consolidated-invoice', authenticateCorporate, async (req, res) => {
  try {
    // Get all unpaid FP bills for this corporate (TP shipments are excluded from settlement)
    const unpaidShipments = await ConsignmentUsage.findUnpaidFPByCorporate(req.corporate._id).lean();
    
    if (unpaidShipments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No unpaid bills found'
      });
    }
    
    // Get corporate details
    const corporate = await CorporateData.findById(req.corporate._id);
    if (!corporate) {
      return res.status(404).json({
        success: false,
        error: 'Corporate not found'
      });
    }
    
    // Get corporate pricing to get fuel charge percentage
    const CorporatePricing = (await import('../models/CorporatePricing.js')).default;
    const pricing = await CorporatePricing.findOne({ 
      corporateClient: req.corporate._id,
      status: 'approved'
    });
    
    // Use fuel charge percentage from pricing, default to 15% if not found
    const fuelChargePercentage = pricing?.fuelChargePercentage || 15;
    
    // Calculate totals
    let subtotal = 0;
    let awbChargesTotal = 0;
    let fuelSurchargeTotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    
    const processedShipments = unpaidShipments.map(usage => {
      const bookingData = usage.bookingData;
      const freightCharges = parseFloat(usage.freightCharges) || 0;
      const awbCharge = 50; // 50rs per AWB
      const fuelSurcharge = freightCharges * (fuelChargePercentage / 100); // Dynamic fuel surcharge percentage
      const cgst = freightCharges * 0.09; // 9% CGST
      const sgst = freightCharges * 0.09; // 9% SGST
      const totalAmount = freightCharges + awbCharge + fuelSurcharge + cgst + sgst;
      
      subtotal += freightCharges;
      awbChargesTotal += awbCharge;
      fuelSurchargeTotal += fuelSurcharge;
      cgstTotal += cgst;
      sgstTotal += sgst;
      
      return {
        consignmentNumber: usage.consignmentNumber,
        bookingDate: usage.usedAt,
        destination: bookingData.destinationData?.city || 'N/A',
        serviceType: bookingData.shipmentData?.natureOfConsignment === 'DOX' ? 'DOX' : 'NON-DOX',
        weight: bookingData.shipmentData?.actualWeight || bookingData.shipmentData?.chargeableWeight || 0,
        freightCharges: freightCharges,
        awbCharge: awbCharge,
        fuelSurcharge: fuelSurcharge,
        cgst: cgst,
        sgst: sgst,
        totalAmount: totalAmount
      };
    });
    
    const grandTotal = subtotal + awbChargesTotal + fuelSurchargeTotal + cgstTotal + sgstTotal;
    
    // Create temporary invoice data for PDF generation
    const invoiceData = {
      invoiceNumber: `CONS-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
      invoiceDate: new Date(),
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      companyName: corporate.companyName,
      companyAddress: corporate.fullAddress,
      gstNumber: corporate.gstNumber,
      contactNumber: corporate.contactNumber,
      email: corporate.email,
      shipments: processedShipments,
      subtotal: subtotal,
      awbChargesTotal: awbChargesTotal,
      fuelSurchargeTotal: fuelSurchargeTotal,
      fuelChargePercentage: fuelChargePercentage,
      cgstTotal: cgstTotal,
      sgstTotal: sgstTotal,
      igstTotal: 0,
      totalBeforeTax: totalBeforeTax,
      grandTotal: grandTotal,
      invoicePeriod: {
        startDate: periodStartDate ? periodStartDate.toISOString() : null,
        endDate: periodEndDate ? periodEndDate.toISOString() : null
      },
      status: 'pending'
    };
    
    // Generate HTML invoice
    const htmlInvoice = generateHTMLInvoice(invoiceData, corporate);
    
    let browser;
    try {
      const { default: puppeteer } = await import('puppeteer');
      const executablePath = puppeteer.executablePath
        ? puppeteer.executablePath()
        : undefined;
      
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(htmlInvoice, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('screen');
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        printBackground: true
      });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="consolidated-invoice-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdfBuffer);
      return;
      
    } catch (error) {
      console.error('Primary PDF generation error (puppeteer):', error);
      if (browser) {
        await browser.close().catch(() => {});
        browser = null;
      }
      
      try {
        const htmlPdf = require('html-pdf');
        const fallbackBuffer = await new Promise((resolve, reject) => {
          htmlPdf
            .create(htmlInvoice, {
              format: 'A4',
              border: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
              },
              type: 'pdf',
              timeout: 30000
            })
            .toBuffer((err, buffer) => {
              if (err) {
                return reject(err);
              }
              resolve(buffer);
            });
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="consolidated-invoice-${new Date().toISOString().split('T')[0]}.pdf"`);
        res.send(fallbackBuffer);
        return;
        
      } catch (fallbackError) {
        console.error('Fallback PDF generation error (html-pdf):', fallbackError);
        res.status(500).json({
          success: false,
          error: 'Failed to generate consolidated invoice PDF',
          details: fallbackError.message || 'Unknown error'
        });
        return;
      }
      
    } finally {
      if (browser) {
        await browser.close().catch(() => {});
      }
    }
    
  } catch (error) {
    console.error('Download consolidated invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download consolidated invoice'
    });
  }
});

export default router;
