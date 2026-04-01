import sequelize from './postgresql/config.js';
import connectMongoDB from './mongodb/config.js';
import RoleMaster from './postgresql/models/roleMaster.model.js';
import User from './mongodb/models/user.model.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        await connectMongoDB();
        await sequelize.sync({ alter: true });

        // Seed Roles (PostgreSQL)
        const roles = [
            { name: 'Admin' },
            { name: 'Manager' },
            { name: 'Employee' }
        ];

        for (const role of roles) {
            await RoleMaster.findOrCreate({
                where: { name: role.name },
                defaults: role
            });
        }
        console.log('Roles seeded/verified in PostgreSQL');

        // Seed Test User (MongoDB)
        const testUserEmail = 'admin@example.com';
        const existingUser = await User.findOne({ email: testUserEmail });
        
        if (!existingUser) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            await User.create({
                email: testUserEmail,
                password: hashedPassword,
                name: 'System Admin'
            });
            console.log('Test user created in MongoDB: admin@example.com / password123');
        } else {
            console.log('Test user already exists');
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
