const axios =require('axios')
const {encode, decode} = require('gpt-3-encoder')
async function getOpenAIresponse(input) {
    console.log("getOpenAIresponse")
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `${encoded(input)}\n`,
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        
      
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      console.log(`response: ${response.data.choices[0].text}`);
      return decode(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetRecipeSuggestions(input) {
    console.log("GetRecipeSuggestions")
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `${encoded(input)}`,
        model: "text-davinci-003",
        temperature: 0,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        
      
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      console.log(`response: ${decode(response.data.choices[0].text)}`);
      return decode(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
    }
  }
  

  module.exports = {getOpenAIresponse,}