var functionOne = function(logger) {
  logger.log('test')

}

var functionTwo = function (logger, http) {
  logger.log('test instance')

  http.get({url: "test"})
}

var functionWithArrayDeps = ['http', function(h) {
  h.get({url: "test"})
}]

// Singleton binding
DI.bindSingleton('Logger', function() {

  var Logger = function() {

    this.createdAt = new Date().getMilliseconds()

    this.log = function(value) {
      console.log('Singleton ' + this.createdAt + ':', value)
    }

  }

  return new Logger()
})

// Factory
DI.bindFactory('logger', function() {

  var Logger = function() {

    this.createdAt = new Date().getMilliseconds()

    this.log = function(value) {
      console.log('Instance ' + this.createdAt + ':', value)
    }

  }

  return function LoggerFactory() {
    return new Logger()
  }
})

// Singleton with bindings
DI.bindSingleton('http', function(Logger) {
  var Http = function() {

    this.get = function(value) {
      Logger.log('whoa...http call made!!', value)
    }
  }

  return new Http
})

DI.call(functionOne)
DI.call(functionTwo)
DI.call(functionWithArrayDeps)