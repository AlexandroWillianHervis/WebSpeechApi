import SpeechApi from './SpeechApi';

window.addEventListener('DOMContentLoaded', () => {
	if (SpeechApi) {
		const speechRecognition = new SpeechTranscription();
		speechRecognition.render();
		return;
	}
	document.getElementById('main').innerHTML = 'API não esta disponível';
});
class SpeechTranscription {
	constructor() {
		this.btnTranscription = document.getElementById('button-record');
		this.transcriptionElement = document.getElementById('transcription');
		this.transcription = '';
		this.isRecording = false;
		this.audioRecordApi = new SpeechApi();
	}

	render() {
		this.btnTranscription.addEventListener('click', () => {
			this.isRecording ? this.audioRecordApi.stop() : this.init();
		});
	}
	init() {
		this.audioRecordApi.start();
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
		let transcript = '';
		for (let index = event.resultIndex; index < event.results.length; index++) {
			if (event.results[index].isFinal) {
				this.transcription += event.results[index][0].transcript;
			} else {
				transcript += event.results[index][0].transcript;
			}

			this.transcriptionElement.innerText = this.transcription || transcript;
		}
	}
}
