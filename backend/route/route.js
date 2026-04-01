
import express from 'express';
import employeeController from '../controller/controller.employee.js';
import verifyToken from '../middleware/middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get("/employees", async (req, res) => {
    try {
        const response = await employeeController.getAllEmployees(req, res);
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/roles", async (req, res) => {
    try {
        const response = await employeeController.getAllRoles(req, res);
        res.status(200).json({ data: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/addemployees", async (req, res) => { 
    try {
        const response = await employeeController.addEmployee(req, res);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/editemployees/:id", async (req, res) => { 
    try {
        const response = await employeeController.editEmployee(req, res);
        if (!response) return res.status(404).json({ error: "Employee not found" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/deleteemployees", async (req, res) => {
    try {
        const response = await employeeController.deleteEmployees(req, res);
        if (!response) return res.status(404).json({ error: "Employee not found" });
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/employees/:id", async (req, res) => {
    try {
        const response = await employeeController.getEmployeeById(req, res);
        if (!response) return res.status(404).json({ error: "Employee not found" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth Routes
router.post("/login", employeeController.login);
router.post("/signup", employeeController.signup);

export default router;