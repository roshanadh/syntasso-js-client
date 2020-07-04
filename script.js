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
const clearBtn = document.getElementById("clearBtn");

const fileUploadInput = document.getElementById('fileUpload');
const sampleInputUploadInput = document.getElementById('sampleInputUpload');
const expectedOutputUploadInput = document.getElementById('expectedOutputUpload');

const fileUploadBtn = document.getElementById('fileUploadBtn');
const inputUploadBtn = document.getElementById('inputUploadBtn');
const outputUploadBtn = document.getElementById('outputUploadBtn');

const checkbox = document.getElementById("useJsFileCheckbox");

clearBtn.addEventListener('click', event => {
    stdoutContainer.innerHTML = "";
});

fileUploadBtn.addEventListener('click', (event) => {
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
                })
                .then(response => response.json())
                .then(res => console.dir({ res }))

        } catch (err) {
            console.err(err);
        }
    }
});

outputUploadBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (!checkbox.checked) {
        // use code editor value for test cases
        const inputFiles = sampleInputUploadInput.files;
        const outputFiles = expectedOutputUploadInput.files;

        const formData = new FormData();
        formData.append('socketId', socketId);
        for (let input of inputFiles)
            formData.append("sampleInputs", input);
        for (let output of outputFiles)
            formData.append("expectedOutputs", output);
        formData.append('code', codeEditor.value || "console.log('Hello World!')");
        formData.append('dockerConfig', dockerConfigField.value || 0);

        for (var value of formData.values()) {
            console.log(value);
        }
        if (inputFiles && outputFiles) {
            try {
                fetch('http://localhost:8080/execute', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(response => console.dir({
                        response
                    }));
            } catch (err) {
                console.err(err);
            }
        }
    } else {
        const jsFile = fileUploadInput.files[0];
        const inputFiles = sampleInputUploadInput.files;
        const outputFiles = expectedOutputUploadInput.files;

        const formData = new FormData();
        formData.append('socketId', socketId);
        for (let input of inputFiles)
            formData.append("sampleInputs", input);
        for (let output of outputFiles)
            formData.append("expectedOutputs", output);
        formData.append('submission', jsFile);
        formData.append('dockerConfig', dockerConfigField.value || 0);

        for (var value of formData.values()) {
            console.log(value);
        }
        if (jsFile && inputFiles && outputFiles) {
            try {
                fetch('http://localhost:8080/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(response => console.dir({
                        response
                    }));
            } catch (err) {
                console.err(err);
            }
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
                })
                .then(response => response.json())
                .then(res => console.dir({ res }))
        } catch (err) {
            console.err(err);
        }
    }
});

socketConnection.on('docker-app-stdout', stdout => {
    stdoutContainer.innerHTML += stdout.stdout + '<br />';
});


socketConnection.on('test-status', stdout => {
    console.dir({
        message: "test-status-event",
        ...stdout
    });
});

socketConnection.on('container-id', containerId => {
    console.log(containerId.containerId);
});