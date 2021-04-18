import io from 'socket.io-client';

const socket = io(String(process.env.NEXT_PUBLIC_API_URL), { transports: ['websocket'] });
socket.on('connect', () => {
	console.log('socket connecting...');
});
socket.on('connected', () => {
	console.log('socket successfully connected');
});
socket.on('disconnect', () => {
	console.log('socket disconnected');
});
export { socket };
