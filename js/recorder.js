MaiaRecorder = function (options) {this.opts={"startButton": "","pauseButton": "","stopButton": "","playButton": "","saveButton": "","videoPlayer": "","fileNamePrefix": "Screen-recording","mimeType": "video/webm"};this.if (core.different(core.type(options),"undefined")) {for (key in options) {var value = options[key];opts[key]=value;};};this.let startButton;this.let pauseButton;this.let stopButton;this.let playButton;this.let saveButton;this.let videoPlayer;this.let fileNamePrefix;this.let mimeType;this.let recorder;this.let recordingData=[];this.let recorderStream;this.let isPlaying=false;this.startButton=document.getElementById(opts["startButton"]);this.pauseButton=document.getElementById(opts["pauseButton"]);this.stopButton=document.getElementById(opts["stopButton"]);this.playButton=document.getElementById(opts["playButton"]);this.saveButton=document.getElementById(opts["saveButton"]);this.videoPlayer=document.getElementById(opts["videoPlayer"]);this.fileNamePrefix=opts["fileNamePrefix"];this.mimeType=opts["mimeType"];this.mixTracks = function (trackA,trackB) {ctx= new AudioContext();dest=ctx.createMediaStreamDestination();audioTracksA=trackA.getAudioTracks();if (core.GT(audioTracksA.length,0)) {mediaStreamSourceA=ctx.createMediaStreamSource(trackA);mediaStreamSourceA.connect(dest);};audioTracksB=trackB.getAudioTracks();if (core.GT(audioTracksB.length,0)) {mediaStreamSourceB=ctx.createMediaStreamSource(trackB);mediaStreamSourceB.connect(dest);};mixedTracks=dest.stream.getTracks();mixedTracks=mixedTracks.concat(trackA.getVideoTracks());mixedTracks=mixedTracks.concat(trackB.getVideoTracks());mediaStream= new MediaStream(mixedTracks);return (mediaStream);};this.getFilename = function () {now= new Date();timestamp=now.toISOString();fileName=core.add(core.add(fileNamePrefix,"-"),timestamp);return (fileName);};this.startRecording = async function () {let userMediaStream;let displayMediaStream;recordingData=[];audioOptions={"video": false,"audio": true};videoOptions={"video": {"displaySurface": "browser"},"audio": true};try {userMediaStream= await navigator.mediaDevices.getUserMedia(audioOptions);displayMediaStream= await navigator.mediaDevices.getDisplayMedia(videoOptions);} catch (e) {system.showMessageDialog("Error: screen recording is not supported by this browser.");return;};if (userMediaStream) {recorderStream=mixTracks(userMediaStream,displayMediaStream);} else {recorderStream=displayMediaStream;};recorder= new MediaRecorder(recorderStream,{"mimeType": mimeType});onDataAvailable = function (e) {if (core.logicalAND(e.data,core.GT(e.data.size,0))) {recordingData.push(e.data);};console.log("available");};onStop = function () {stopTrackRecording = function (track) {track.stop();};recorderStreamTracks=recorderStream.getTracks();recorderStreamTracks.forEach(stopTrackRecording);userMediaStreamTracks=userMediaStream.getTracks();userMediaStreamTracks.forEach(stopTrackRecording);displayMediaStreamTracks=displayMediaStream.getTracks();displayMediaStreamTracks.forEach(stopTrackRecording);};recorder.ondataavailable=onDataAvailable;recorder.onstop=onStop;onInactive = function () {stopRecording();console.log(recorder.state);};recorderStream.addEventListener("inactive",onInactive);recorder.start();startButton.innerText="Recording";startButton.disabled=true;pauseButton.disabled=false;stopButton.disabled=false;playButton.disabled=true;saveButton.disabled=true;console.log(recorder.state);};this.startButton.addEventListener("click",startRecording);this.stopRecording = function () {if (core.logicalOR((core.equal(recorder.state,"recording")),(core.equal(recorder.state,"paused")))) {recorder.stop();};startButton.disabled=false;pauseButton.disabled=true;stopButton.disabled=true;playButton.disabled=false;saveButton.disabled=false;startButton.innerText="Record";pauseButton.innerText="Pause";console.log(recorder.state);};this.stopButton.addEventListener("click",stopRecording);this.pauseRecording = function () {if (core.equal(recorder.state,"paused")) {recorder.resume();pauseButton.innerText="Pause";} else if (core.equal(recorder.state,"recording")) {recorder.pause();pauseButton.innerText="Resume";};console.log(recorder.state);};this.pauseButton.addEventListener("click",pauseRecording);this.playRecording = function () {videoPlayer.hidden=core.logicalNot(videoPlayer.hidden);if (core.logicalAND((core.logicalNot(isPlaying)),(core.logicalNot(videoPlayer.hidden)))) {videoSource= new Blob(recordingData,{"type": mimeType});videoPlayer.src=window.URL.createObjectURL(videoSource);videoPlayer.play();playButton.innerText="Hide";} else {playButton.innerText="Play";};};this.playButton.addEventListener("click",playRecording);this.setIsPlaying = function () {isPlaying=true;};this.unsetIsPlaying = function () {isPlaying=false;};this.videoPlayer.addEventListener("play",setIsPlaying);this.videoPlayer.addEventListener("pause",unsetIsPlaying);this.videoPlayer.addEventListener("playing",setIsPlaying);this.videoPlayer.addEventListener("ended",unsetIsPlaying);this.saveRecording = function () {blob= new Blob(recordingData,{"type": mimeType});url=window.URL.createObjectURL(blob);a=document.createElement("a");a.style.display="none";a.href=url;a.download=core.add(getFilename(),".webm");document.body.appendChild(a);a.click();removeDownloadLink = function () {document.body.removeChild(a);window.URL.revokeObjectURL(url);};setTimeout(removeDownloadLink,500);};this.saveButton.addEventListener("click",saveRecording);};