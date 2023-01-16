require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const openai = require('./openai');
const uscities = require('./uscities');
const yelp = require('./apis/yelp');
const pyYelp = require('./apis/pyYelp');
const gpSpeed = require('./apis/googleSpeedPage');
const GenerateImage = require('./apis/bytoImage');
const cors = require('cors');

const app = express()

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.get('/GenerateImage', async (req, res) => {

 GenerateImage.GenerateImage();
  res.send("done!");
});
app.get('/uscities', async (req, res) => {
  const input = req.query.input;
  
  const formattedcities =uscities.Cities.getCitiesOfCountry("US").map((x)=>`${x.name} ${x.stateCode}`);
  res.send(formattedcities);
});

app.get('/BusinessSearch', async (req, res) => {
  const state = req.query.state??"NY";
  const limit = req.query.limit??50;
  const location =uscities.Cities.getCitiesOfState("US",state).map((x)=>`${x.name} ${x.stateCode}`);
  const categories =  await yelp.categories()
   Promise.all( location.slice(0,limit>50?20:limit)
          .map(async (locationX) => await yelp.BusinessSearchByLocation(locationX)
          .then(async(data)=> {
            return data;
          })
        ))
        .then(data=>res.json(data))
});
app.get('/BusinessSearchByLocationCategories', async (req, res) => {
  try {
    const state = req.query.state ?? "NY";
    const limit = req.query.limit ?? 20;
    const location = req.query.location;
    const category = req.query.category;

    // Get business data from Yelp API
    const yelpData = await yelp.BusinessSearchByLocationCategories(location, category);

    // Check if data is valid
    if (!yelpData || !yelpData.businesses) {
      throw new Error("Invalid data received from Yelp API");
    }

    // Get URLs of businesses
    const businessUrls = yelpData.businesses.map((business) => business.url);

    // Get additional business data from pyYelp API
    const businessData = await Promise.all(
      businessUrls.map(async (url) => {
        const business = yelpData.businesses.find((b) => b.url === url);
        const decodedUrl = decodeURIComponent(await pyYelp.GetBusinessURL(url.split("=")[0]));
        var domain = decodedUrl ?.replace("&cachebuster", "")?.split("=")[1] ?? decodedUrl;
        const url1 = new URL(domain);
        domain = (url1.protocol + '//' + url1.host);
        if(domain ==undefined && domain ==="undefined")
         domain = decodedUrl
        //console.log({name:returnData.name,phone:returnData.phone,url:domain,citystate:location,categories:business.categories.map(x=>x.title).join(),review_count:returnData.review_count}); 
        return {
          name: business.name,
          phone: business.phone,
          url: domain,
          citystate: location,
          categories: business.categories.map((x) => x.title).join(),
          review_count: business.review_count,
          zip: business.location.zip_code,
          rating: business.rating,
        };
      })
    );

    // Send response to client
    res.json(businessData);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while processing the request");
  }
});


app.get('/yelp/categories', async (req, res) => {
  const input = req.query.input;

  const categories =  await yelp.categories()
  console.log(categories)
  res.send(categories);
});
app.get('/yelp/categoriesandaliases', async (req, res) => {
  const categories =  await yelp.categoriesandaliases()
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

app.listen(3002, () => {
  console.log('http://localhost:3000/openai');
  console.log('http://localhost:3000/uscities');
  console.log('http://localhost:3000/yelp/categories');
  console.log('http://localhost:3000/yelp/categoriesandaliases');
  console.log('http://localhost:3000/GenerateImage');
  console.log('http://localhost:3000/BusinessSearchByLocationCategories?limit=1&state=NY');
  console.log('http://localhost:3000/BusinessSearch');
  console.log('https://recipexerver.onrender.com/BusinessSearch?limit=50&state=NY');
  console.log('https://recipexerver.onrender.com/uscities');
  console.log('https://recipexerver.onrender.com/yelp/categories');
  console.log('https://recipexerver.onrender.com/yelp/categoriesandaliases');
  console.log('https://recipexerver.onrender.com/BusinessSearchByLocationCategories?limit=3&state=NY');
});
