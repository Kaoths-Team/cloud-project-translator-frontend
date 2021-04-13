import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MicIcon from '@material-ui/icons/Mic';
import MicNoneIcon from '@material-ui/icons/MicNone';
import RefreshIcon from '@material-ui/icons/Refresh';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import Layout from '../../components/layout';
import { socket } from '../../instances/socket.instance'
const AudioRecorder = dynamic(() => import('react-audio-recorder'), { ssr: false });

const recordingLabel: any = (
	<div className="mic-container">
		<MicIcon style={{ fontSize: 150, zIndex: 1 }} />
		<div className="circle" style={{ animationDelay: '0s' }}></div>
		<div className="circle" style={{ animationDelay: '1s' }}></div>
	</div>
);
const removeLabel: any = <RefreshIcon style={{ fontSize: 150 }} />;
const recordLabel: any = <MicNoneIcon style={{ fontSize: 150 }} />;

export const Room = () => {
	const router = useRouter();
	
	const { code } = router.query;
	const choices = useMemo(() => {
		if (typeof code === 'string') {
			return code.split('_').slice(0, 2);
		}
		return [];
	}, [code]);
	const [nativeLanguage, setNativeLanguage] = useState('');
	const [choiceOpen, setChoiceOpen] = useState(true);
	const [duration, setDuration] = useState(0);
	const [voiceBlob, setVoiceBlob] = useState<any>(null);

	useEffect(() => {
		socket.on('on-recieve', (voice) => {
			console.log(voice);
		});
	}, []);

	useEffect(() => {
		if (!choiceOpen) {
			socket.emit('join-room', code);
		}
	}, [nativeLanguage, choiceOpen]);

	const sendVoice = useCallback(() => {
		socket.emit('voice', { voiceBlob, targetLanguageCode: 'th', roomCode: code });
	}, [voiceBlob]);

	return (
		<>
			<Head>
				<title>Thanawat Super Omega Project</title>
			</Head>
			<Layout>
				<h1 className="text-3xl font-bold mb-2">Room code: {code}</h1>
				{!choiceOpen && (
					<>
						<h3 className="text-xl font-bold mb-4 text-gray-400">Your Native Language: {nativeLanguage}</h3>
						<div className="overflow-auto border-2 border-red-300 mb-2 h-chat">Lorem ipsum dolor sit amet...</div>
						<div className="icon-container">
							<AudioRecorder
								playLabel=""
								removeLabel={removeLabel}
								recordLabel={recordLabel}
								recordingLabel={recordingLabel}
								downloadable={true}
								onChange={(e) => {
									setVoiceBlob(e.audioData);
									setDuration(e.duration);
								}}
							/>
						</div>
						<div className="text-center">
							{duration > 60 && (
								<p className="text-center text-red-600 font-bold">Voice duration must be no longer than 1 minute.</p>
							)}
							<Button variant="contained" onClick={sendVoice} color="primary">
								Send voice
							</Button>
						</div>
					</>
				)}
			</Layout>
			<Dialog open={choiceOpen} fullWidth maxWidth="xs">
				<DialogTitle>Choose your native language</DialogTitle>
				<DialogContent>
					<RadioGroup value={nativeLanguage} onChange={(e) => setNativeLanguage(e.target.value)}>
						{choices.map((choice) => {
							return <FormControlLabel key={`choice-${choice}`} value={choice} control={<Radio />} label={choice} />;
						})}
					</RadioGroup>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={() => {
							if (nativeLanguage) {
								setChoiceOpen(false);
							}
						}}
						color="primary"
					>
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
