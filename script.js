const PlayPauseBtn = document.getElementById("Play/PauseBtn")
const PlayPauseImg = document.getElementById("PlayPauseImg")
const VolBtn = document.getElementById("VolBtn")
const VolImg = document.getElementById("VolImg")
const volumeSliderInp = document.getElementById("volume-slider-inp")
const volumeSliderProg = document.getElementById("volume-slider-prog")
const songTimeInput = document.getElementById("SongTimeInp");
const songTimeProgress = document.getElementById("SongTimeProg");
const currentTimeDisplay = document.getElementById("current-time");
const durationTimeDisplay = document.getElementById("duration-time");
const audioPlayer = document.getElementById("audio-player")

//Har lavet måden sangene bliver afspillet på om, så at jeg kan have flere sange via en liste.
const songs = [
    {title: "When Im Alone", artist: "Post Malone", src: "Sange/Post Malone - When Im Alone (Audio).mp3"}
];
let currentSongIndex = 0;

//Har lavet en loadsong metode som bruges til at loade sange i listen, sætter max value af progressbar og viser hvor lang sangen er.
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;

    audioPlayer.onloadedmetadata = function() {
        songTimeInput.max = audioPlayer.duration;
        songTimeProgress.max = audioPlayer.duration;
        durationTimeDisplay.textContent = formatTime(audioPlayer.duration);
    };
}
loadSong(currentSongIndex);

//Skift billede for pause og play
let PlayImg = true;
PlayPauseBtn.addEventListener("click", function () {
    if (PlayImg) {
        PlayPauseImg.src = "Billeder/pause-regular-24.png"
    }
    else {
        PlayPauseImg.src = "Billeder/play-regular-24.png"
    }
    PlayImg = !PlayImg;
});

//Resetter play/pausebtn til play når sangen er færdig.
audioPlayer.addEventListener("ended", function () {
    PlayPauseImg.src = "Billeder/play-regular-24.png"; 
    PlayImg = true; 
});

//Volume progress og slider er parallel med hinanden og skifter billede hvis volume = 0
slider = document.querySelector("input");
slider.oninput = function () {
    progressBar = document.querySelector("progress")
    progressBar.value = slider.value
    if (slider.value && progressBar.value == 0) {
        VolImg.src = "Billeder/volume-mute-regular-24.png"
    }
    else {
        VolImg.src = "Billeder/volume-full-regular-24.png"
    }
}

//Skift billede for lyd og mute, og mute/unmute hvis klikket
let VolFullImg = true;
VolBtn.addEventListener("click", function () {
    if (VolFullImg) {
        VolImg.src = "Billeder/volume-mute-regular-24.png"
        slider.value = 0;
        progressBar = document.querySelector("progress")
        progressBar.value = slider.value;
        audioPlayer.volume = 0;
    }
    else {
        VolImg.src = "Billeder/volume-full-regular-24.png"
        slider.value = 1;
        progressBar.value = slider.value;
        audioPlayer.volume = 1;
    }
    VolFullImg = !VolFullImg;
});

//Ændre volume via slider og knap
volumeSliderInp.addEventListener("input", function () {
    audioPlayer.volume = volumeSliderInp.value;
})

function playSong() {
    audioPlayer.play();
}

function pauseSong() {
    audioPlayer.pause();
}

//Afspil en sang
PlayPauseBtn.addEventListener("click", function () {
    if (audioPlayer.paused) {
        playSong();
    }
    else {
        pauseSong();
    }
})

//Sætter progressbar på hvor lang man er i sangen og viser hvor langt man er i sangen via currentTimeDisplay.
function updateProgressBar() {
    songTimeInput.value = audioPlayer.currentTime;
    songTimeProgress.value = audioPlayer.currentTime;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
}
//Seek funktionen bliver brugt til at gøre progressbaren parallel med sangen der afspilles.
function seek(event) {
    audioPlayer.currentTime = event.target.value;
    songTimeProgress.value = audioPlayer.currentTime;
}

//Blev nødt til at lave en formattime for uden den bliver 3 minutter og 15 sec displayet som 195.239184
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

songTimeInput.addEventListener("input", seek);
audioPlayer.addEventListener("timeupdate", updateProgressBar);