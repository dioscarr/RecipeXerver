require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const openai = require('./openai');
const uscities = require('./uscities');
const yelp = require('./apis/yelp');
const pyYelp = require('./apis/pyYelp');
const cors = require('cors');

const app = express()

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/uscities', async (req, res) => {
  const input = req.query.input;
  console.log(uscities.Cities.getCitiesOfCountry("US").map((x)=>`${x.name}, ${x.stateCode}`))
  const formattedcities =uscities.Cities.getCitiesOfCountry("US").map((x)=>`${x.name} ${x.stateCode}`);
  res.send(formattedcities);
});

app.get('/BusinessSearchByLocationCategories', async (req, res) => {
  const input = req.query.input;
  const location =uscities.Cities.getCitiesOfCountry("US").map((x)=>`${x.name} ${x.stateCode}`);
  const categories =  await yelp.categories()
   Promise.all( location.slice(0,20)
                                .map(async (locationX) => await yelp.BusinessSearchByLocationCategories(locationX,categories)
                                .then(async(data)=> {
                                  if( data !=undefined && data !=="undefined" && data != null)
                                  {
                                    returnData = data.businesses.map((business)=>business.url);      
                                    return await pyYelp.GetBusinessURL(returnData[0].split("=")[0])
                                                        .then((data)=> {
                                                          if(data!= undefined && data!=="N/A")
                                                          {

                                                            const decodedUrl = decodeURIComponent(data);       
                                                            var domain = decodedUrl?.replace("&cachebuster","").replace(/(https?:\/\/)(www\.)?/i, '')?.split('/')[1]?.split("=")[1]??decodedUrl;
                                                            if(domain ==undefined && domain ==="undefined")
                                                            domain = decodedUrl
                                                            console.log(domain); 
                                                            return domain
                                                          }
                                                        });
                                  }
                                })
                              )).then(data=>res.json(data))
    
   
});
app.get('/yelp/categories', async (req, res) => {
  const input = req.query.input;

  const categories =  await yelp.categories()
  console.log(categories)
  res.send(categories);
});

app.get('/openai', async (req, res) => {

  const input = req.query.input;
  const responseText = await openai.getOpenAIresponse(input);
  res.send(responseText);
});

app.post('/openai', async (req, res) => {

  const input = req.body.input;
  console.log(`input: ${input}`)
  const responseText = await openai.getOpenAIresponse(input);
  res.send(responseText);
  
});

app.post('/GetRecipeSuggestions', async (req, res) => {

  const input = req.body.input;
  console.log(`input: ${input}`)
  const responseText = await openai.GetRecipeSuggestions(input);
  res.send(responseText);
  
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('http://localhost:3000/openai');
  console.log('http://localhost:3000/uscities');
  console.log('http://localhost:3000/yelp/categories');
  console.log('http://localhost:3000/BusinessSearchByLocationCategories');
});

