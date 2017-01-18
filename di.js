var DI = {}

DI._singletons          = {};
DI._singletonInstances  = {};
DI._factories           = {};

DI.bindFactory = function (value, factory) {
  this._factories[value] = DI.call(factory)
}

DI.bindSingleton = function(value, singleton) {
  this._singletons[value] = singleton
}

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

DI.call = function (func) {

  var funcArgs = this._parseArgs(func)

  var resolved = []

  for (var i = 0; i < funcArgs.length; i++) {
    resolved.push(DI.resolve(funcArgs[i]))
  }

  return func.apply(func, resolved)
}

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

window.DI = DI