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
  const state = req.query.state??"NY";
  const limit = req.query.limit??20;
  const location =uscities.Cities.getCitiesOfState("US",state).map((x)=>`${x.name} ${x.stateCode}`);
  const categories1 =  await yelp.categories();
  const categories = categories1.split(",").sort(function() {
    return 0.5 - Math.random();
  }).slice(0,2).join();

   Promise.all( location.slice(0,limit>20?20:limit)
          .map(async (locationX) => await yelp.BusinessSearchByLocationCategories(locationX,categories)
          .then(async(data)=> {
            if( data !=undefined && data !=="undefined" && data != null)
            {
                const business =data.businesses[0];
                  const returnData = data.businesses.map((business)=>business.url);      
                  return await pyYelp.GetBusinessURL(returnData[0]?.split("=")[0])
                  .then((data)=> 
                  {
                      if(data!= undefined && data!=="N/A")
                      {
                        const decodedUrl = decodeURIComponent(data); 
                       
                        var domain = decodedUrl?.replace("&cachebuster","")?.split("=")[1]??decodedUrl;
                        const url = new URL(domain);
                         domain = (url.protocol + '//' + url.host);                                           
                       
                        if(domain ==undefined && domain ==="undefined")
                          domain = decodedUrl
                        console.log({name:returnData.name,phone:returnData.phone,url:domain,citystate:locationX,categories:categories,review_count:returnData.review_count}); 
                      return {name:business.name,phone:business.phone,url:domain,citystate:locationX,categories:business.categories.map(x=>x.title).join(),review_count:business.review_count};
                        // if(domain != undefined && domain!=="undefined" && domain!=null)
                        //   return gpSpeed.run(`https://www.${domain}`);
                      }
                      else
                      {
                        return {name:'',phone:'',url:'',citystate:'',categories:'',review_count:0};
                      }
                });
            }
            else{
              return "";
            }
          })
        ))
        .then(data=>res.json(data))
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
  console.log('http://localhost:3000/GenerateImage');
  console.log('http://localhost:3000/BusinessSearchByLocationCategories?limit=1&state=NY');
  console.log('http://localhost:3000/BusinessSearch');
  console.log('https://recipexerver.onrender.com/BusinessSearch?limit=50&state=NY');
  console.log('https://recipexerver.onrender.com/uscities');
  console.log('https://recipexerver.onrender.com/yelp/categories');
  console.log('https://recipexerver.onrender.com/BusinessSearchByLocationCategories?limit=3&state=NY');
});
