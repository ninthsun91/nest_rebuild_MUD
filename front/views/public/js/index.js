const SERVER_URL = `localhost:3000`;
let socket = undefined;

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('index.js is ready');

    socket = io.connect(`ws://${SERVER_URL}/login`);
    openSocketListener(socket);
    openEventListener(socket);
});


const commendLine = document.getElementById('commendLine');
const commendForm = document.getElementById('commendForm');
const commendInput = document.getElementById('commendInput');

const openEventListener = (socket) => {
    commendForm.addEventListener('submit', (event) => commendSubmitHandler(event, socket));
}

const openSocketListener = (socket) => {
    socket.on('message', (data) => {
        console.log('received', data);
    });
}


const commendSubmitHandler = (event, socket) => {
    event.preventDefault();

    const input = commendInput.value
    console.log('submit', input);

    socket.emit('test', { input }, (data) => {
        console.log('received', data);
    });
}
