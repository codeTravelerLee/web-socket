const socket = io(
  'https://congenial-space-spork-p4pw5qj4qxgc7x4j-3000.app.github.dev/chat',
); //chat 네임스페이스의 소켓 서버 주소
const roomSocket = io(
  'https://congenial-space-spork-p4pw5qj4qxgc7x4j-3000.app.github.dev/room',
); //room 네임스페이스의 소켓 서버 주소

const nickname = prompt('사용하실 닉네임을 입력해주세요');
let currentRoom = '';

function sendMessage() {
  const message = $('#message').val();
  $('#chat').append(`<div>나: ${message}</div>`);
  socket.emit('message', { message, nickname });
}

//채팅방을 생성하는 함수
function createRoom() {
  const room = prompt('생성할 채팅방의 이름을 입력해주세요');
  roomSocket.emit('createRoom', { room, nickname });
}

roomSocket.on('rooms', (data) => {
  console.log(data, typeof data);

  $('#rooms').empty();

  data.forEach((room) => {
    $('#rooms').append(
      `<li>${room} <button onclick="joinRoom(${room})">join</button></li>`,
    );
  });
});

socket.on('connect', () => {
  console.log('socket successfully connected...');
});

socket.on('message', (message) => {
  $('#chat').append(`<div>${message}</div>`);
});
