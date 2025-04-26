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
        let parsedCategoryId;

         if (Array.isArray(categoryId)) {
            parsedCategoryId = categoryId;
        } else {
            try {
                parsedCategoryId = JSON.parse(categoryId);
            } catch (error) {
                console.error("Error parsing categoryId in createDashboard:", error);
                return res.status(400).json({ msg: "Invalid categoryId format" });
            }
        }

        const imageUrl = req.file ? req.file.filename : '';

        const newDashboard = await prisma.dashboard.create({
            data: {
                uuid: uuidv4(),
                lombaId: parseInt(lombaId),
                imageUrl: imageUrl,
                categoryId: parsedCategoryId,
                aturanLomba: aturanLomba,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(201).json({ msg: "Dashboard Created Successfully", dashboard: newDashboard });
    } catch (error) {
        console.error("Error in createDashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};

export const updateDashboard = async (req, res) => {
    try {
        const dashboard = await prisma.dashboard.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!dashboard) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        const { lombaId, aturanLomba } = req.body;
        let { categoryId } = req.body;

        // Handle multiple categoryIds
        if (!Array.isArray(categoryId)) {
            try {
                categoryId = JSON.parse(categoryId);
            } catch (error) {
                console.error("Error parsing categoryId:", error);
                return res.status(400).json({ msg: "Invalid categoryId format" });
            }
        }

        let imageUrl = dashboard.imageUrl; // Default to old image

        // Handle image update
        if (req.file) {
            const imagePath = path.join(process.cwd(), 'uploads', dashboard.imageUrl); // Adjust 'uploads' as needed
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete old image
            }
            imageUrl = req.file.filename; // Use new image filename
        }

        const updatedDashboard = await prisma.dashboard.update({
            where: {
                uuid: req.params.id
            },
            data: {
                lombaId: parseInt(lombaId),
                imageUrl: imageUrl,
                categoryId: categoryId,
                aturanLomba: aturanLomba,
                updatedAt: new Date()
            }
        });

        res.status(200).json({ msg: "Data Dashboard berhasil diperbarui", dashboard: updatedDashboard });
    } catch (error) {
        console.error("Error in updateDashboard:", error);
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

