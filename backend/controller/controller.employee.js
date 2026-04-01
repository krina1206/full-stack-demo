import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../postgresql/models/employee.model.js';
import RoleMaster from '../postgresql/models/roleMaster.model.js';
import User from '../mongodb/models/user.model.js';

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            where: {
                is_active: true,
                is_delete: false
            },
            order: [['id', 'DESC']]
        });
        return employees;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleMaster.findAll();      
        return roles;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ 
            where: { id, is_active: true, is_delete: false } 
        });
        if (!employee) {
            return null;
        }
        return employee;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addEmployee = async (req, res) => {
    try {
        const { name, division, roles } = req.body;
        const addedEmployee = await Employee.create({
            name,
            division,
            roles,
        });
        return addedEmployee;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const editEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, division, roles } = req.body;
        
        const [updatedRows] = await Employee.update(
            { name, division, roles },
            { where: { id, is_active: true, is_delete: false } }
        );

        if (updatedRows === 0) {
            return null;
        }

        const updatedEmployee = await Employee.findByPk(id);
        return updatedEmployee;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteEmployees = async (req, res) => {
    try {
        const { id } = req.body;
        const [updatedRows] = await Employee.update(
            { is_active: false, is_delete: true },
            { where: { id, is_active: true, is_delete: false } }
        );

        if (updatedRows === 0) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Authentication Logic (MongoDB)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_default_jwt_secret', {
            expiresIn: '1h'
        });

        return res.status(200).json({ 
            message: 'Login successful',
            user: { id: user._id, email: user.email, name: user.name },
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error during login' });
    }
}

// Signup (MongoDB) for testing
const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in MongoDB
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name
        });

        return res.status(201).json({ 
            message: 'User created successfully',
            user: { id: newUser._id, email: newUser.email, name: newUser.name }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error during signup' });
    }
}

export default {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    editEmployee,
    deleteEmployees,
    getAllRoles,
    login,
    signup
}