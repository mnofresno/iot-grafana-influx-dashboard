// Load dependencies
const util    = require('util'),
      winston = require('winston'),
      app     = require('./app');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename: 'api.log'})
    ]
});

// Define API port
let port   = process.env.PORT || 1337;

// Run API
app.get(logger).listen(port, function(){
    logger.info(util.format("server listening on port %s", port));
});
