console.log("Let write javascript");
const playLib = document.querySelector(".play-lib");
let currSongs = new Audio;
let songs;
let play = document.querySelector(".playbtn");
let songtime = document.querySelector(".songtime");
let songname = document.querySelector(".songname");
let previous = document.querySelector(".back");
let next = document.querySelector(".next");


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
getSongs();

const playMusic = (track, pause = false) => {
    currSongs.src = "/songs/" + track

    if (!pause) {
        currSongs.play();
        play.src = "Assest img/logo/pause.png";
    }
    songname.innerHTML = decodeURI(track);
    songtime.innerHTML = "00:00/00:00";
}

async function main() {

    // get the list of all songs
    songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true)

    // show all the songs in playlist menu
    let songUl = playLib.getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                            <img src="Assest img/logo/music-note-white.png" alt="Ablum Photo">
                            <div class="songinfo">
                                <p>${song.replaceAll("%20", " ")}</p>
                                <p>Pankaj Kumar</p>
                            </div>
                            <img src="Assest img/logo/play.png" alt="Play"> </li>`
    }

    // attach a invent lisner to each songs
    Array.from(document.querySelector(".play-lib").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
        })
    })

    play.addEventListener("click", () => {
        if (currSongs.paused) {
            currSongs.play();
            play.src = "Assest img/logo/pause.png";
        }
        else {
            currSongs.pause();
            play.src = "Assest img/logo/play-button-white.png";
        }
    })

    // Listen for time update function
    currSongs.addEventListener("timeupdate", () => {
        console.log(currSongs.currentTime, currSongs.duration);
        songtime.innerHTML = `${formatTime(currSongs.currentTime)}:${formatTime(currSongs.duration)}`
        document.querySelector(".circle").style.left = (currSongs.currentTime) / (currSongs.duration) * 100 + "%";
    })

    // add event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        currSongs.currentTime = ((currSongs.duration) * per) / 100;
    })

    //Add event listener to previous
    previous.addEventListener("click", () => {
        currSongs.pause();
        console.log("Previous clicked")
        let index = songs.indexOf(currSongs.src.split("/").slice(4)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // // Add event listener to next
    next.addEventListener("click", () => {
        console.log("next clicked");
        currSongs.pause();
        let index = songs.indexOf(currSongs.src.split("/").slice(4)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add event to volume btn
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Setting volume to", e.target.value + "/ 100");
        currSongs.volume = parseInt(e.target.value)/100
    })

}

main();

