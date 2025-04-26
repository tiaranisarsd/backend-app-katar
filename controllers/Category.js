import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getCategory = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                uuid: true,
                categoryName: true,
                lombaId: true
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Data tidak ditemukan" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createCategory = async (req, res) => {
    const { categoryName, lombaId } = req.body;
    try {
        const newCategory = await prisma.category.create({
            data: {
                categoryName,
                lombaId: parseInt(lombaId),
                uuid: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json({ msg: "Category Created Successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const updateCategory = async (req, res) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Data tidak ditemukan" });

        const { categoryName } = req.body;
        const updatedCategory = await prisma.category.update({
            where: {
                uuid: req.params.id,
            },
            data: { 
                categoryName,
                updatedAt: new Date()
             }
        });
        res.status(200).json({ msg: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await prisma.category.findUnique({
            where: {
                uuid: req.params.id
            }
        });
        if (!category) return res.status(404).json({ msg: "Data tidak ditemukan" });
        await prisma.category.delete({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getCategoryByLomba = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                lombaId: parseInt(req.params.lombaId)
            }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}
