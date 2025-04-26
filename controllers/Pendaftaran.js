import { PrismaClient } from '@prisma/client';
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
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
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
        } else {
            response = await prisma.pendaftaran.findMany({
                where: {
                    userId: req.userId
                },
                select: {
                    id: true,
                    uuid: true,
                    name: true,
                    rw: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    },
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
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPendaftaranById = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: {
                uuid: req.params.id,
            },
            select: {
                id: true,
                uuid: true,
                name: true,
                rw: true,
                 user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
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
        if (!pendaftaran) return res.status(404).json({ msg: "Data tidak ditemukan" });

        res.status(200).json(pendaftaran);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPendaftaran = async (req, res) => {
    const { name, rw, lombaId, categoryId } = req.body;
    try {
        const newPendaftaran = await prisma.pendaftaran.create({
            data: {
                uuid: crypto.randomUUID(),
                name: name,
                rw: rw,
                lombaId: lombaId,
                categoryId: categoryId,
                userId: req.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json({ msg: "Pendaftaran Created Successfully", pendaftaran: newPendaftaran });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updatePendaftaran = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: {
                uuid: req.params.id
            }
        });

        if (!pendaftaran) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { name, rw, lombaId, categoryId } = req.body;

        const updatedPendaftaran = await prisma.pendaftaran.update({
            where: {
                uuid: req.params.id,
            },
            data: {
                name,
                rw,
                lombaId,
                categoryId,
                updatedAt: new Date()
            }
        });
        res.status(200).json({ msg: "Pendaftaran updated successfully", pendaftaran: updatedPendaftaran });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePendaftaran = async (req, res) => {
    try {
        const pendaftaran = await prisma.pendaftaran.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!pendaftaran) return res.status(404).json({ msg: "Data tidak ditemukan" });

        await prisma.pendaftaran.delete({
            where: {
                uuid: req.params.id,
            }
        });
        res.status(200).json({ msg: "Pendaftaran deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export default {
    getPendaftaran,
    getPendaftaranById,
    createPendaftaran,
    updatePendaftaran,
    deletePendaftaran,
};
