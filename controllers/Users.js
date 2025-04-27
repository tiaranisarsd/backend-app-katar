import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const response = await prisma.users.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await prisma.users.findFirst({
      where: {
        uuid: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ msg: "Data tidak ditemukan" });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

export const createUsers = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  const hashPassword = await argon2.hash(password);
  try {
    await prisma.users.create({
      data: {
        uuid: uuidv4(),
        name: name,
        email: email,
        password: hashPassword,
        role: role,
        createdAt: new Date()
      },
    });
    res.status(201).json({ msg: "Users Created Successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUsers = async (req, res) => {
  const users = await prisma.users.findFirst({
    where: {
      uuid: req.params.id,
    },
  });

  if (!users) return res.status(404).json({ msg: "User not found" });

  const { name, email, password, confPassword, role } = req.body;
  let hashPassword = users.password;

  if (password && password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match" });
  }

  if (password) {
    hashPassword = await argon2.hash(password);
  }

  try {
    await prisma.users.update({
      where: {
        id: users.id,
      },
      data: {
        uuid: uuidv4(),
        name,
        email,
        password: hashPassword,
        role,
        createdAt: new Date()
      },
    });
    res.status(200).json({ msg: "Users updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  const users = await prisma.users.findFirst({
    where: {
      uuid: req.params.id,
    },
  });
  if (!users) return res.status(404).json({ msg: "User not found" });
  try {
    await prisma.users.delete({
      where: {
        id: users.id,
      },
    });
    res.status(201).json({ msg: "Users deleted successfully" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
