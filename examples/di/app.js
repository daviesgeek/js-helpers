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

var container = DI.createContainer()

// Singleton binding
container.bindSingleton('Logger', function() {

  var Logger = function() {

    this.createdAt = new Date().getMilliseconds()

    this.log = function(value) {
      console.log('Singleton ' + this.createdAt + ':', value)
    }

  }

  return new Logger()
})

// Factory
container.bindFactory('logger', function() {

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
container.bindSingleton('http', function(Logger) {
  var Http = function() {

    this.get = function(value) {
      Logger.log('whoa...http call made!!', value)
    }
  }

  return new Http
})

container.call(functionOne)
container.call(functionTwo)
container.call(functionWithArrayDeps)