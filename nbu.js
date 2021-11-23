const config = require('config').config;
const axios = require('axios').default;

var NBU = {}

NBU.login = function(_callback){
    axios.post(config.nbu.url, 
      {
        "domainType":"vx",
        "domainName":config.nbu.domain,
        "userName":config.nbu.username,
        "password":config.nbu.password
      },
      { 
          headers:  {'content-type': 'application/vnd.netbackup+json;version=1.0'}
      })
      .then(function (response) {
        console.log(response);
        _callback(reponse)
      })
      .catch(function (error) {
        console.log(error);
      });
}


exports.nbu = NBU