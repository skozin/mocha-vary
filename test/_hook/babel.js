require('babel/register')({
  ignore: /node_modules(?![/]arrow-mocha)/,
  blacklist: ['regenerator']
})
