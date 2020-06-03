const socketConnection = io.connect('http://localhost:8080/');
let socketId;
socketConnection.on('connect', () => {
    socketId = socketConnection.id;
    console.log('socketId is: ' + socketId);
});

const codeEditor = document.getElementById('code-editor');
const dockerConfigField = document.getElementById('dockerConfig');
const runBtn = document.getElementById('runBtn');
const stdoutContainer = document.getElementById('stdout-container');

const fileUploadInput = document.getElementById('fileUpload');
const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const file = fileUploadInput.files[0];

    const formData = new FormData();
    formData.append('socketId', socketId);
    formData.append('submission', file);
    formData.append('dockerConfig', dockerConfigField.value);

    for (var value of formData.values()) {
        console.log(value); 
    }
    if (file) {
        try {
            fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData
            });
        } catch (err) {
            console.err(err);
        }
    }
});

runBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const code = codeEditor.value;
    const dockerConfig = dockerConfigField.value;
    const payload = {
        "code": `${code}`,
        "socketId": `${socketId}`,
        "dockerConfig": `${dockerConfig}`
    }
    if (code && code.trim() !== '') {
        try {
            fetch('http://localhost:8080/execute', {
                method: 'POST',
                
                body: JSON.stringify(payload),
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
            });
        } catch (err) {
            console.err(err);
        } 
    }
});

socketConnection.on('docker-app-stdout', stdout => {
    stdoutContainer.innerHTML += stdout.stdout + '<br />';
});

socketConnection.on('container-id', containerId => {
    console.log(containerId.containerId);
});