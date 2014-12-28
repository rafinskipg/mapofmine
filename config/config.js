var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'mapofmine'
    },
    db: 'mongodb://localhost/mapofmine',
    port: 3000,
  },

  test: {
    root: rootPath,
    app: {
      name: 'mapofmine'
    },
    port: 3000,
    db: 'mongodb://localhost/mapofmine'
  },

  production: {
    root: rootPath,
    app: {
      name: 'mapofmine'
    },
    port: 3000,
    db: 'mongodb://localhost/mapofmine'
  }
};

module.exports = config[env];
