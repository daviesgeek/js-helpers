var app = new Application()

app.registerSingleton('Logger', function () {
  var Logger = function () {
    this.log = function (value) {
      console.log(value)
    }
  }

  return new Logger()
})

app.registerController('AppController', function (Logger, data) {
  Logger.log('test!!!')
  console.log(data)
})

app.registerRoute('home', {
  url: '/',
  controller: 'AppController',
  resolve: {
    data: function () {
      return new Promise(function(resolve) {
        resolve({data: 'whooot!'});
      });
    }
  }
});

app.boot()