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
const prevBtn = document.getElementById("PrevBtn")
const SkipBtn = document.getElementById("SkipBtn")
const songName = document.getElementById("SongName")
const artistName = document.getElementById("ArtistName")

//Har lavet måden sangene bliver afspillet på om, så at jeg kan have flere sange via en liste.
const songs = [
    {title: "When Im Alone", artist: "Post Malone", src: "Sange/Post Malone - When Im Alone (Audio).mp3"},
    {title: "Not Like Us", artist: "Kendrick Lamar", src: "Sange/Not Like Us.mp3"},
    {title: "Good News", artist: "Mac Miller", src: "Sange/Mac Miller - Good News.mp3"},
    {title: "Self Care", artist: "Mac Miller", src: "Sange/Mac Miller - Self Care.mp3"}
];
let currentSongIndex = 0;

//Har lavet en loadsong metode som bruges til at loade sange i listen, sætter max value af progressbar og viser hvor lang sangen er.
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    songName.textContent = song.title;
    artistName.textContent = song.artist;

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

//Gå videre til næste sang i listen, hvis man er ved den sidste går den tilbage til starten.
function skipSong(){
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

//Gå tilbage til den forrige sang i listen, hvis man er ved den første går den til den sidste sang i listen.
function prevSong(){
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
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

SkipBtn.addEventListener("click", skipSong);

prevBtn.addEventListener("click", prevSong);

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

//Sanglisten laver et "li" element for hver sang i listen, og man kan også klikke på en af de "li" for at afspille den sang.
songs.forEach((song, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${song.title} - ${song.artist}`;
    listItem.setAttribute('data-index', index);
    listItem.addEventListener('click', function() {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        playSong();
    });
    document.getElementById("SongList").appendChild(listItem);
});