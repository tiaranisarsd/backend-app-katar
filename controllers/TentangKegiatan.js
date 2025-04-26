import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import fs from 'fs';
import path from 'path';

export const getTentangKegiatan = async (req, res) => {
    try {
        const response = await prisma.tentang_kegiatan.findMany({
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
        const tentang_kegiatan = await prisma.tentang_kegiatan.findUnique({
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
        if (!tentang_kegiatan) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(tentang_kegiatan);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTentangKegiatan = async (req, res) => {
    try {
        const { judulKegiatan, tanggal, keterangan } = req.body;
        
        // Upload image to Cloudinary if exists
        let imageUrl = '';
        if (req.file) {
            imageUrl = req.file.path; // This contains the Cloudinary URL
        }

        const newTentangKegiatan = await prisma.tentang_kegiatan.create({
            data: {
                uuid: crypto.randomUUID(),
                judulKegiatan: judulKegiatan,
                image: imageUrl,  // Save the Cloudinary image URL
                tanggal: tanggal,
                keterangan: keterangan,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(201).json({ msg: "Tentang Kegiatan Created Successfully", tentang_kegiatan: newTentangKegiatan });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const updateTentangKegiatan = async (req, res) => {
    try {
        const tentang_kegiatan = await prisma.tentang_kegiatan.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!tentang_kegiatan) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { judulKegiatan, tanggal, keterangan } = req.body;
        let image = tentang_kegiatan.image; // Keep the old image if no new image is uploaded

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete the old image from Cloudinary if it exists
            if (tentang_kegiatan.image) {
                const publicId = tentang_kegiatan.image.split('/').pop().split('.')[0]; // Extract public ID from the URL
                cloudinary.v2.uploader.destroy(publicId, (err, result) => {
                    if (err) {
                        console.error('Error deleting image from Cloudinary:', err);
                    } else {
                        console.log('Old image deleted from Cloudinary:', result);
                    }
                });
            }

            // Upload the new image to Cloudinary and get the URL
            image = req.file.path;  // Cloudinary URL
        }

        const updatedTentangKegiatan = await prisma.tentang_kegiatan.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                judulKegiatan,
                image: image, // Save the new Cloudinary image URL
                tanggal,
                keterangan,
                updatedAt: new Date()
            }
        });

        res.status(200).json({ msg: "Tentang Kegiatan updated successfully", tentang_kegiatan: updatedTentangKegiatan });
    } catch (error) {
        console.error("Error in updating tentang_kegiatan:", error);
        res.status(500).json({ msg: error.message });
    }
};


export const deleteTentangKegiatan = async (req, res) => {
    try {
        const tentang_kegiatan = await prisma.tentang_kegiatan.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!tentang_kegiatan) {
            console.error("Data not found");
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        // Hapus file gambar dari folder uploads/tentang_kegiatan
        const imagePath = path.join(process.cwd(), 'uploads/tentang_kegiatan', tentang_kegiatan.image);
        if (fs.existsSync(imagePath)) {
             fs.unlinkSync(imagePath);
        }

        await prisma.tentang_kegiatan.delete({
            where: {
                uuid: req.params.id,
            }
        });

        res.status(200).json({ msg: "Tentang Kegiatan deleted successfully" });
    } catch (error) {
        console.error("Error in deletetentang_kegiatan:", error);
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
