import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout';

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

	useEffect(() => {
		if (!choiceOpen) {
			console.log('fetch every 5 seconds', nativeLanguage);
		}
	}, [nativeLanguage, choiceOpen]);

	const [selectedFile, setSelectedFile] = useState(null);
	const handleCapture = ({ target }: any) => {
		setSelectedFile(target.files[0]);
	};

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
						<input
							accept="image/*"
							style={{ display: 'none' }}
							id="upload-voice"
							type="file"
							onChange={handleCapture}
						/>
						<label htmlFor="upload-voice">
							<Button variant="contained" color="primary" component="span" fullWidth>
								Upload your voice
							</Button>
						</label>
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
