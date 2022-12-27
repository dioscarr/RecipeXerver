const axios =require('axios')

async function getOpenAIresponse(input) {
    console.log("Hello")
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `${input}`,
        model: "text-davinci-003",
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
      return response.data.choices[0].text;
    } catch (error) {
      console.error(error);
    }
  }
  

  module.exports = {getOpenAIresponse,}