

const axios = require("axios");


const GetBusinessURL = async(url)=>{
 
    const params = { url: url }
    
    const response = axios.get("https://pyyelp.onrender.com", { params })
   // const response = axios.get("http://localhost:5000", { params })
    .then(response => {            
        return response.data;

    })
    .catch(error => {
        console.log(error);
    });
    return  response;
}
module.exports = {GetBusinessURL};