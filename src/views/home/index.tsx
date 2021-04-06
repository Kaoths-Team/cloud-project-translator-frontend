import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/layout';

const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

type Language = {
	name: string;
	value: string;
};

const LANGUAGE: Language[] = [
	{ name: 'Thai', value: 'th' },
	{ name: 'English', value: 'en' },
];

export const Home = () => {
	const router = useRouter();

	const [joinRoomOpen, setJoinRoomOpen] = useState(false);
	const [createRoomOpen, setCreateRoomOpen] = useState(false);
	const openJoinRoom = () => setJoinRoomOpen(true);
	const closeJoinRoom = () => setJoinRoomOpen(false);
	const openCreateRoom = () => setCreateRoomOpen(true);
	const closeCreateRoom = () => setCreateRoomOpen(false);
	const joinRoom = () => router.push(`/room/${roomCode}`);
	const createRoom = () => {
		closeCreateRoom();
		setRoomCode(`${language1}_${language2}_${getRandomInt(99999)}`);
		openJoinRoom();
	};

	const [roomCode, setRoomCode] = useState('');
	const [language1, setLanguage1] = useState('th');
	const [language2, setLanguage2] = useState('en');

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
				<DialogContent>
					<Select value={language1} fullWidth onChange={(e) => setLanguage1(String(e.target.value))} input={<Input />}>
						{LANGUAGE.map((language) => {
							return <MenuItem value={language.value}>{language.name}</MenuItem>;
						})}
					</Select>
					<FormHelperText>Speaker Language 1</FormHelperText>
					<Select
						value={language2}
						fullWidth
						onChange={(e) => setLanguage2(String(e.target.value))}
						input={<Input />}
						className="mt-6"
					>
						{LANGUAGE.map((language) => {
							return <MenuItem value={language.value}>{language.name}</MenuItem>;
						})}
					</Select>
					<FormHelperText>Speaker Language 2</FormHelperText>
				</DialogContent>
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
