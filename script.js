const PlayPauseBtn = document.getElementById("Play/PauseBtn")
const PlayPauseImg = document.getElementById("PlayPauseImg")
const VolBtn = document.getElementById("VolBtn")
const VolImg = document.getElementById("VolImg")
const song = document.getElementById("Song")
const volumeSliderInp = document.getElementById("volume-slider-inp")
const volumeSliderProg = document.getElementById("volume-slider-prog")

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
}
);

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
        song.volume = 0;
    }
    else {
        VolImg.src = "Billeder/volume-full-regular-24.png"
        slider.value = 1;
        progressBar.value = slider.value;
        song.volume = 1;
    }
    VolFullImg = !VolFullImg;
});

//Ændre volume via slider og knap
volumeSliderInp.addEventListener("input", function () {
    song.volume = volumeSliderInp.value;
})

//Afspil en sang
PlayPauseBtn.addEventListener("click", function () {
    if (song.paused) {
        song.play();
    }
    else {
        song.pause();
    }
})
