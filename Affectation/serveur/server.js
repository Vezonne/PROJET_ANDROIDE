const express = require('express');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const projetRoutes = require('./routes/projetRoutes');

const app = express();


app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// pour avoir tous les projets
app.use('/api/projets', projetRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});


app.get('/', (req, res) => {
    console.log('OK DANS LE BACK')
    res.send('RESEND DANS LE FRONT')
  })