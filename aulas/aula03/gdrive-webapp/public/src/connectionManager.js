export default class ConnectionManager {
    constructor({ apiURL }){
        this.apiURL = apiURL;
    }

    async currentFiles(){
        const files = (await (await fetch(this.apiURL)).json())
        return files
    }
}