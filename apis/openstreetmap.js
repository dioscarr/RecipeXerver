const axios = require('axios');

const openstreetmap = async(zip_code)=>{

    //const zip_code = '90210';
    //street
    //city
    //county
    //state
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zip_code}&country=united states&format=json`;
    
        const response = await axios(url)
        .then(result =>{
            const latitude = result.data[0]['lat'];
            const longitude = result.data[0]['lon'];
            const boundingbox = result.data[0]['boundingbox']
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            return {Latitude: latitude, Longitude: longitude,boundingbox:boundingbox};    
        });    

        return response;
}

module.exports=openstreetmap;