import io from 'socket.io-client';
import { SERVER_EVENT } from "../enums/event.enum";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO as string, { transports: ['websocket'] });
socket.on('connect', () => {
	console.log('socket connecting...');
});
socket.on(SERVER_EVENT.Connected, () => {
	console.log('socket successfully connected');
});
socket.on('disconnect', () => {
	console.log('socket disconnected');
});
export { socket };
