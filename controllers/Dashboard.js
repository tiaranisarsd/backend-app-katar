import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getDashboard = async (req, res) => {
    try {
        const response = await prisma.dashboard.findMany({
            select: {
                id: true,
                uuid: true,
                imageUrl: true,
                aturanLomba: true,
                categoryId: true,
                lomba: {
                    select: {
                        id: true,
                        lombaName: true
                    }
                }
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("Error in getDashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const getDashboardById = async (req, res) => {
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                uuid: true,
                imageUrl: true,
                aturanLomba: true,
                categoryId: true,
                lomba: {
                    select: {
                        id: true,
                        lombaName: true
                    }
                }
            }
        });
        if (!dashboard) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(dashboard);
    } catch (error) {
        console.error("Error in getDashboardById:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const createDashboard = async (req, res) => {
    try {
        const { lombaId, categoryId, aturanLomba } = req.body;
        const imageUrl = req.file ? req.file.path : ''; // Cloudinary URL

        if (!lombaId || !categoryId || !aturanLomba) {
            return res.status(400).json({ msg: "Semua field wajib diisi" });
        }

        const newDashboard = await prisma.dashboard.create({
            data: {
                uuid: uuidv4(),
                lombaId: parseInt(lombaId),
                categoryId: parseInt(categoryId),
                imageUrl: imageUrl,
                aturanLomba: aturanLomba,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(201).json({ msg: "Dashboard Created Successfully", dashboard: newDashboard });
    } catch (error) {
        console.error("Error creating dashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};


export const updateDashboard = async (req, res) => {
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: {
                uuid: req.params.id,
            },
        });

        if (!dashboard) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { lombaId, categoryId, aturanLomba } = req.body;
        let imageUrl = dashboard.imageUrl; // Default to the old image

        // Handle image update with Cloudinary
        if (req.file) {
            // Delete old image from Cloudinary if exists
            if (dashboard.imageUrl) {
                const publicId = dashboard.imageUrl.split('/').pop().split('.')[0];
                cloudinary.v2.uploader.destroy(publicId, (err, result) => {
                    if (err) {
                        console.error('Error deleting image from Cloudinary:', err);
                    } else {
                        console.log('Old image deleted from Cloudinary:', result);
                    }
                });
            }

            imageUrl = req.file.path; // Cloudinary URL
        }

        const updatedDashboard = await prisma.dashboard.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                uuid: uuidv4(),
                lombaId: parseInt(lombaId),
                imageUrl: imageUrl,
                categoryId: parseInt(categoryId),
                aturanLomba: aturanLomba,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        });

        res.status(200).json({ msg: "Data Dashboard berhasil diperbarui", dashboard: updatedDashboard });
    } catch (error) {
        console.error("Error updating dashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};


export const deleteDashboard = async (req, res) => {
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!dashboard) {
            console.error("Data not found");
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Delete associated image file
        if (dashboard.imageUrl) {
            const imagePath = path.join(process.cwd(), 'uploads', dashboard.imageUrl); // Adjust 'uploads' path if necessary
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Error deleting image ${dashboard.imageUrl}: ${err}`);
                    } else {
                        console.log(`Deleted image ${dashboard.imageUrl}`);
                    }
                });
            }
        }

        await prisma.dashboard.delete({
            where: {
                uuid: req.params.id,
            }
        });

        res.status(200).json({ msg: "Dashboard deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};

