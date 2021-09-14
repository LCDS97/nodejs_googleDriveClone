import AppController from "./src/appController.js";
import ConnectionManager from "./src/connectionManager.js";

const API_URL = "https://localhost:3000";


const appController = new AppController({
    connectionManager: new ConnectionManager({
        apiURL: API_URL
    })
})

try {
    await appController.initialize();
} catch (error) {
    console.log('Error', error);
}