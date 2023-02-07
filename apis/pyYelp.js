

const axios = require("axios");


const GetBusinessURL = async(url)=>{
 
    const params = { url: url }
    
    const response = axios.get("https://pyyelp.onrender.com", { params })
    //const response = await axios(`http://localhost:5000?url=${url}`)
    .then(response => {            
        return response.data;

    })
    .catch(error => {
        console.log(error);
    });
    return  response;
}
module.exports = {GetBusinessURL};