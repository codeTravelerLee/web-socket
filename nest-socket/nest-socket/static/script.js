//깃헙 올릴땐 codespace주소 지우고 올려라 제발
const socket = io('codespace주소/chat'); //chat 네임스페이스의 소켓 서버 주소
const roomSocket = io('codespace주소/room'); //room 네임스페이스의 소켓 서버 주소

const nickname = prompt('사용하실 닉네임을 입력해주세요');
let currentRoom = '';

function sendMessage() {
  if (currentRoom === '') {
    alert('대화를 나눌 방을 선택해주세요');
    return;
  }

  const message = $('#message').val();
  const data = { message, nickname, room: currentRoom };

  $('#chat').append(`<div>나: ${message}</div>`);
  roomSocket.emit('sendMessage', data);
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
      `<li>${room} <button onclick="joinRoom('${room}')">join</button></li>`,
    );
  });
});

socket.on('connect', () => {
  console.log('socket successfully connected...');
});

socket.on('message', (message) => {
  $('#chat').append(`<div>${message}</div>`);
});

//공지영역 관련 이벤트 핸들러
socket.on('notice', (data) => {
  $('#notice').append(`<div>${data.message}</div>`);
});

//채팅방 입장 함수
function joinRoom(room) {
  roomSocket.emit('joinRoom', { room, nickname, toLeaveRoom: currentRoom });
  currentRoom = room;
}

roomSocket.on('sendMessage', (data) => {
  console.log(data);
  $('#chat').append(`<div>${data.message}</div>`);
});
