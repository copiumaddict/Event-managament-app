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

// async function fetchDataOrderedById() {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     return result.rows.map(row => row.name);
//   } catch (err) {
//     console.error('Error executing query', err.stack);
//     return [];
//   }
// }

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
      const result = await pool.query('SELECT * FROM contact_us');
      const users = result.rows;
      const name = result.rows.map(row => row.name);
      const email = result.rows.map(row => row.email);
      const subject = result.rows.map(row => row.subject);
      console.log(name);
      console.log(email);
      console.log(subject);

      const htmlPath = path.join(__dirname, 'public', 'adminPanel.html');
      let html = await fs.readFile(htmlPath, 'utf8');

      let userDataHtml = '';
      users.forEach((user, index) => {
        userDataHtml += `<p>{{name${index + 1}}}</p>`;
        userDataHtml += `<p>{{email${index + 1}}}</p>`;
        userDataHtml += `<p>{{subject${index + 1}}}</p>`;
      });

      users.forEach((user, index) => {
        html = html.replace(`{{name${index + 1}}}`, user.name);
        html = html.replace(`{{email${index + 1}}}`, user.email);
        html = html.replace(`{{subject${index + 1}}}`, user.subject);
      });

      // Replace placeholder in HTML with fetched data
      // html = html.replace(/{{name}}/g, name.map(text => `<p>${text}</p>`).join(''));
      // html = html.replace(/{{email}}/g, email.map(text => `<p>${text}</p>`).join(''));

      // Send the modified HTML as response
      res.send(html);
    }

    // res.sendFile(path.join(__dirname, '/public', 'adminPanel.html'));
    // res.send(textData);
    //   let html = '/adminpanel.html';
    //   textData.forEach(text => {
    //     html += `<li>${text}</li>`;
    //   });
    //   html += `
    //     </ul>
    //   </body>
    //   </html>
    // `;
    //   res.send(html);
    catch (err) {
      console.error('Error fetching or rendering data:', err);
      res.status(500).send('Error fetching or rendering data');
    }
  })
  // const users = pool.query('SELECT * FROM contact_us;', (err, result) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send('Error');
  //   }
  //   else {
  //     res.send(result.rows);
  //   }
  // })


  .listen(port, () => console.log(`Server listening on port http://localhost:${port}`));

// export default TextData;