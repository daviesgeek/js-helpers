var logger = function () {

  this.debug = function (value) {
    console.log(value)
  }

}

var testFunction = function(logger, test) {
  logger.debug('test!!')
}

DI.bind('logger', logger)

DI.call(testFunction)