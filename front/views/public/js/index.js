const SERVER_URL = `localhost:3000`;
let socket = undefined;

const commendLine = document.getElementById('commendLine');
const commendForm = document.getElementById('commendForm');
const commendInput = document.getElementById('commendInput');

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('index.js is ready');

    socket = io.connect(`ws://${SERVER_URL}/login`);
    openSocketListener(socket);
    openEventListener(socket);

    frontPageInitializer(socket);
});

const frontPageInitializer = (socket) => {
    localStorage.clear();
    
    const input = { line: 'load' }
    socket.emit('none', input, ({ field, script }) => {
        localStorage.setItem('field', field);
        commendLine.innerHTML = script;
    });
}



const openEventListener = (socket) => {
    commendForm.addEventListener('submit', (event) => commendSubmitHandler(event, socket));
}

const openSocketListener = (socket) => {
    socket.on('print', printHandler);
}

const printHandler = ({ field, script, userInfo }) => {
    localStorage.setItem('field', field);
    localStorage.setItem('userInfo', userInfo);

    commendLine.innerHTML = script;
}


const commendSubmitHandler = (event, socket) => {
    event.preventDefault();

    const line = commendInput.value;
    commendInput.value = '';
    console.log(`submit: '${line}'`);

    const field = localStorage.getItem('field');
    const userInfo = localStorage.getItem('userInfo');

    socket.emit(field, { line, userInfo });
}