import prisma from "../lib/prisma.js";



export const createReview = async (req, res) => {
    try {
        const { name, email, review, isApproved } = req.body;
        console.log(name, email, review, isApproved);
        const newReview = await prisma.review.create({
            data: {
                name,
                email,
                review,
                isApproved,
            },
        });
        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Failed to create review" });
    }
};


export const getAllReviews = async (req, res) => {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await prisma.review.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json(deletedReview);
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Failed to delete review" });
    }
};

export const approveReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        // Проверяем, что isApproved является булевым значением
        if (typeof isApproved !== 'boolean') {
            return res.status(400).json({ error: 'isApproved must be a boolean value' });
        }

        // Обновляем отзыв
        const updatedReview = await prisma.review.update({
            where: {
                id: id,
            },
            data: {
                isApproved: isApproved,
            },
        });

        res.status(200).json(updatedReview);
    } catch (error) {
        console.error("Error approving review:", error);
        res.status(500).json({ error: "Failed to approve review" });
    }
};