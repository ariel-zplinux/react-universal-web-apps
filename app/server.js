import express from 'express';
import nconf from 'nconf';

import configManager from './infra/config-manager';
import middlewareManager from './infra/middleware-manager';
import routeManager from './infra/route-manager';
import assetsManager from './infra/assets-manager';

import {onConnectionSync} from './synchronization/SyncServer';
import socketIOserver from 'socket.io';

const app = express();

configManager.handle(app);
middlewareManager.handle(app);
assetsManager.handle(app);
routeManager.handle(app);

const server = app.listen(nconf.get('port'), () => {
    console.log('Listening on http://' + nconf.get('host') + ':' + nconf.get('port'));    
});

// start socket.io server
export const io = socketIOserver.listen(server);
io.sockets.on('connection', onConnectionSync);
