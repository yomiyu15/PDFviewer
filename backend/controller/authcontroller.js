const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../db'); // Assume a separate db.js file exports the client

// User registration endpoint
exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING id';
    const values = [username, hashedPassword];

    try {
        const result = await client.query(query, values);
        res.status(201).send(`User registered successfully! User ID: ${result.rows[0].id}`);
    } catch (dbError) {
        console.error('Error registering user', dbError);
        res.status(500).send('Error registering user');
    }
};

// User login endpoint
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = await client.query(query, [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (dbError) {
        console.error('Error logging in', dbError);
        res.status(500).send('Error logging in');
    }
};
