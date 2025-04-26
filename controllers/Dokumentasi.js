import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getDokumentasi = async (req, res) => {
    try {
        const response = await prisma.dokumentasi.findMany({
            select: {
                id: true,
                uuid: true,
                kegiatanName: true,
                imageKegiatan: true,
            },
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDokumentasiById = async (req, res) => {
    try {
        const dokumentasi = await prisma.dokumentasi.findUnique({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                uuid: true,
                kegiatanName: true,
                imageKegiatan: true
            }
        });
        if (!dokumentasi) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(dokumentasi);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDokumentasi = async (req, res) => {
    try {
        const { kegiatanName } = req.body;
        const imageKegiatan = req.file ? req.file.filename : '';

        const newDokumentasi = await prisma.dokumentasi.create({
            data: {
                uuid: uuidv4(),
                kegiatanName: kegiatanName,
                imageKegiatan: imageKegiatan,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(201).json({ msg: "Dokumentasi Created Successfully", dokumentasi: newDokumentasi });
    } catch (error) {
        console.error("Error creating dokumentasi:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateDokumentasi = async (req, res) => {
    try {
        const dokumentasi = await prisma.dokumentasi.findUnique({
            where: {
                uuid: req.params.id,
            },
        });

        if (!dokumentasi) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { kegiatanName } = req.body;
        let imageKegiatan = dokumentasi.imageKegiatan; // Default to the old image

        // Handle image update
        if (req.file) {
            const oldImagePath = path.join(process.cwd(), 'uploads', 'dokumentasi', dokumentasi.imageKegiatan); // Adjust the path as needed
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); // Delete the old image
            }
            imageKegiatan = req.file.filename; // Use the new image filename
        }

        const updatedDokumentasi = await prisma.dokumentasi.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                kegiatanName,
                imageKegiatan,
                updatedAt: new Date()
            },
        });

        res.status(200).json({ msg: "Data Dokumentasi berhasil diperbarui", dokumentasi: updatedDokumentasi });
    } catch (error) {
        console.error("Error updating dokumentasi:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteDokumentasi = async (req, res) => {
    try {
        const dokumentasi = await prisma.dokumentasi.findUnique({
            where: {
                uuid: req.params.id,
            },
        });

        if (!dokumentasi) {
            console.error("Data not found");
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Delete the image file from the uploads folder
        if (dokumentasi.imageKegiatan) {
            const imagePath = path.join(process.cwd(), 'uploads', 'dokumentasi', dokumentasi.imageKegiatan); // Adjust the path as needed
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Error deleting image ${dokumentasi.imageKegiatan}: ${err}`);
                    } else {
                        console.log(`Deleted image ${dokumentasi.imageKegiatan}`);
                    }
                });
            }
        }

        await prisma.dokumentasi.delete({
            where: {
                uuid: req.params.id,
            },
        });

        res.status(200).json({ msg: "Dokumentasi deleted successfully" });
    } catch (error) {
        console.error("Error deleting dokumentasi:", error);
        res.status(500).json({ msg: error.message });
    }
};
