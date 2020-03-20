// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const axios = require('axios');

exports.handler = async (event, context) => {
  const response = await axios(`https://www.formstack.com/api/v2/form.json?oauth_token=${process.env.FORMSTACK_API}`);
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
