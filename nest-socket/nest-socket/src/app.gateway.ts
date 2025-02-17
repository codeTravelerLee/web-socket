import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void {
    const { message, nickname } = data;
    socket.broadcast.emit('message', `${nickname}: ${message}`);
  }
}

@WebSocketGateway({ namespace: 'room' })
export class RoomGateway {
  constructor(private readonly chatGateWay: ChatGateway) {}
  rooms: string[] = [];

  @WebSocketServer() server: Server;

  @SubscribeMessage('createRoom')
  handleMessage(@MessageBody() data) {
    const { nickname, room } = data;

    this.chatGateWay.server.emit('notice', {
      message: `${nickname}님이 그룹채팅방 <${room}>을 만들었습니다.`,
    });

    this.rooms.push(room);
    this.server.emit('rooms', this.rooms);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(socket: Socket, data) {
    const { nickname, room, toLeaveRoom } = data;

    socket.leave(toLeaveRoom);

    this.chatGateWay.server.emit('notice', {
      message: `${nickname}님이 그룹채팅방 <${room}>에 입장했습니다.`,
    });

    socket.join(room);
  }

  //메세지 전송하면 받아줄 핸들러
  @SubscribeMessage('sendMessage')
  handleSendMessageToRoom(socket: Socket, data) {
    const { message, nickname, room } = data;
    console.log(data);
    socket.broadcast
      .to(room)
      .emit('sendMessage', { message: `${nickname}: ${message}` });
  }
}
