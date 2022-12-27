require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const openai = require('./openai');
const cors = require('cors');

const app = express()

app.use(cors());

app.use(bodyParser.json());
app.get('/openai', async (req, res) => {

  const input = req.query.input;
  const responseText = await openai.getOpenAIresponse(input);
  res.send(responseText);
});

app.post('/openai', async (req, res) => {

  const input = req.query.input;
  console.log(req.query.input)
  const responseText = await openai.getOpenAIresponse(input);
  res.send(responseText);
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('http://localhost:3000/openai');
});

