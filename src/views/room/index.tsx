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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../../components/layout';
import languages, { Language } from '../../constances/languages';
import { CLIENT_EVENT, SERVER_EVENT } from '../../enums/event.enum';
import { socket } from '../../instances/socket.instance';

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

type Chat = {
	voice: Blob;
	me: boolean;
};

export const Room = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [nativeLanguage, setNativeLanguage] = useState<Language>();
	const [chooseIndex, setChooseIndex] = useState(0);
	const [choiceOpen, setChoiceOpen] = useState(true);
	const [duration, setDuration] = useState(0);
	const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
	const [voiceList, setVoiceList] = useState<Chat[]>([]);
	const voiceContainerRef = useRef<HTMLDivElement | null>(null);

	const chooseNativeLanguage = () => {
		socket.emit(CLIENT_EVENT.JoinRoom, { roomCode, languageCode: languages[chooseIndex].code });
		setNativeLanguage(languages[chooseIndex]);
		setChoiceOpen(false);
	};

	const recordVoice = (e: any) => {
		if (e.audioData) {
			setVoiceBlob(e.audioData);
			setDuration(e.duration);
		}
	};

	const sendVoice = () => {
		if (voiceBlob) {
			socket.emit(CLIENT_EVENT.VoiceRequest, { audio: voiceBlob });
			setVoiceList([...voiceList, { voice: voiceBlob, me: true }]);
			setVoiceBlob(null);
			setDuration(0);
		}
	};

	useEffect(() => {
		socket.on(SERVER_EVENT.VoiceResponse, (voice: any) => {
			const blob = new Blob([voice], { type: 'audio/wav' });
			setVoiceList([...voiceList, { voice: blob, me: false }]);
		});
	}, [voiceList]);

	const chatJsx = useMemo(() => {
		return voiceList.map((chat, i) => {
			const audioURL = window.URL.createObjectURL(chat.voice);
			if (chat.me) {
				return (
					<audio key={`v-${i}`} className="ml-auto" src={audioURL} controls autoPlay={i + 1 == voiceList.length} />
				);
			} else {
				return <audio key={`v-${i}`} src={audioURL} controls autoPlay={i + 1 == voiceList.length} />;
			}
		});
	}, [voiceList]);

	useEffect(() => {
		if (voiceContainerRef) {
			const scrollHeight = voiceContainerRef.current?.scrollHeight || 0;
			const clientHeight = voiceContainerRef.current?.clientHeight || 0;
			const scroll = scrollHeight - clientHeight;
			voiceContainerRef.current?.scrollTo(0, scroll);
		}
	}, [chatJsx]);

	const currentVoiceJsx = useMemo(() => {
		if (voiceBlob) {
			const audioURL = window.URL.createObjectURL(voiceBlob);
			return <audio className="mx-auto mb-6" src={audioURL} controls />;
		} else {
			return <audio className="mx-auto mb-6" controls />;
		}
	}, [voiceBlob, duration]);

	return (
		<>
			<Head>
				<title>Thanawat Super Omega Project</title>
			</Head>
			<Layout>
				<h1 className="text-3xl font-bold mb-2">Room code: {roomCode}</h1>
				{!choiceOpen && (
					<>
						<h3 className="text-xl font-bold mb-4 text-gray-400">Your Native Language: {nativeLanguage?.name}</h3>
						<div className="overflow-auto border-2 border-red-300 mb-2 h-chat p-4 space-y-4" ref={voiceContainerRef}>
							{chatJsx}
						</div>
						<div className="icon-container">
							<AudioRecorder
								playLabel=""
								removeLabel={removeLabel}
								recordLabel={recordLabel}
								recordingLabel={recordingLabel}
								downloadable={false}
								onChange={recordVoice}
							/>
						</div>
						<div className="text-center">
							{duration > 60 ? (
								<p className="text-center text-red-600 font-bold">Voice duration must be no longer than 1 minute.</p>
							) : (
								<>
									{currentVoiceJsx}
									<Button variant="contained" onClick={sendVoice} color="primary">
										Send voice
									</Button>
								</>
							)}
						</div>
					</>
				)}
			</Layout>
			<Dialog open={choiceOpen} fullWidth maxWidth="xs">
				<DialogTitle>Choose your native language</DialogTitle>
				<DialogContent>
					<RadioGroup value={chooseIndex} onChange={(e) => setChooseIndex(Number(e.target.value))}>
						{languages.map((language, i) => {
							return <FormControlLabel key={`choice-${i}`} value={i} control={<Radio />} label={language.name} />;
						})}
					</RadioGroup>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={chooseNativeLanguage} color="primary">
						Apply
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
