
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    //with brackets notation [] we can access the property
    var envConfig = config[env];
    //process.env[key] get the local environment variables of the machine
    Object.keys(envConfig).forEach((key) => {
        process.env[key]  = envConfig[key];
    });     
    console.log('** ENV **: ', env);
}
