const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs').promises;

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

  .set('view engine', 'ejs')

  .get('/adminpanel', async (req, res) => {
    try {

      //booking enquiry
      const contact = await pool.query('SELECT * FROM contact_us');
      const price = await pool.query('SELECT * FROM booking');
      const usersp = price.rows;
      const first_name = price.rows.map(row => row.first_name);
      const last_name = price.rows.map(row => row.last_name);
      const number = price.rows.map(row => row.number);
      const emailp = price.rows.map(row => row.email);
      const plan = price.rows.map(row => row.plan);
      const description = price.rows.map(row => row.description);
      console.log(usersp);
      console.log(first_name);
      console.log(last_name);
      console.log(number);
      console.log(emailp);
      console.log(plan);
      console.log(description);


      //enquiry variables
      const users = contact.rows;
      const name = contact.rows.map(row => row.name);
      const email = contact.rows.map(row => row.email);
      const subject = contact.rows.map(row => row.subject);


      const htmlPath = path.join(__dirname, 'public', 'adminPanel.html');
      let html = await fs.readFile(htmlPath, 'utf8');

      let userDataHtml = '';
      users.forEach((user, index) => {
        userDataHtml += `<p>{{name${index + 1}}}</p>`;
        userDataHtml += `<p>{{email${index + 1}}}</p>`;
        userDataHtml += `<p>{{subject${index + 1}}}</p>`;
      });

      let userpDataHtml = '';
      usersp.forEach((user, index) => {
        userpDataHtml += `<p>{{first_name${index + 1}}}</p>`;
        userpDataHtml += `<p>{{last_name${index + 1}}}</p>`;
        userpDataHtml += `<p>{{number${index + 1}}}</p>`;
        userpDataHtml += `<p>{{emailp${index + 1}}}</p>`;
        userpDataHtml += `<p>{{plan${index + 1}}}</p>`;
        userpDataHtml += `<p>{{description ${index + 1}}}</p>`;
      });

      usersp.forEach((usersp, index) => {
        html = html.replace(`{{first_name${index + 1}}}`, usersp.first_name);
        html = html.replace(`{{last_name${index + 1}}}`, usersp.last_name);
        html = html.replace(`{{emailp${index + 1}}}`, usersp.email);
        html = html.replace(`{{number${index + 1}}}`, usersp.number);
        html = html.replace(`{{plan${index + 1}}}`, usersp.plan);
        html = html.replace(`{{description${index + 1}}}`, usersp.description);
      });

      users.forEach((user, index) => {
        html = html.replace(`{{name${index + 1}}}`, user.name);
        html = html.replace(`{{email${index + 1}}}`, user.email);
        html = html.replace(`{{subject${index + 1}}}`, user.subject);
      });

      res.send(html);
    }


    catch (err) {
      console.error('Error fetching or rendering data:', err);
      res.status(500).send('Error fetching or rendering data');
    }
  })



  .listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
