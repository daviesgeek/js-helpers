Router.defineRoute('home', {
  url: '/home/:id:'
});

Router.startListening();

console.log(Router._currentRoute)
