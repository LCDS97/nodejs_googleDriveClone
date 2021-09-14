import AppController from "./src/controller/appController.js";
import ConnectionManager from "./src/connectionManager.js";
import ViewManager from "./src/views/viewManager.js";

const API_URL = "https://localhost:3000";


const appController = new AppController({
    viewManager: new ViewManager(),
    connectionManager: new ConnectionManager({
        apiURL: API_URL,
    })
})

try {
    await appController.initialize();
} catch (error) {
    console.log('Error', error);
}