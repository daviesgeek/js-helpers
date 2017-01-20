var context = {
  user: {
    firstName: 'matthew',
    lastName: 'davies',
    email: ['matthew@daviesgeek.com'],
    getGravatar: function (firstName, lastName, email) {
      return firstName + lastName + email;
    }
  }
}

var html = View.render(`
  <h1>{{ user.firstName }} {{ user.lastName }}</h1>
  <h2>{{user.email}}</h2>
  <h3>{{user.getGravatar(user.firstName, user.lastName,user.email)}}</h3>
`,
  context
);

document.write(html)

setTimeout(function () {
  context.user.firstName = 'Changed!!'
}, 1000)