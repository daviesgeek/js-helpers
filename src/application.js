"use strict";

var Application = function () {

  this._controllers = {}

  this.registerController = function (name, func) {
    this._controllers[name] = func
  }

  this.registerSingleton = function (name, func) {
    DI.bindSingleton(name, func)
  }

  this.registerRoute = function (name, route) {
    Router.defineRoute(name, route)
  }

  this.boot = function () {
    Router.onRouteChange(this.onRouteChange.bind(this))
    Router.startListening()

    // console.log('booting application')
  }

  this.onRouteChange = function (prevRoute, route) {

    var resolvedData = {}

    if(route.resolve) {
      var promises = [new Promise(function (resolve) {
        resolve()
      })]

      for(var item in route.resolve) {
        var resolve = DI.call(route.resolve[item])

        // If it returns a promise
        if('then' in resolve) {
          promises.push(resolve)
          resolve.then(function(response) {
            resolvedData[item] = response
          })
        } else {
          resolvedData[item] = resolve
        }

      }

      Promise.all(promises).then(function () {
        DI.call(this._getController(route.controller), resolvedData)
      }.bind(this))
    }

  }

  this._getController = function(name) {
    if (!(name in this._controllers)) {
      throw new ReferenceError('controller "' + name + '" is not defined')
    }

    return this._controllers[name]
  }

}