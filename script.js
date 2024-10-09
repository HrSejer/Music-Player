const PlayPauseBtn = document.getElementById("Play/PauseBtn");
const PlayPauseImg = document.getElementById("PlayPauseImg");
const VolBtn = document.getElementById("VolBtn");
const VolImg = document.getElementById("VolImg");
const volumeSliderInp = document.getElementById("volume-slider-inp");
const volumeSliderProg = document.getElementById("volume-slider-prog");
const songTimeInput = document.getElementById("SongTimeInp");
const songTimeProgress = document.getElementById("SongTimeProg");
const currentTimeDisplay = document.getElementById("current-time");
const durationTimeDisplay = document.getElementById("duration-time");
const audioPlayer = document.getElementById("audio-player");
const prevBtn = document.getElementById("PrevBtn");
const SkipBtn = document.getElementById("SkipBtn");
const songName = document.getElementById("SongName");
const artistName = document.getElementById("ArtistName");
const addSongForm = document.getElementById("add-song-form");
const songList = document.getElementById("SongList");
const songQueue = document.getElementById("SongQueue");

//Har lavet måden sangene bliver afspillet på om, så at jeg kan have flere sange via en liste.
const songs = [
    { title: "When I'm Alone", artist: "Post Malone", src: "Sange/Post Malone - When Im Alone (Audio).mp3" },
    { title: "Not Like Us", artist: "Kendrick Lamar", src: "Sange/Not Like Us.mp3" },
    { title: "Good News", artist: "Mac Miller", src: "Sange/Mac Miller - Good News.mp3" }
];

let currentSongIndex = 0;
const queue = [];

//Har lavet en loadsong metode som bruges til at loade sange i listen, sætter max value af progressbar og viser hvor lang sangen er.
function loadSong(index) {
    const song = songs[index];
    audioPlayer.src = song.src;
    songName.textContent = song.title;
    artistName.textContent = song.artist;

    audioPlayer.onloadedmetadata = function () {
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
        PlayPauseImg.src = "Billeder/pause-regular-24.png";
    } else {
        PlayPauseImg.src = "Billeder/play-regular-24.png";
    }
    PlayImg = !PlayImg;
});

audioPlayer.addEventListener("ended", function () {
    if (queue.length > 0) {
        skipSong();
    } else {
        PlayPauseImg.src = "Billeder/play-regular-24.png";
        PlayImg = true;
    }
});

//Volume progress og slider er parallel med hinanden og skifter billede hvis volume = 0
slider = document.querySelector("input");
slider.oninput = function () {
    progressBar = document.querySelector("progress");
    progressBar.value = slider.value;
    if (slider.value == 0) {
        VolImg.src = "Billeder/volume-mute-regular-24.png";
    } else {
        VolImg.src = "Billeder/volume-full-regular-24.png";
    }
};

//Skift billede for lyd og mute, og mute/unmute hvis klikket
let VolFullImg = true;
VolBtn.addEventListener("click", function () {
    if (VolFullImg) {
        VolImg.src = "Billeder/volume-mute-regular-24.png";
        slider.value = 0;
        audioPlayer.volume = 0;
    } else {
        VolImg.src = "Billeder/volume-full-regular-24.png";
        slider.value = 1;
        audioPlayer.volume = 1;
    }
    VolFullImg = !VolFullImg;
});

//Ændre volume via slider og knap
volumeSliderInp.addEventListener("input", function () {
    audioPlayer.volume = volumeSliderInp.value;
});

function playSong() {
    audioPlayer.play();
}

function pauseSong() {
    audioPlayer.pause();
}

//Gå videre til næste sang i listen, hvis man er ved den sidste går den tilbage til starten.
function skipSong() {
    if (queue.length > 0) {
        const songFromQueue = queue.shift();
        loadSong(parseInt(songFromQueue.getAttribute('data-index')));
        loadQueueUI();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    }
    PlayPauseImg.src = "Billeder/play-regular-24.png";
}

//Gå tilbage til den forrige sang i listen, hvis man er ved den første går den til den sidste sang i listen.
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    PlayPauseImg.src = "Billeder/play-regular-24.png";
}

