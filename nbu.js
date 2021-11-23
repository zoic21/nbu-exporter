const config = require('config').config;
const axios = require('axios').default;

var NBU = {
    token : null,
    expire : null,
    admin : {}
}

NBU.axios = axios.create({
    httpsAgent: new https.Agent({  
        rejectUnauthorized: false
    })
});

NBU.login = function(_callback){
    NBU.axios.post(config.nbu.url+'/login',{"userName":config.nbu.username,"password":config.nbu.password},{ 
        headers:  {'content-type': 'application/vnd.netbackup+json;version=1.0'}
    }).then(function (response) {
        NBU.token = response.data.token
        NBU.expire = response.data.validity + Math.floor(new Date().getTime() / 1000)
        _callback()
    }).catch(function (error) {
        console.log(error);
    });
}

NBU.admin.job = function(_callback){
    NBU.axios.get(config.nbu.url+'/admin/job',{ 
        headers:  {'content-type': 'application/vnd.netbackup+json;version=1.0','Authorization' : NBU.token}
    }).then(function (response) {
        _callback(response)
    }).catch(function (error) {
        console.log(error);
    });
}


NBU.login(function(){
    NBU.admin.job(function(response){
        console.log(response);
    })
})

exports.nbu = NBU