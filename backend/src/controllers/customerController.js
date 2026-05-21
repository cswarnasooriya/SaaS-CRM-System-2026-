import prisma from '../config/prisma.js';

export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { companyId: req.user.companyId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        companyId: req.user.companyId,
      },
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
};

// 360 View ekata full customer details, notes, tasks, and invoices aran denawa
export const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { 
        id: req.params.id,
        companyId: req.user.companyId 
      },
      include: {
        invoices: { orderBy: { createdAt: 'desc' } },
        tasks: { 
          include: { user: { select: { name: true } } },
          orderBy: { dueDate: 'asc' }
        },
        notes: { 
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer details' });
  }
};

// NOTE SAVE KIRIMA (FIXED)
export const addNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const note = await prisma.note.create({
      data: {
        content,
        customerId: req.params.id,
        userId: req.user.id,
        companyId: req.user.companyId
      },
      include: {
        user: { select: { name: true } }
      }
    });
    res.status(201).json(note);
  } catch (error) {
    console.error('Add Note Error:', error);
    res.status(500).json({ message: 'Error adding note' });
  }
};

// CUSTOMER PROFILE EKENMA TASK ASSIGN KIRIMA (ALUTH)
export const addCustomerTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        customerId: req.params.id,
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Add Customer Task Error:', error);
    res.status(500).json({ message: 'Error adding task' });
  }
};