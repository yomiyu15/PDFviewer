const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
    user: 'postgres', // Replace with your database username
    host: 'localhost',
    database: 'Product2', // Replace with your database name
    password: 'yoomii0929', // Replace with your database password
    port: 5432, // Default PostgreSQL port
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err.stack));

// Export the client for use in other files
module.exports = client;
