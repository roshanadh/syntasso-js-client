const socket = io.connect('http://localhost:3000');

const codeEditor = document.getElementById('code-editor');
const runBtn = document.getElementById('runBtn');
const stdoutContainer = document.getElementById('stdout-container');

runBtn.addEventListener('click', () => {
    event.preventDefault();
    const code = codeEditor.value;
    const payload = {
        "code": `${code}`,
        "dockerConfig": "1"
    }
    if (code && code.trim() !== '') {
        try {
            fetch('http://localhost:3000/execute', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'content-type': 'application/json'
                }

            });
        } catch (err) {
            console.err(err);
        } 
    }
});