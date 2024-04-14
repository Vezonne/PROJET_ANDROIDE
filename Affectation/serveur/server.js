const express = require('express');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const bodyParser = require('body-parser');

const projetRoutes = require('./routes/projetRoutes');

const app = express();
app.use(bodyParser.json());

// pour avoir tous les projets
app.use('/api/projets', projetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});


app.get('/', (req, res) => {
    console.log('OK DANS LE BACK')
    res.send('RESEND DANS LE FRONT')
  })