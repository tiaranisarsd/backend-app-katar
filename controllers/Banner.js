import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const bannerDir = path.join(process.cwd(), 'uploads/banner'); // Ubah jadi uploads/banner

// Fungsi untuk membuat direktori jika belum ada
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
ensureDirExists(bannerDir);

export const getAllBanner = async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            select: {
                id: true,
                uuid: true,
                bannerName: true,
                imageBanner: true,
            },
        });
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getBannerById = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: {
                uuid: req.params.id,
            },
        });
        if (!banner) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createBanner = async (req, res) => {
    try {
        const { bannerName } = req.body;
        const imageBanner = req.file ? req.file.filename : '';

        const newBanner = await prisma.banner.create({
            data: {
                uuid: uuidv4(),
                bannerName,
                imageBanner,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        });

        res.status(201).json({ msg: "Banner Created Successfully", banner: newBanner });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateBanner = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: {
                uuid: req.params.id,
            },
        });

        if (!banner) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        const { bannerName } = req.body;
        let imageBanner = banner.imageBanner; // default: gambar lama

        // Jika ada file baru diupload
        if (req.file) {
            const oldImagePath = path.join(bannerDir, banner.imageBanner);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // hapus gambar lama
            }
            imageBanner = req.file.filename;
        }

        const updatedBanner = await prisma.banner.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                bannerName,
                imageBanner,
                updatedAt: new Date()
            },
        });

        res.status(200).json({ msg: "Banner berhasil diperbarui", banner: updatedBanner });
    } catch (error) {
        console.error("Error in updateBanner:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: {
                uuid: req.params.id,
            },
        });

        if (!banner) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Hapus file gambar dari folder uploads/banner
        if (banner.imageBanner) {
            const imagePath = path.join(bannerDir, banner.imageBanner);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.banner.delete({
            where: {
                uuid: req.params.id,
            },
        });

        res.status(200).json({ msg: "Banner deleted successfully" });
    } catch (error) {
        console.error("Error in deleteBanner:", error);
        res.status(500).json({ msg: error.message });
    }
};
