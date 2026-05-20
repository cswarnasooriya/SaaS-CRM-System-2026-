import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

// @desc    Get all team members for the company
// @route   GET /api/team
export const getTeam = async (req, res) => {
  try {
    const team = await prisma.user.findMany({
      where: {
        companyId: req.user.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    res.status(200).json(team);
  } catch (error) {
    console.error('Get Team Error:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

// @desc    Add a new team member
// @route   POST /api/team
export const addTeamMember = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user under the same company
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'USER',
        companyId: req.user.companyId, 
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Add Team Member Error:', error);
    res.status(500).json({ message: 'Error adding team member' });
  }
};