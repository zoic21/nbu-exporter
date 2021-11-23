const config = require('./config').config;
const https = require('https');
const axios = require('axios').default;

var NBU = {
    token : null,
    expire : null,
    admin : {},
    config : {},
    policies : {}
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

NBU.admin.jobs = function(_callback){
    NBU.axios.get(config.nbu.url+'/admin/jobs',{ 
        headers:  {'content-type': 'application/vnd.netbackup+json;version=1.0','Authorization' : NBU.token}
    }).then(function (response) {
        _callback(response.data)
    }).catch(function (error) {
        console.log(error);
    });
}

NBU.config.policies = function(_callback,_offset,_limit){
    if(!_offset){
        _offset = 0;
    }
    if(!_limit){
        _limit = 99;
    }
    NBU.axios.get(config.nbu.url+'/config/policies?page%5Boffset%5D='+_offset+'&page%5Blimit%5D='+_limit,{ 
        headers:  {'content-type': 'application/vnd.netbackup+json;version=1.0','Authorization' : NBU.token}
    }).then(function (response) {
        let result = response.data.data
        if(response.data.meta.pagination.count > (_offset + _limit)){
            NBU.config.policies(function(response){
                _callback(result.concat(response))
            },_limit);
        }else{
            _callback(result)
        }
    }).catch(function (error) {
        console.log(error);
    });
}


NBU.login(function(){
    NBU.config.policies(function(response){
        console.log(response.length)
    })
})



exports.nbu = NBU