//Afspil en sang
PlayPauseBtn.addEventListener("click", function () {
    if (audioPlayer.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

SkipBtn.addEventListener("click", skipSong);
prevBtn.addEventListener("click", prevSong);

//Sætter progressbar på hvor lang man er i sangen og viser hvor langt man er i sangen via currentTimeDisplay.
function updateProgressBar() {
    songTimeInput.value = audioPlayer.currentTime;
    songTimeProgress.value = audioPlayer.currentTime;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
}

function seek(event) {
    audioPlayer.currentTime = event.target.value;
    songTimeProgress.value = audioPlayer.currentTime;
}

//Blev nødt til at lave en formattime for uden den bliver der bare displayet sekunder
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

songTimeInput.addEventListener("input", seek);
audioPlayer.addEventListener("timeupdate", updateProgressBar);

//Sanglisten laver et "li" element for hver sang i listen, og man kan også klikke på en af de "li" for at afspille den sang.
songs.forEach((song, index) => {
    const listItem = document.createElement("li");
    const buttonRemove = document.createElement('button');
    buttonRemove.textContent = 'X';
    buttonRemove.className = 'buttonRemove';

    const buttonQueue = document.createElement('button');
    buttonQueue.textContent = '+';
    buttonQueue.className = 'buttonQueue';

    listItem.textContent = `${song.title} - ${song.artist}`;
    listItem.setAttribute('data-index', index);

    listItem.addEventListener('click', function () {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        PlayPauseImg.src = "Billeder/play-regular-24.png";
    });

    buttonRemove.addEventListener('click', function () {
        listItem.remove();
        songs.splice(index, 1);
    });

    buttonQueue.addEventListener('click', function (event) {
        event.stopPropagation();
        queue.push(listItem);
        loadQueueUI();
    });

    songList.appendChild(listItem);
    listItem.appendChild(buttonQueue);
    listItem.appendChild(buttonRemove);
});

//Læser sang fil med filereader, opdaterer listen med alle sangene, laver en ny list item, tilføjer den til listen og laver et click event til den.
addSongForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('song-title').value;
    const artist = document.getElementById('artist-name').value;
    const file = document.getElementById('song-file').files[0];
    const newListItem = document.createElement('li');

    const buttonRemove = document.createElement('button');
    buttonRemove.textContent = 'X';
    buttonRemove.className = 'buttonRemove';

    const buttonQueue = document.createElement('button');
    buttonQueue.textContent = '+';
    buttonQueue.className = 'buttonQueue';

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const newSong = {
                title: title,
                artist: artist,
                src: e.target.result
            };
            songs.push(newSong);
            newListItem.textContent = `${title} - ${artist}`;
            newListItem.setAttribute('data-index', songs.length - 1);

            newListItem.addEventListener('click', function () {
                currentSongIndex = parseInt(newListItem.getAttribute('data-index'));
                loadSong(currentSongIndex);
                PlayPauseImg.src = "Billeder/play-regular-24.png";
            });

            songList.appendChild(newListItem);
            newListItem.appendChild(buttonQueue);
            newListItem.appendChild(buttonRemove);
        };
        reader.readAsDataURL(file);
    }

    // Event listener for remove button
    buttonRemove.addEventListener('click', function (event) {
        event.stopPropagation();
        newListItem.remove();
        const songIndex = parseInt(newListItem.getAttribute('data-index'));
        songs.splice(songIndex, 1);

        const allListItems = document.querySelectorAll('#songList li');
        allListItems.forEach((item, index) => {
            item.setAttribute('data-index', index);
        });
    });

    buttonQueue.addEventListener('click', function (event) {
        event.stopPropagation();
        queue.push(newListItem);
        loadQueueUI();
    });
    addSongForm.reset();
});

function loadQueueUI() {
    songQueue.innerHTML = '';
    queue.forEach((songqueue, index) => {
        const queueItem = document.createElement('li');
        queueItem.textContent = songqueue.textContent;
        queueItem.setAttribute('data-index', songqueue.getAttribute('data-index'));

        const buttonRemove = document.createElement('button');
        buttonRemove.textContent = 'X';
        buttonRemove.addEventListener('click', function () {
            queue.splice(index, 1);
            loadQueueUI();
        });

        function moveArrayElement(arr, from, to) {
            if (to >= arr.length || to < 0) return;
            arr.splice(to, 0, arr.splice(from, 1)[0]); 
        }

        function moveUp(index) {
            moveArrayElement(queue, index, index - 1); 
            loadQueueUI(); 
        }

        function moveDown(index) {
            moveArrayElement(queue, index, index + 1); 
            loadQueueUI(); 
        }

        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.addEventListener('click', function () {
            moveUp(index); 
        });

        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.addEventListener('click', function () {
            moveDown(index); 
        });

        queueItem.appendChild(upBtn);
        queueItem.appendChild(downBtn);
        queueItem.appendChild(buttonRemove);
        songQueue.appendChild(queueItem);
    });
}