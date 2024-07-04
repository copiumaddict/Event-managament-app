const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;



const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database1',
    password: 'password',
    port: 5432, // Default port for PostgreSQL
});



app
    .use(express.static('public'))
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())

    .post('/contactForm', (req, res) => {
        const { name, email, number, subject, message } = req.body;
        pool.query('INSERT INTO contact_us (name, email, number, subject, message) VALUES ($1, $2, $3, $4, $5)', [name, email, number, subject, message])
        res.send(`
            <script>
              alert('Contact information sent!');
              window.location.href = '/contact us.html'; // Redirect to the desired page
            </script>
          `);
    })


    .post('/bookingForm', (req, res) => {
        const { first_name, last_name, email, number, address, description, price } = req.body;
        pool.query('INSERT INTO booking (first_name, last_name, email, number, address, description, plan) VALUES ($1, $2, $3, $4, $5, $6, $7)', [first_name, last_name, email, number, address, description, price])
        res.send(`
            <script>
              alert('Booking Done successfully.');
              window.location.href = '/price.html'; // Redirect to the desired page
            </script>
          `);
    })

    .listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
