const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const seed = async () => {
    try {
        console.log('Seeding data...');
        
        // Create Admin/User
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash('password123', salt);
        
        await db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            ['Demo Student', 'student@cumail.in', pass, 'student']
        );
        
        // Create some clubs
        const clubs = [
            ['Mozilla Campus Club', 'Open source and web tech.', 'Technical', '#7C3AED'],
            ['Google Developer Groups', 'Google technologies and cloud.', 'Technical', '#10B981'],
            ['Cultural Squad', 'Music, dance, and arts.', 'Cultural', '#EA580C']
        ];
        
        for (const [name, desc, cat, color] of clubs) {
            await db.query(
                'INSERT INTO clubs (name, description, category, accent_color) VALUES ($1, $2, $3, $4)',
                [name, desc, cat, color]
            );
        }

        console.log('Seeding completed successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seed();
