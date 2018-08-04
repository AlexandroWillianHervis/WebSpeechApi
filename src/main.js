import SpeechApi from './SpeechApi';

export default class SpeechTranscription {
	constructor() {
		this.btnTranscription = document.getElementById('button-record');
		this.transcriptionElement = document.getElementById('transcription');
		this.transcription = '';
		this.isRecording = false;
		this.audioRecordApi = new SpeechApi();
	}

	render() {
		if (!SpeechApi) {
			document.getElementById('root').innerHTML = 'API não está disponivel';
			return;
		}
		this.btnTranscription.addEventListener('click', () => {
			this.isRecording
				? this.audioRecordApi.stop()
				: this.audioRecordApi.start();
		});
		this.init();
	}
	init() {
		this.audioRecordApi.continuos = true;
		this.audioRecordApi.interimResults = true;
		this.audioRecordApi.lang = 'pt-BR';
		this.audioRecordApi.onstart = this.onstart.bind(this);
		this.audioRecordApi.onend = this.onend.bind(this);
		this.audioRecordApi.onresult = this.onresult.bind(this);
	}
	onstart() {
		this.isRecording = true;
		this.transcription = '';
		this.transcriptionElement.innerText = '';
		this.btnTranscription.innerHTML = 'Gravando';
		this.btnTranscription.classList.add('recording');
	}
	onend() {
		this.isRecording = false;
		this.btnTranscription.classList.remove('recording');
		this.btnTranscription.innerHTML = 'Começar a Gravar';
	}
	onresult(event) {
		let interim_transcript = '';

		for (let i = event.resultIndex; i < event.results.length; i++) {
			if (event.results[i].isFinal) {
				this.transcription += event.results[i][0].transcript;
			} else {
				interim_transcript += event.results[i][0].transcript;
			}

			this.transcriptionElement.innerText =
				this.transcription || interim_transcript;
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const speechRecognition = new SpeechTranscription();
	speechRecognition.render();
});
