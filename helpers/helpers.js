const Handlebars = require('handlebars');

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

Handlebars.registerHelper('eq', function(a, b, options) {
    if (a === 1) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

module.exports = Handlebars;
