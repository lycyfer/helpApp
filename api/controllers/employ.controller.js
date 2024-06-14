import prisma from "../lib/prisma.js";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

export const testController = async (req, res) => {
    console.log(req.body.photoUrls)
    try {
        const newEmployee = await prisma.employee.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: parseInt(req.body.age, 10),
                position: req.body.position,
                employeeHistory: req.body.employeeHistory,
                dateHired: new Date(req.body.dateHired),
                photoUrls: req.body.photoUrls
            }
        });

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ error: "Failed to create employee" });
    }
};

export const createEmployeeAccount = async (req, res) => {
    const { photoUrls, firstName, lastName, age, position, employeeHistory, dateHired, login, password, email, phoneNumber, department, role } = req.body;
    console.log(photoUrls)
    try {
        const newEmployeeAccount = await prisma.employeeAccount.create({
            data: {
                photoUrls,
                firstName,
                lastName,
                age,
                position,
                employeeHistory: {
                    create: employeeHistory
                },
                dateHired,
                login,
                password,
                email,
                phoneNumber,
                department,
                role,
                isActive: true,
                lastLogin: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        res.status(201).json(newEmployeeAccount);
    } catch (error) {
        console.error("Error creating employee account:", error);
        res.status(500).json({ error: "Failed to create employee account" });
    }
};

export const getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employeeAccount.findMany({
            include: {
                employeeHistory: true
            }
        });
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ error: "Failed to fetch employees" });
    }
};

export const allEmploy = async (req, res) => {
    try {

        const employee = await prisma.employee.findMany()
        console.log(employee)
        res.status(200).json(employee)
    } catch (error) {
        console.error("Error fetching all employees:", error);
        throw new Error("Failed to fetch all employees");
    }
};

export const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await prisma.employeeAccount.findUnique({
            where: {
                id: id
            },
            include: {
                employeeHistory: true
            }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee by ID:", error);
        res.status(500).json({ error: "Failed to fetch employee by ID" });
    }
};

export const loginEmployee = async (req, res) => {
    const { login, password } = req.body;

    try {
        const employee = await prisma.employeeAccount.findUnique({
            where: {
                login: login
            }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        if (employee.password !== password) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const updatedEmployee = await prisma.employeeAccount.update({
            where: {
                id: employee.id
            },
            data: {
                lastLogin: new Date()
            }
        });

        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Error during employee login:", error);
        res.status(500).json({ error: "Failed to login employee" });
    }
};


export const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {

        const deletedEmployee = await prisma.employee.delete({
            where: {
                id: id
            }
        });

        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully", employee: deletedEmployee });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "Failed to delete employee" });
    }
};

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, age, position, dateHired, login, password, email, phoneNumber, department, role, isActive, lastLogin } = req.body;
    const photoUrls = req.file ? req.file.path : undefined; // Путь к загруженному файлу

    try {
        const updatedEmployee = await prisma.employeeAccount.update({
            where: {
                id: id,
            },
            data: {
                photoUrls: photoUrls,
                firstName: firstName,
                lastName: lastName,
                login: login,
                password: password,
                email: email,
            },
        });

        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
};

export const updateEmployeePhoto = async (req, res) => {
    const { id } = req.params;
    const { photoUrl } = req.body;
    console.log(id, photoUrl);
    try {
        if (!photoUrl) {
            return res.status(400).json({ error: "no photo provider" });
        }

        // const photoUrlsArray = Array.isArray(photoUrl) ? photoUrl : [photoUrl];

        const updatedEmployee = await prisma.employeeAccount.update({
            where: {
                id: id,
            },
            data: {
                photoUrl: photoUrl, // Используем photoUrl из тела запроса
            },
        });
        res.status(200).json({ message: 'Employee photo updated successfully', employee: updatedEmployee });
    } catch (err) {
        console.error('Error updating employee photo:', err);
        res.status(500).json({ error: 'Failed to update employee photo' });
    }
};
export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "logout success" });
};

export const addApplicationToEmployee = async (req, res) => {
    const { employeeAccountId, applicationId } = req.body;
    console.log(applicationId)
    try {
        const employee = await prisma.employeeAccount.findUnique({
            where: { id: employeeAccountId }
        });
        const application = await prisma.application.findUnique({
            where: { id: applicationId }
        });

        if (!employee || !application) {
            return res.status(404).json({ error: "Employee or application not found" });
        }

        // Создание связи в EmployeeApplication
        const newApplicationLink = await prisma.employeeApplication.create({
            data: {
                employee: { connect: { id: employeeAccountId } },
                name: application.name,
                email: application.email,
                phone: application.phone,
                subject: application.subject,
                message: application.message,
                createdAt: application.createdAt,
            }
        });

        // Удаление заявки из Application
        await prisma.application.delete({
            where: { id: applicationId }
        });

        res.status(201).json(newApplicationLink);
    } catch (error) {
        console.error("Error adding application to employee:", error);
        res.status(500).json({ error: "Failed to add application to employee" });
    }
};

export const getAllEmployeeApplications = async (req, res) => {
    try {
        const employeeApplications = await prisma.employeeApplication.findMany({
            include: {
                employee: true,
                Employee: true
            }
        });
        console.log(employeeApplications);
        res.status(200).json(employeeApplications);
    } catch (error) {
        console.error("Error fetching employee applications:", error);
        res.status(500).json({ error: "Failed to fetch employee applications" });
    }
};

export const deleteApplicationsAndEmployeeApplications = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        // Удаление заявки по ID
        const deletedApplication = await prisma.employeeApplication.delete({
            where: {
                id: id,
            },
        });

        if (!deletedApplication) {
            return res.status(404).json({ error: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully', application: deletedApplication });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Failed to delete application' });
    }
};