import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/database.js";
import connectMongoDB from "./config/mongodb.js";
import employeeRoutes from "./route/route.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/",employeeRoutes);




// Connect Databases and start server
const startServer = async () => {
    try {
        await connectMongoDB();
        await sequelize.sync({ alter: true });
        console.log('PostgreSQL synced');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
};

startServer();
