const axios = require('axios');
axios.post('https://leetcode.com/graphql', {
  query: `query { 
    matchedUser(username: "neal_wu") { 
      submitStats { 
        acSubmissionNum { difficulty count submissions } 
        totalSubmissionNum { difficulty count submissions } 
      } 
    } 
  }`
}).then(res => console.log(JSON.stringify(res.data, null, 2)));
