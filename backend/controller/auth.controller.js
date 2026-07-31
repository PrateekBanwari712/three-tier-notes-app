import { prisma } from "../lib/prisma.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide your name, email, and password",
        success: false,
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res
        .status(409)
        .json({
          message: "An account already exists with that email",
          success: false,
        });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Unable to create account",
        success: false,
        err: error.message,
      });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "No account found for that email", success: false });
    }

    if (password !== user.password) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    return res.status(200).json({
      message: `Welcome back, ${user.name}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ err: error.message, success: false });
  }
};

export const getuser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to fetch users", success: false });
  }
};
