const songs = [
    {
        title: "Singularity",
        artists: "Andrew Burnah and William Burnah",
        filePath: "music/Singularity.mp3"
    },
    {
        title: "Cerebrosis",
        artists: "Andrew Burnah",
        filePath: "music/Cerebrosis.mp3"
    },
    {
        title: "Alarm Bells",
        artists: "Andrew Burnah",
        filePath: "music/Alarm Bells.mp3"
    },
    {
        title: "Machine Revolution",
        artists: "Andrew Burnah and William Burnah",
        filePath: "music/Machine Revolution.mp3"
    },
    {
        title: "Something New",
        artists: "Andrew Burnah",
        filePath: "music/something-new.mp3"
    },
    {
        title: "Postmortem Vengeance",
        artists: "Andrew Burnah and William Burnah",
        filePath: "music/Postmortem Vengeance.mp3"
    },
    {
        title: "Mysteria Electrum",
        artists: "Andrew Burnah",
        filePath: "music/Mysteria Electrum.mp3"
    }
];

const songListContainer = document.getElementById("song-list");

songs.forEach( (song) => {
    const songDiv = document.createElement('div');
    songDiv.classList.add('song');
    songDiv.innerHTML = `
        <h2>${song.title}</h2>
        <p>By: ${song.artists}</p>
        <audio controls>
            <source src="${song.filePath}" type="audio/mp3">
        </audio>
    `;
    songListContainer.appendChild(songDiv);
})
