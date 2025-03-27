const songs = [
    {
        title:'Waltz in a blizzard',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltz in a blizzard.pdf',
    },
    {
        title: 'Waltz no. 2',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltz no. 2.pdf',
    },
    {
        title: 'Waltzette no. 6',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltzette no. 6.pdf',
    },
    {
        title:'Waltzette no. 7',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltzette no. 7.pdf',
    },
    {
        title:'Waltzette no. 8',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltzette no. 8.pdf',
    },
    {
        title:'Waltzette',
        artists:'Andrew Burnah',
        filePath:'compositions/Waltzette.pdf',
    }
];

const songListContainer = document.getElementById("song-list");

songs.forEach( (song) => {
    const songDiv = document.createElement('div');
    songDiv.classList.add('song');
    songDiv.innerHTML = `
        <h2>${song.title}</h2>
        <p>By: ${song.artists}</p>
        <a href="${song.filePath}" download>Download PDF</a>
    `;
    songListContainer.appendChild(songDiv);
})
