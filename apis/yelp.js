const axios = require('axios');

const categories = async ()=>{

    const responseData = await axios.get('https://api.yelp.com/v3/categories', {
        headers: {
            'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        },
    }).then(response => {       
        return response.data.categories.map((c)=>c.alias).sort(() => Math.random() - 0.5).join();
    }).catch(error => {
        console.log(error);
        return error;
    });
    const responseDataFormatted = responseData;
    console.log(responseDataFormatted);
    return responseDataFormatted;
}   
const categoriesandaliases = async ()=>{

    const responseData = await axios.get('https://api.yelp.com/v3/categories', {
        headers: {
            'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
        },
    }).then(response => {       
        return response.data.categories;
    }).catch(error => {
        console.log(error);
        return error;
    });
    const responseDataFormatted = responseData;
    console.log(responseDataFormatted);
    return responseDataFormatted;
}   

const BusinessSearchByLocationCategories = async (location,categoriesString)=>
{
        const response =  axios
        .get(`https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=5&location=${encodeURIComponent(location)}&categories=${encodeURIComponent(categoriesString)}`,{
            headers: {
                accept: 'application/json',
                'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
            }})
        .then( (response)=> {
            
         return  response.data;
        })
        .catch((error)=> {
            console.error(error);
        });
        return  response;
}

const BusinessSearchByLocation = async (location)=>
{
        const response =  axios
        .get(`https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=5&location=${encodeURIComponent(location)}`,{
            headers: {
                accept: 'application/json',
                'Authorization': `Bearer ${process.env.YELP_API_KEY}`,
            }})
        .then( (response)=> {
            
         return  response.data;
        })
        .catch((error)=> {
            console.error(error);
        });
        return  response;
}


module.exports = {categories,BusinessSearchByLocationCategories,BusinessSearchByLocation,categoriesandaliases}

//AIzaSyCgeRubpcxw8fb1EeJulHtwlfMgr_HcQHw