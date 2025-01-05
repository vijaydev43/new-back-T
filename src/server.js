const express = require('express');
const expressip = require('express-ip')
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
// const cluster = require('cluster');
// const numCPUs = require('os');
const config = require('./config/db');
const dataConfig = require('./config/config');
const middleWare = require('./middleware/authmiddleware')
const appRoute = require('./routes/appRoute')


const serverIntiate = async () => {
    await config.establishConnection();
    const app = express();

    app.use((req, res, next) => {

        res.header('Access-Control-Allow-Origin',);
        res.header('Access-Control-Allow-Headers', true);
        res.header('Access-Control-Allow-Credentials', 'Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
        next();
      });
    

    const corsOptions = {
        origin: '*',
        credentials: true,            //access-control-allow-credentials:true
        optionSuccessStatus: 200,
    }
    app.use(cors(corsOptions));
    app.use(expressip().getIpInfoMiddleware);
    app.use(bodyparser.json({ limit: '20mb' }));
    app.use(bodyparser.urlencoded({ limit: '20mb', extended: true }));
    // app.use(middleWare)
    app.use(morgan('dev'));
   // app.use(express.static("src/helper"))
    appRoute.initialize(app);
    app.listen(dataConfig?.app?.port, () => console.log(`Application listening on the port :${dataConfig.app.port}`));
}

serverIntiate();