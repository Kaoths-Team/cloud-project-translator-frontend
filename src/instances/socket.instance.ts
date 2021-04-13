import io from "socket.io-client";

const socket = io('ws://localhost:3000', { transports: ['websocket'] })
socket.on('connect', () => {
    console.log('socket connecting...')
})
socket.on('connected', () => {
    console.log('socket successfully connected')
})
socket.on('disconnect', () => {
    console.log('socket disconnected')
})
export { socket }