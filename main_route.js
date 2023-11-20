const checkRoute = require('./check_route');
const bankRoute = require('./bank_sampah_route');

module.exports = function (app) {
    app.use('/check', checkRoute);
    app.use('/bank', bankRoute);
}
