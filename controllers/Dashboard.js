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
                lomba: {
                    select: {
                        id: true,
                        lombaName: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        categoryName: true
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
        const dashboard = await prisma.dashboard.findFirst({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                uuid: true,
                imageUrl: true,
                aturanLomba: true,
                lomba: {
                    select: {
                        id: true,
                        lombaName: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        categoryName: true
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

        const parsedLombaId = parseInt(lombaId);
        const parsedCategoryId = parseInt(categoryId);
    
        // Ensure the ids are valid integers
        if (isNaN(parsedLombaId) || isNaN(parsedCategoryId)) {
            setMsg("ID lomba atau kategori tidak valid.");
            return;
        }
    
        
        if (!lombaId || !categoryId || !aturanLomba) {
            return res.status(400).json({ msg: "Semua field wajib diisi" });
        }

        const newDashboard = await prisma.dashboard.create({
            data: {
                uuid: uuidv4(),
                lomba: {
                    connect: {
                        id: parsedLombaId,
                    },
                },
                category: {
                    connect: {
                        id: parsedCategoryId,
                    },
                },
                imageUrl: imageUrl,
                aturanLomba: aturanLomba,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        res.status(201).json({ msg: "Dashboard Created Successfully", dashboard: newDashboard });
    } catch (error) {
        console.error("Error creating dashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};



export const updateDashboard = async (req, res) => {
    try {
        const dashboard = await prisma.dashboard.findFirst({
            where: {
                uuid: req.params.id,
            },
        });

        if (!dashboard) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { lombaId, categoryId, aturanLomba } = req.body;
        let imageUrl = dashboard.imageUrl;

        const parsedLombaId = lombaId ? parseInt(lombaId, 10) : null;
        const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : null;

        if (req.file) {
            if (dashboard.imageUrl) {
                try {
                    const publicId = dashboard.imageUrl.split('/').pop().split('.')[0];
                    const result = await cloudinary.v2.uploader.destroy(publicId);
                    console.log('Old image deleted from Cloudinary:', result);
                } catch (err) {
                    console.error('Error deleting image from Cloudinary:', err);
                }
            }

            imageUrl = req.file.path;
        }

        const updatedDashboard = await prisma.dashboard.update({
            where: {
                id: dashboard.id
            },
            data: {
                // uuid: uuidv4(),  // Sebaiknya jangan di-update jika ini identifier tetap
                lombaId: parsedLombaId,
                imageUrl: imageUrl,
                categoryId: parsedCategoryId,
                aturanLomba: aturanLomba,
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
        const dashboard = await prisma.dashboard.findFirst({
            where: {
                uuid: req.params.id
            }
        });

        if (!dashboard) {
            console.error("Data not found");
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

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
                id: dashboard.id,
            }
        });

        res.status(200).json({ msg: "Dashboard deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDashboard:", error);
        res.status(500).json({ msg: error.message });
    }
};

