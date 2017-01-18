# js-helpers
A collection of JavaScript helpers to do common tasks. See the corresponding demo folders for each library/helper.

## DI

A basic dependency injection helper.

### `DI.bindFactory(value, factory)`

Adds a factory function to the dependency resolver

***`value:String`*** the string name for the factory  
***`factory:Function`*** the factory function  

### `DI.bindSingleton(value, singleton)`
Adds a singleton to the dependency resolver

***`value:String`*** the string name for the singleton  
***`singleton:Function|O*bject*`* the singleton  

### `DI.resolve(value)`

Resolve a value

***`value:String`*** the name of the dependency

### `DI.call(func, bindings)`

Call a function with the dependency resolver

***`func:String`*** the function to call using the dependency resolver
***`bindings:Object`*** additionals (temporary) bindings. These bindings are the lowest priority, so if a value already has been bound, the resolver won't use these bindings

Returns: the function result

### `DI.bindParams(func, bindings)`

Resolves the parameters and returns a function with the bound parameters

***`func:String`*** the function to call using the dependency resolver
***`bindings:Object`*** additionals (temporary) bindings. These bindings are the lowest priority, so if a value already has been bound, the resolver won't use these bindings

Returns: the function, bound with the resolved params

## DOM

A simple DOM selector and manipulator.

## Router

Simple routing, made easy.

## RestJS
An "ORM" style library for consuming REST APIs. See [the RestJS repo](https://github.com/daviesgeek/restjs).

## Application

Coming soon.