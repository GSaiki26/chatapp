/* Libs */
import Ws from "../services/ws";
import { Socket } from "socket.io";
import logger from '@ioc:Adonis/Core/Logger';

/* Types */
interface User {
  nickname?: string,
  socket: Socket
}


/* Functions */
function send_message(socket: Socket, devices: Map<string, User>, data: any) {
  const message = `${devices.get(socket.id)!.nickname || socket.id} says: ${data}`;
  logger.info(`(Message) ${message}`)
  socket.broadcast.emit('receive_message', message);
}


async function main() {
  const devices = new Map<string, User>();
  Ws.io.on('connection', (socket: Socket) => {
    const new_device_message = `New connected device[${socket.id}].`;
    devices.set(socket.id, {socket});
    logger.info(new_device_message);
    Ws.io.emit('receive_message', new_device_message);

    socket.on('send_message', data => {send_message(socket, devices, data)});
    socket.on('set_nickname', data => {
      const device: User = devices.get(socket.id)!;
      if (!data) return;
      if (device.nickname) {
        Ws.io.emit(
          'receive_message', `${device.nickname} set nickname to ${data}`);
      } else {
        Ws.io.emit(
          'receive_message', `${device.socket.id} set nickname to ${data}`);
      }
      device.nickname = data;
    });
  });
}


/* Code */
Ws.boot()
main();