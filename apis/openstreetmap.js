const axios = require('axios');

const openstreetmap = async(zip_code)=>{

    //const zip_code = '90210';
    //street
    //city
    //county
    //state
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zip_code}&country=united states&format=json`;
    console.log(url);
    console.log(`http://localhost:3002/ziptolatlon?zip=${zip_code}`);
       var response =  await axios(url)
        .then(result =>{
            console.log(zip_code);
            if(result.data.length()>0){

                const latitude = result.data[0]['lat'];
                const longitude = result.data[0]['lon'];
                const boundingbox = result.data[0]['boundingbox']
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                return {Latitude: latitude, Longitude: longitude,boundingbox:boundingbox};    
            }
            else
            {
                return {Latitude: "N/A", Longitude: "N/A",boundingbox:"N/A"};   
            }
        }).catch(error=> {return {Latitude: "N/A", Longitude: "N/A",boundingbox:"N/A"}});    
        return await response;
       
}

module.exports=openstreetmap;