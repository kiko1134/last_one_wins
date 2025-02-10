const { join } = require('path');

module.exports = {
    PORT: process.env.PORT || 3000,
    STATIC_DIR: join(__dirname, '../../../client/src'),
    VIEWS_DIR: join(__dirname, '../../../client/src/views'),
    VIEW_ENGINE: 'ejs'
};
