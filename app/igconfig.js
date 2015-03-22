var env = process.env.NODE_ENV || 'development';

var config = {
  'development': {
    id: '263486dcef6f435f9ad20389f52d7cc4',
    secret: '068a253679694af48661c9b3c3898d0e',
    redirect: 'http://localhost:3000/handleauth'
  },
  'production': {
    id: '67fe534995194f92b03bd4e9853c69eb',
    secret: '9c75acf6aadd4176825187b31c7778a0',
    redirect: 'http://tenacious-bullet-57-172144.euw1.nitrousbox.com:3000/handleauth'
  }
}
module.exports = config[env];