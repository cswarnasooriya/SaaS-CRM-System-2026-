// backend/src/controllers/authController.js
import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new company and admin user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { companyName, userName, email, password } = req.body;

    // 1. User kalinma system eke innawada kiyala check karanawa
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Password eka hash karanawa
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Prisma Nested Write: Company ekai User wai eka sarema create karanawa
    const company = await prisma.company.create({
      data: {
        name: companyName,
        users: {
          create: {
            name: userName,
            email,
            password: hashedPassword,
            role: 'ADMIN', // Mulimna register wena kena Admin
          },
        },
      },
      include: {
        users: true, // Create una user ge details return karanna kiyanawa
      },
    });

    const newUser = company.users[0];

    // 4. JWT Token eka generate karanawa
    const token = generateToken(newUser.id, company.id, newUser.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        companyId: company.id,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. User innawada check karanawa
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Password eka match wenawada kiyala balanawa (bcryptjs eken)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Passwords match nam, token eka generate karanawa
    const token = generateToken(user.id, user.companyId, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};



// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Needs Token)
export const getMe = async (req, res) => {
  try {
    // req.user.id eka awe ape protect middleware eken
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};