describe('View: ', function () {

  it('should interpolate values', function () {
    var html = '<p>{{ user.firstName }} {{user.lastName}}</p>'

    var values = {
      user: {
        firstName: 'Matt',
        lastName: 'Smith',
      }
    }

    var rendered = View.render(html, values)
    expect(rendered).to.equal('<p>Matt Smith</p>')
  })

  it('should interpolate expressions', function () {
    var html = '<p>{{ user.getName() }} {{user.getEmail()}}</p>'

    var values = {
      user: {
        getName: function () {
          return 'Matt Smith'
        },
        getEmail: function () {
          return 'matt.smith@theuniverse.com'
        }
      }
    }

    var rendered = View.render(html, values)
    expect(rendered).to.equal('<p>Matt Smith matt.smith@theuniverse.com</p>')
  })

  it('should interpolate expressions with arguments', function () {
    var html = '<p>{{ user.getName(user.email) }}</p>'

    var values = {
      user: {
        email: 'matt.smith@theuniverse.com',
        getName: function (email) {
          return 'Matt Smith ' + email
        },
      }
    }

    var rendered = View.render(html, values)
    expect(rendered).to.equal('<p>Matt Smith matt.smith@theuniverse.com</p>')
  })

  it('should interpolate expression with "complex" arguments', function () {
    var html = "<p>{{ user.getName(user.email, false, 1, 'string') }}</p>"

    var values = {
      user: {
        email: 'matt.smith@theuniverse.com',
        getName: function (email, obfuscateEmail) {
          return 'Matt Smith ' + email
        },
      }
    }

    var rendered = View.render(html, values)
    expect(rendered).to.equal('<p>Matt Smith matt.smith@theuniverse.com</p>')
  })

})