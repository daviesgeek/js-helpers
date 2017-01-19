"use strict";

var DI = {};

DI.createContainer = function (name) {
  return new DI.Container(name);
}

DI.Container = function (name) {
  this.name = name;

  this._singletons          = {};
  this._singletonInstances  = {};
  this._factories           = {};

  /**
   * Bind a factory value
   * @param  {string} value   the value name
   * @param  {function} factory the factory function
   * @return {void}
   */
  this.bindFactory = function (value, factory) {
    this._factories[value] = this.call(factory);
  };

  /**
   * Bind a singleton value
   * @param  {string} value     the value name
   * @param  {Object} singleton the singleton
   * @return {void}
   */
  this.bindSingleton = function (value, singleton) {
    this._singletons[value] = singleton;
  };

  /**
   * Resolves a value
   * @param  {string} value
   * @return {function}
   */
  this.resolve = function (value) {

    if(!(value in this._singletons) && !(value in this._singletonInstances) && !(value in this._factories)) {
      throw new ReferenceError('"'+ value + '" could not be found. Perhaps you forgot to bind it?');
    }

    if (value in this._factories) {
      return this._factories[value]();
    } else if(!(value in this._singletonInstances) && value in this._singletons) {
      this._singletonInstances[value] = this.call(this._singletons[value]);
    }

    return this._singletonInstances[value];
  };

  /**
   * Calls a given function, injecting the dependencies as needed!
   * @param  {function} func
   * @param  {object} bindings additional bindings to resolve from
   * @return {mixed} the function result
   */
  this.call = function (func, bindings) {
    return this.bindParams(func, bindings)()
  };

  /**
   * Binds the resolved parameters to a given functions
   * @param  {function} func
   * @param  {object} bindings additional bindings to resolve from
   * @return {mixed} the function result
   */
  this.bindParams = function (func, bindings) {
    if(!bindings) {
      bindings = {};
    }

    // If this is actually an array,
    if (func instanceof Array) {

      // The arguments are the first elements in the array
      var funcArgs = func;

      // And the last element is the actual function
      var func = funcArgs.pop();
    } else {

      // Else, treat it like a normal function
      var funcArgs = DI._parseArgs(func)
    }

    var resolved = [];

    for (var i = 0; i < funcArgs.length; i++) {
      var dependency

      try {
        dependency = this.resolve(funcArgs[i])
      } catch(e) {
        if(funcArgs[i] in bindings) {
          dependency = bindings[funcArgs[i]]
        } else {
          throw e;
        }
      }

      resolved.push(dependency);
    };

    return Function.prototype.bind.apply(func, [func].concat(resolved));
  }

}

/**
 * Parses the argument names from a given function
 * @param  {function} func
 * @return {array} the function's arguments
 */
DI._parseArgs = function (func) {

  // Match only the function's arguments
  var argMatch = func.toString().match(/function\s.*?\(([^)]*)\)/);

  // Make sure there is a match, and that it has a length
  if(argMatch && argMatch.length > 0) {

    // The first match ([0]) is the full match,
    // So grab the first capture group ([1]), which is the actual list of arguments
    return argMatch[1]

      // Split it on comma
      .split(',')
      .map(function (argument) {

        // Make sure there are no inline comments, and no whitespace on either side of the name
        return argument.replace(/\/\*.*\*\//, '').trim();

      }).filter(function (argument) {

        // And filter out any empty args
        return argument != undefined && argument.length;

      });

  // If there are no arguments, return an empty array
  } else {
    return []
  }

}

// Make it globally available
window.DI = DI