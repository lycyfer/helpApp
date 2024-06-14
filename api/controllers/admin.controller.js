import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


export const register = async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password)
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        const newUser = await prisma.adminUser.create({
            data: {
                username: username,
                password: hashedPassword,
            },
        });

        console.log(newUser);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const age = 1000 * 60 * 60 * 24 * 7; // время жизни токена в миллисекундах (1 неделя)

        const adminUser = await prisma.adminUser.findUnique({
            where: {
                username: username
            },
        });

        if (!adminUser) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, adminUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: adminUser.id,
                isAdmin: true,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: age }
        );

        const { password: adminPassword, ...adminInfo } = adminUser;

        res
            .cookie("token", token, {
                httpOnly: true,
                maxAge: age,
            })
            .status(200)
            .json(adminInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "logout success" });
};