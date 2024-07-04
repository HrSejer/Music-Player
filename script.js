//Skift billede for play og pause
const PlayPauseBtn = document.getElementById("Play/PauseBtn")
const PlayPauseImg = document.getElementById("PlayPauseImg")
let PlayImg = true;

document.getElementById("Play/PauseBtn").addEventListener("click", function () {
    if (PlayImg) {
        PlayPauseImg.src = "Billeder/pause-regular-24.png"
    }
    else {
        PlayPauseImg.src = "Billeder/play-regular-24.png"
    }
    PlayImg = !PlayImg;
}
);

//Skift billede for lyd og mute
const VolBtn = document.getElementById("VolBtn")
const VolImg = document.getElementById("VolImg")
let VolFullImg = true;

document.getElementById("VolBtn").addEventListener("click", function () {
    if (VolFullImg) {
        VolImg.src = "Billeder/volume-mute-regular-24.png"
        slider.value = 0;
        progressBar = document.querySelector("progress")
        progressBar.value = slider.value;
    }
    else {
        VolImg.src = "Billeder/volume-full-regular-24.png"
        slider.value = 100;
        progressBar.value = slider.value;
    }
    VolFullImg = !VolFullImg;
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