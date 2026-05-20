// backend/src/controllers/invoiceController.js
import prisma from '../config/prisma.js';

// @desc    Create a new invoice with items
// @route   POST /api/invoices
export const createInvoice = async (req, res) => {
  try {
    const { customerId, invoiceNumber, dueDate, notes, taxRate, items } = req.body;

    // 1. Backend eken items wala total eka calculate karanawa
    let subTotal = 0;
    const formattedItems = items.map(item => {
      const itemTotal = item.quantity * item.unitPrice;
      subTotal += itemTotal;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: itemTotal
      };
    });

    const taxAmount = (subTotal * (taxRate || 0)) / 100;
    const totalAmount = subTotal + taxAmount;

    // 2. Prisma Nested Write: Invoice ekai Items tikai ekata save karanawa
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        dueDate: new Date(dueDate),
        notes,
        taxRate: taxRate || 0,
        subTotal,
        totalAmount,
        companyId: req.user.companyId, // Auth middleware eken ena id eka
        customerId,
        items: {
          create: formattedItems,
        },
      },
      include: {
        items: true,
        customer: true, // Return weddi customer details uth denawa
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create Invoice Error:', error);
    // Unique invoice number error eka handle kirima
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Invoice number already exists for your company' });
    }
    res.status(500).json({ message: 'Error creating invoice' });
  }
};

// @desc    Get all invoices for the company
// @route   GET /api/invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: req.user.companyId,
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true, email: true }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Get Invoices Error:', error);
    res.status(500).json({ message: 'Error fetching invoices' });
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user.companyId,
      },
      include: {
        items: true,
        customer: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error('Get Invoice Error:', error);
    res.status(500).json({ message: 'Error fetching invoice details' });
  }
};

// @desc    Update invoice status (e.g., mark as PAID)
// @route   PATCH /api/invoices/:id/status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const invoice = await prisma.invoice.updateMany({
      where: {
        id: req.params.id,
        companyId: req.user.companyId,
      },
      data: { status },
    });

    if (invoice.count === 0) {
      return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }

    res.status(200).json({ message: 'Invoice status updated' });
  } catch (error) {
    console.error('Update Invoice Status Error:', error);
    res.status(500).json({ message: 'Error updating invoice status' });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const existingInvoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, companyId: req.user.companyId },
    });

    if (!existingInvoice) {
      return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }

    await prisma.invoice.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete Invoice Error:', error);
    res.status(500).json({ message: 'Error deleting invoice' });
  }
};