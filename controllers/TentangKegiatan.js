import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import fs from 'fs';
import path from 'path';

export const getTentangKegiatan = async (req, res) => {
    try {
        const response = await prisma.tentangKegiatan.findMany({
            select: {
                id: true,
                uuid: true,
                judulKegiatan: true,
                image: true,
                tanggal: true,
                keterangan: true
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTentangKegiatanById = async (req, res) => {
    try {
        const tentangKegiatan = await prisma.tentangKegiatan.findUnique({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                uuid: true,
                judulKegiatan: true,
                image: true,
                tanggal: true,
                keterangan: true
            }
        });
        if (!tentangKegiatan) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(tentangKegiatan);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTentangKegiatan = async (req, res) => {
    try {
        const { judulKegiatan, tanggal, keterangan } = req.body;
        const image = req.file ? req.file.filename : '';

        const newTentangKegiatan = await prisma.tentangKegiatan.create({
            data: {
                uuid: crypto.randomUUID(),
                judulKegiatan: judulKegiatan,
                image: image,
                tanggal: tanggal,
                keterangan: keterangan,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json({ msg: "Tentang Kegiatan Created Successfully", tentangKegiatan: newTentangKegiatan });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateTentangKegiatan = async (req, res) => {
    try {
        const tentangKegiatan = await prisma.tentangKegiatan.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!tentangKegiatan) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { judulKegiatan, tanggal, keterangan } = req.body;
        let image = tentangKegiatan.image; // gunakan gambar yang sudah ada

         // Handle image update
        if (req.file) {
            const imagePath = path.join(process.cwd(), 'uploads/tentangKegiatan', tentangKegiatan.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            image = req.file.filename;
        }

        const updatedTentangKegiatan = await prisma.tentangKegiatan.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                judulKegiatan: judulKegiatan,
                image: image,
                tanggal: tanggal,
                keterangan: keterangan,
                updatedAt: new Date()
            }
        });

        res.status(200).json({ msg: "Tentang Kegiatan updated successfully", tentangKegiatan: updatedTentangKegiatan });
    } catch (error) {
        console.error("Error in updateTentangKegiatan:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteTentangKegiatan = async (req, res) => {
    try {
        const tentangKegiatan = await prisma.tentangKegiatan.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!tentangKegiatan) {
            console.error("Data not found");
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Hapus file gambar dari folder uploads/tentangKegiatan
        const imagePath = path.join(process.cwd(), 'uploads/tentangKegiatan', tentangKegiatan.image);
        if (fs.existsSync(imagePath)) {
             fs.unlinkSync(imagePath);
        }

        await prisma.tentangKegiatan.delete({
            where: {
                uuid: req.params.id,
            }
        });

        res.status(200).json({ msg: "Tentang Kegiatan deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTentangKegiatan:", error);
        res.status(500).json({ msg: error.message });
    }
};

export default {
    getTentangKegiatan,
    getTentangKegiatanById,
    createTentangKegiatan,
    updateTentangKegiatan,
    deleteTentangKegiatan,
};
