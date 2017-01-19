"use strict";

var View = {};

View.render = function (html, context) {

  html = View._interpolateValues(html, context);
  html = View._interpolateExpressions(html, context);

  return html;
};

View._interpolateExpressions = function (html, context) {
  var expressions = (html
    .match(/{{\s*[(\w|\(|\)|\.|,|\s|')).]+\s*}}/g) || [])
    .map(function (item) {
      return item.replace(/({{\s*|\s*}})/g, '');
    })

    for (var i = 0; i < expressions.length; i++) {
      var expression = expressions[i]

      var expressionArgs = expression.match(/\((.*)\)/g)[0]
          .replace(/(\)|\()/g, '')
          .split(',')
          .map(function (item) {
            return item.replace(/\s/g, '');
          })
          .map(function (item) {
            var value = View._accessByString(item, context)
            if(!value) {

              if(new RegExp(/^'(.*)'$/).test(item))
                return item.replace(/'/g, '');

              if(item === 'true')
                return true

              if(item === 'false')
                return false

              if(!isNaN(parseInt(item, 10)))
                return parseInt(item)
            }
            return value
          });

      var expressionName = (/^(.*?)(?:\()/g).exec(expression)[1]

      var retrievedFunction = View._accessByString(expressionName, context)

      var value = retrievedFunction.apply(retrievedFunction, expressionArgs)

      var regex = new RegExp('{{\\s*[' + expression + ']+\\s*}}');

      html = html.replace(regex, value)
    }

  return html;
}

View._interpolateValues = function (html, context) {

  var values = (html
    .match(/{{\s*[\w\.]+\s*}}/g) || [])
    .map(function (item) {
      return item.replace(/({{\s*|\s*}})/g, '');
    })

  for (var i = 0; i < values.length; i++) {

    var regex = new RegExp('{{\\s*[' + values[i] + ']+\\s*}}');

    var value = View._accessByString(values[i], context);

    if(typeof value !== 'string')
      value = value.toString()

    html = html.replace(regex, value);
  }

  return html;
}

View._accessByString = function (value, object) {
  var structure = value.split('.').map(function (item) {
    return item.replace(/\s*/g, '');
  });

  var currentValue;
  for (var i = 0; i < structure.length; i++) {
    if(!currentValue) {
      currentValue = object[structure[i]]
    } else {
      currentValue = currentValue[structure[i]]
    }
  }


  return currentValue;
}