var app = new Application()

app.registerSingleton('Logger', function () {
  var Logger = function () {
    this.log = function (value) {
      console.log(value)
    }
  }

  return new Logger()
})

app.registerController('AppController', function (Logger) {
  Logger.log('test!!!')
})

app.registerController('ProfileController', function (Logger, user) {
  Logger.log('test!!!')
  console.log(user)

  this.user = user
})

app.registerRoute('home', {
  url: '/',
  controller: 'AppController',
  view: '/home.html'
});

app.registerRoute('profile', {
  url: '/profile',
  controller: 'ProfileController',
  view: '/profile.html',
  resolve: {
    user: function () {
      return new Promise(function(resolve) {
        resolve({firstName: 'Matthew', lastName: 'Davies'});
      });
    }
  }
});

app.boot()