// backend/src/controllers/customerController.js
import prisma from '../config/prisma.js';

// @desc    Create a new customer/lead
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, status } = req.body;

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        status: status || 'NEW',
        // Me user ge company id eka auto link karanawa
        companyId: req.user.companyId,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create Customer Error:', error);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

// @desc    Get all customers for the logged-in user's company
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: {
        // Multi-tenant filter: Me company eke ewun witharai enne
        companyId: req.user.companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error('Get Customers Error:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

// @desc    Get a single customer by ID
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: {
        id: req.params.id,
        companyId: req.user.companyId, // Security check
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Get Customer Error:', error);
    res.status(500).json({ message: 'Error fetching customer' });
  }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    // 1. Customer innawada saha eya me company ekeda kiyala check karanawa
    const existingCustomer = await prisma.customer.findFirst({
      where: { id: req.params.id, companyId: req.user.companyId },
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    // 2. Update karanawa
    const updatedCustomer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Update Customer Error:', error);
    res.status(500).json({ message: 'Error updating customer' });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const existingCustomer = await prisma.customer.findFirst({
      where: { id: req.params.id, companyId: req.user.companyId },
    });

    if (!existingCustomer) {
      return res.status(404).json({ message: 'Customer not found or unauthorized' });
    }

    await prisma.customer.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: 'Customer removed successfully' });
  } catch (error) {
    console.error('Delete Customer Error:', error);
    res.status(500).json({ message: 'Error deleting customer' });
  }
};