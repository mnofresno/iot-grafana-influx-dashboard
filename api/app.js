// Load dependencies
const express    = require('express'),
      Influx     = require('influx'),
      bodyParser = require('body-parser'),
      winston    = require('winston');

// Create express application
module.exports = {
    get: function(logger) {
        const app = express();
        // Create a client towards InfluxDB
        let influx = new Influx.InfluxDB({
            host: process.env.INFLUXDB_HOST || "db",
            database: process.env.INFLUXDB_DATABASE || "iot"
        });

        // Body parser configuration
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Handle incoming data
        app.post('/data',
            function(req, res, next){
                influx.writePoints([{
                    measurement: 'data',
                    tags: { type: req.body.type },
                    fields: { sensor_id: req.body.sensor_id, value: req.body.value },
                    timestamp: new Date(req.body.ts).getTime() * 1000000
                }]).then(() => {
                    logger.info(req.body);
                    return res.sendStatus(201);
                }).catch(err => {
                    logger.error(err.message);
                    return res.sendStatus(500);
                }
            );
        });
        return app;
    }
};
