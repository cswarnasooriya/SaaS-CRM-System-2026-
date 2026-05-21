import prisma from '../config/prisma.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { companyId: req.user.companyId },
      include: {
        customer: { select: { firstName: true, lastName: true } },
        user: { select: { name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workspace tasks' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, customerId, status } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        customerId: customerId || null,
        status: status || 'TODO',
        userId: req.user.id,
        companyId: req.user.companyId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating agile task' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task stage configuration' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing agile task entity' });
  }
};