describe('Dependency Injection: ', function () {

  var container;

  beforeEach(function () {
    container = DI.createContainer()
  })

  it('should create container instances', function () {
    var isInstance = container instanceof DI.Container;
    expect(isInstance).to.be.true
  })

  it('should bind singletons', function () {
    container.bindSingleton('Singleton', function () {
      var Singleton = function (value) {

        this.value = value;

        this.getValue = function () {
          return this.value;
        }
      }

      return new Singleton('value');
    })


    expect(container._singletons.Singleton).to.be.ok
    expect(container._singletonInstances.Singleton).to.be.undefined

    var resolved = container.resolve('Singleton')
    expect(resolved).to.be.ok

    expect(resolved.getValue()).to.equal('value')
  })

  it('should bind factories', function (done) {
    container.bindFactory('Factory', function () {
      var Instance = function () {
        this.timestamp = new Date().getMilliseconds();
      }

      return InstanceFactory = function() {
        return new Instance();
      }
    })

    expect(container._factories.Factory).to.be.ok

    var resolved1 = container.resolve('Factory')

    var resolved2

    setTimeout(function () {
      resolved2 = container.resolve('Factory')
      expect(resolved1.timestamp).to.not.equal(resolved2.timestamp)
      done()
    }, 15)

  })

  it('should parse the arguments of a given function', function () {
    var func1 = function(argumentOne) {}
    var func2 = function (argument, CapitalArg) {}
    var func3 = function (CapitalArg,NoSpaceArg, spaceArg) {}

    expect(DI._parseArgs(func1)).to.deep.equal(['argumentOne'])
    expect(DI._parseArgs(func2)).to.deep.equal(['argument', 'CapitalArg'])
    expect(DI._parseArgs(func3)).to.deep.equal(['CapitalArg', 'NoSpaceArg', 'spaceArg'])

  })

  it('should bind the parameters of a function', function (done) {

    var func = function (Singleton) {
      expect(Singleton).to.be.exist
      done()
    }

    var Singleton = function () {}

    container.bindSingleton('Singleton', function () {
      return new Singleton()
    })

    container.bindParams(func)()

  })

  it('should call the function with the right parameters', function (done) {

    var func = function (Singleton) {
      expect(Singleton).to.be.ok
      done()
    }

    var Singleton = function () {}

    container.bindSingleton('Singleton', function () {
      return new Singleton()
    })

    container.call(func)

  })

  it('should call an array with the correct parameters', function (done) {

    var array =  ['Singleton', function (e) {
      expect(e).to.deep.equal({name: "Matthew"})
      done()
    }]

    container.bindSingleton('Singleton', function () {
      return {name: "Matthew"}
    })

    container.call(array)

  })

  it('should accept extra bindings when calling a function', function (done) {

    var func = function (Singleton, data) {
      expect(Singleton).to.be.ok
      expect(data).to.be.ok
      done()
    }

    var Singleton = function () {}

    container.bindSingleton('Singleton', function () {
      return new Singleton()
    })

    var extraBindings = {
      data: {
        name: "Matthew"
      }
    }

    container.bindParams(func, extraBindings)()

  })

  it('should inject dependencies into dependencies', function (done) {
    var func  = function (SingletonOne) {
      expect(SingletonOne).to.be.ok
    }

    container.bindSingleton('SingletonOne', function (SingletonTwo) {
      var SingletonOne = function () {
        this.name = 'SingletonOne'
        expect(SingletonTwo).to.be.ok
        expect(SingletonTwo.name).to.equal('SingletonTwo')
        done()
      }

      return new SingletonOne()
    })

    container.bindSingleton('SingletonTwo', function () {

      var SingletonTwo = function() {
        this.name = 'SingletonTwo'
      }

      return new SingletonTwo()
    })

    container.call(func)

  })

  it('should throw an error if the value cannot be found', function () {
    function shouldThrowError() {
      container.call(function (value) {})
    }

    expect(shouldThrowError).to.throw(ReferenceError)
  })

  it('should throw an error if the given array does not contain a function', function () {
    function shouldThrowError1() {
      container.call(['value'])
    }

    function shouldThrowError2() {
      container.call([function() {}, 'value'])
    }

    expect(shouldThrowError1).to.throw(TypeError)
    expect(shouldThrowError2).to.throw(TypeError)
  })

})