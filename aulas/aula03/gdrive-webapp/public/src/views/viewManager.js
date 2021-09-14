export default class ViewManager {
    constructor(){
       this.tbody = document.getElementById('tbody');
       this.newFileBtn = document.getElementById('newFileBtn');
    }

    getIcon(file){
    return  file.match(/\.mp4|\.webm/i) ? 'movie'
            : file.match(/\.jp|png/i) ? 'image'
            : 'content_copy';
    }

    makeIcon(file){
        const icon = this.getIcon(file);
        const colors = {
            image: 'yellow600',
            movie: 'red600',
            file: ''
        }
        return `
        <i class="material-icons ${colors[icon]} left">${icon}</i>
        `
    }

        updateCurrentFiles(files){
            const template = (item) => `
            <tr>
            <td>${this.makeIcon(item.file)} ${item.file}</td>
            <td>${item.owner}</td>
            <td>${item.lastModified}</td>
            <td>${item.size}</td>
          </tr>
            `

            this.tbody.innerHTML = files.map(template).join('')
        }

}