import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const getPendaftaran = async (req, res) => {
    try {
        let response;
        if (req.role === "admin") {
            response = await prisma.pendaftaran.findMany({
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    rw: true,
                    user: { select: { name: true, email: true, role: true } },
                    lomba: { select: { id: true, lombaName: true } },
                    category: { select: { id: true, categoryName: true } }
                }
            });
        } else {
            response = await prisma.pendaftaran.findMany({
                where: { userId: req.user.id }, 
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    rw: true,
                    user: { select: { name: true, email: true } },
                    lomba: { select: { id: true, lombaName: true } },
                    category: { select: { id: true, categoryName: true } }
                }
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error?.message || "Internal server error" });
    }
};



export const getPendaftaranById = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findFirst({
            where: { uuid: req.params.id }, // Use uuid to find the unique record
            select: {
                id: true,
                uuid: true,
                name: true,
                rw: true,
                user: { select: { name: true, email: true } },
                lomba: { select: { id: true, lombaName: true } },
                category: { select: { id: true, categoryName: true } }
            }
        });
        if (!pendaftaran) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        res.status(200).json(pendaftaran);
    } catch (error) {
        res.status(500).json({ msg: error?.message || "Internal server error" });
    }
};



export const createPendaftaran = async (req, res) => {
    const { name, rw, lombaId, categoryId  } = req.body;
    const userId = req.user.id;
    try {
        if (!req.user.id) {
            return res.status(401).json({ msg: "User tidak terautentikasi" });
        }

        const newPendaftaran = await prisma.pendaftaran.create({
            data: {
                uuid: crypto.randomUUID(),
                name: name,
                rw: rw,
                lomba: {
                    connect: {
                        id: lombaId,
                    },
                },
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
                user: {
                    connect: {
                      id: userId, // userId dari token atau session
                    },
                  },
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json({ msg: "Pendaftaran berhasil dibuat", pendaftaran: newPendaftaran });
    } catch (error) {
        res.status(500).json({ msg: error?.message || "Internal server error" });
    }
};

export const updatePendaftaran = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findFirst({
            where: { uuid: req.params.id }
        });

        if (!pendaftaran) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        const { name, rw, lombaId, categoryId } = req.body;
        const userId = req.user.id;

        const updatedPendaftaran = await prisma.pendaftaran.update({
            where: { id: pendaftaran.id }, 
            data: {
                name,
                rw: rw,
                lombaId: lombaId,
                categoryId: categoryId,
                userId: userId,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ msg: "Pendaftaran berhasil diperbarui", pendaftaran: updatedPendaftaran });
    } catch (error) {
        res.status(500).json({ msg: error?.message || "Internal server error" });
    }
};


export const deletePendaftaran = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findFirst({
            where: { uuid: req.params.id }
        });

        if (!pendaftaran) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        await prisma.pendaftaran.delete({
            where: { id: pendaftaran.id } 
        });

        res.status(200).json({ msg: "Pendaftaran berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ msg: error?.message || "Internal server error" });
    }
};


export default {
    getPendaftaran,
    getPendaftaranById,
    createPendaftaran,
    updatePendaftaran,
    deletePendaftaran,
};
