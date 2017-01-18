var DI = {}

DI._singletons          = {};
DI._singletonInstances  = {};
DI._factories           = {};

/**
 * Bind a factory value
 * @param  {string} value   the value name
 * @param  {function} factory the factory function
 * @return {void}
 */
DI.bindFactory = function (value, factory) {
  this._factories[value] = DI.call(factory)
}

/**
 * Bind a singleton value
 * @param  {string} value     the value name
 * @param  {Object} singleton the singleton
 * @return {void}
 */
DI.bindSingleton = function(value, singleton) {
  this._singletons[value] = singleton
}

/**
 * Resolves a value
 * @param  {string} value
 * @return {function}
 */
DI.resolve = function (value) {

  if(!(value in this._singletons) && !(value in this._singletonInstances) && !(value in this._factories)) {
    throw new ReferenceError('"'+ value + '" could not be found. Perhaps you forgot to bind it?')
  }

  if (value in this._factories) {
    return this._factories[value]()
  } else if(!(value in this._singletonInstances) && value in this._singletons) {
    this._singletonInstances[value] = DI.call(this._singletons[value])
  }

  return this._singletonInstances[value]
}

/**
 * Calls a given function, injecting the dependencies as needed!
 * @param  {function} func
 * @return {mixed} the function result
 */
DI.call = function (func) {

  var funcArgs = this._parseArgs(func)

  var resolved = []

  for (var i = 0; i < funcArgs.length; i++) {
    resolved.push(DI.resolve(funcArgs[i]))
  }

  return func.apply(func, resolved)
}

/**
 * Parses the argument names from a given function
 * @param  {function} func
 * @return {array} the function's arguments
 */
DI._parseArgs = function(func) {
  var argMatch = func.toString().match(/function\s.*?\(([^)]*)\)/)
  if(argMatch && argMatch.length > 0) {
    return argMatch[1]
    .split(',')
    .map(function (argument) {
      return argument.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (argument) {
      return argument != undefined && argument.length
    })
  } else {
    return []
  }

}

// Make it globally available
window.DI = DI