export default class ConnectionManager {
    constructor({ apiURL }){
        this.apiURL = apiURL;

        this.ioClient = io.connect(apiURL, { withCredentials: false })
        this.socketId = ''
        
    }

    configureEvents( { onProgress }){
        this.ioClient.on('connect', this.onConnect.bind(this))
        this.ioClient.on('file-upload', onProgress)
    }

    onConnect(){
        console.log('user connected', this.ioClient.id)
        this.socketId = this.ioClient.id
    }

    async currentFiles(){
        const files = (await (await fetch(this.apiURL)).json())
        return files
    }
}