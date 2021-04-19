import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/layout';

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

export const Home = () => {
	const router = useRouter();
	const [roomCode, setRoomCode] = useState('');
	const [joinRoomOpen, setJoinRoomOpen] = useState(false);
	const [createRoomOpen, setCreateRoomOpen] = useState(false);
	const openJoinRoom = () => setJoinRoomOpen(true);
	const closeJoinRoom = () => setJoinRoomOpen(false);
	const openCreateRoom = () => setCreateRoomOpen(true);
	const closeCreateRoom = () => setCreateRoomOpen(false);
	const joinRoom = () => router.push(`/room/${roomCode}`);
	const createRoom = () => {
		closeCreateRoom();
		setRoomCode(`${getRandomInt(999999999999)}`);
		openJoinRoom();
	};

	return (
		<>
			<Head>
				<title>Thanawat Super Omega Project</title>
			</Head>
			<Layout>
				<div className="flex flex-col items-center justify-center space-y-2">
					<Button variant="contained" color="primary" onClick={openJoinRoom} fullWidth>
						Join Room
					</Button>
					<Button variant="contained" color="secondary" onClick={openCreateRoom} fullWidth>
						Create Room
					</Button>
				</div>
			</Layout>
			<Dialog open={joinRoomOpen} onClose={closeJoinRoom} fullWidth maxWidth="xs">
				<DialogTitle>Join Room</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Room Code"
						value={roomCode}
						onChange={(e) => setRoomCode(e.target.value)}
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={closeJoinRoom} color="primary">
						Cancel
					</Button>
					<Button variant="contained" onClick={joinRoom} color="primary">
						Join
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={createRoomOpen} onClose={closeCreateRoom} fullWidth maxWidth="xs">
				<DialogTitle>Create Room</DialogTitle>
				<DialogActions>
					<Button variant="contained" onClick={closeCreateRoom} color="primary">
						Cancel
					</Button>
					<Button variant="contained" onClick={createRoom} color="primary">
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
