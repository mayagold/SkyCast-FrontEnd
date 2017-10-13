// MODELS, DEPENDENCIES

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const PORT        = process.env.PORT || 2045;
const darksky     = process.env.DARK_SKY_API_KEY;

// MIDDLEWARE

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// LISTENER

app.listen(PORT, ()=>{
  console.log('Hello Bluewolf! SkyCast Weather App is listening on PORT', PORT, ' - Maya');
})
