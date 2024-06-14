import prisma from "../lib/prisma.js";

export const createApplication = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        console.log(name, email, phone, subject, message);
        const newApplication = await prisma.application.create({
            data: {
                name,
                email,
                phone,
                subject,
                message,
            },
        });
        res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Failed to create application" });
    }
};


export const getAllApplications = async (req, res) => {
    try {
        const applications = await prisma.application.findMany();
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ error: "Failed to fetch applications" });
    }
};


export const deleteApplication = async (req, res) => {
    // const applicationId = req.body;
    // console.log(applicationId)
    try {
        const applicationId = req.params.id;
        console.log(applicationId)
        if (!applicationId) {
            return res.status(400).json({ error: "Missing application ID" });
        }

        // Удаление заявки по ID
        const deletedApplication = await prisma.application.delete({
            where: {
                id: applicationId,
            },
        });

        if (!deletedApplication) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.status(200).json({ message: "Application deleted successfully", application: deletedApplication });
    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({ error: "Failed to delete application" });
    }
};