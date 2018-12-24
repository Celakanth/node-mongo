var env = process.env.NODE_ENV || 'development';
//Global setting

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var configEnv = config[env];

  Object.keys(configEnv).forEach((key) => {
    process.env[key] = configEnv[key];
  });
}
// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
