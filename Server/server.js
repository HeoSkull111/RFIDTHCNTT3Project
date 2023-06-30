import { initExpress, initFirebase, initRouter, initMQTT } from './core/core.js';


export const expressApp = initExpress();
initRouter(expressApp);

export const mqttClient = initMQTT();
export const database = initFirebase();

const server = expressApp.listen(5555, () => {
    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})