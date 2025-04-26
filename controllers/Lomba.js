import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Mendapatkan semua Lomba
export const getAllLomba = async (req, res) => {
    try {
        const response = await prisma.lomba.findMany({
            select: {
                id: true,
                uuid: true,
                lombaName: true
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Mendapatkan Lomba berdasarkan ID
export const getLombaById = async (req, res) => {
    try {
        const lomba = await prisma.lomba.findUnique({
            where: {
                uuid: req.params.id
            },
            select: {
                id: true,
                uuid: true,
                lombaName: true
            }
        });
        if (!lomba) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(lomba);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menambahkan Lomba baru
export const createLomba = async (req, res) => {
    const { lombaName } = req.body;
    try {
        const newLomba = await prisma.lomba.create({
            data: {
                uuid: crypto.randomUUID(),
                lombaName: lombaName,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json({ msg: "Lomba Created Successfully", lomba: newLomba });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Memperbarui Lomba berdasarkan ID
export const updateLomba = async (req, res) => {
    try {
        const lomba = await prisma.lomba.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!lomba) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { lombaName } = req.body;
        const updatedLomba = await prisma.lomba.update({
            where: {
                uuid: req.params.id
            },
            data: {
                lombaName: lombaName,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ msg: "Lomba updated successfully", lomba: updatedLomba });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// Menghapus Lomba berdasarkan ID
export const deleteLomba = async (req, res) => {
    try {
        const lomba = await prisma.lomba.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!lomba) return res.status(404).json({ msg: "Data tidak ditemukan" });

        await prisma.lomba.delete({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Lomba deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export default {
    getAllLomba,
    getLombaById,
    createLomba,
    updateLomba,
    deleteLomba,
};
