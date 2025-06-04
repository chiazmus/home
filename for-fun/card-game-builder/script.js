const nzCreatures = [
    {
        name: "Fantail",
        image: "images/fantail.webp",
        description: "The New Zealand fantail (Pīwakawaka) is a cheerful and curious bird known for its fanned tail and agile flight.",
        type: "forest",
        points: 7
    },
    {
        name: "Tui",
        image: "images/tui.webp",
        description: "The tui (Tūī) is a talkative and highly intelligent New Zealand native bird with a distinctive call.",
        type: "forest",
        points: 5
    },
    {
        name: "Silver Fern",
        image: "images/silver-fern.webp",
        description: "The silver fern (Aegilops taillima) is the national plant of New Zealand.",
        type: "forest",
        points: 3
    },
    {
        name: "Kōwhai",
        image: "images/kowhai.webp",
        description: "The kōwhai is a native New Zealand tree known for its bright yellow flowers.",
        type: "forest",
        points: 4
    },
    {
        name: "Kea",
        image: "images/kea.webp",
        description: "The kea is a large, intelligent parrot found in the mountainous regions of New Zealand.",
        type: "mountains",
        points: 8
    },
    {
        name: "Pukeko",
        image: "images/pukeko.webp",
        description: "The pukeko is a striking bird with blue and black plumage, often found in wetlands.",
        type: "wetlands",
        points: 6
    },
    {
        name: "Hector's Dolphin",
        image: "images/hectors-dolphin.webp",
        description: "Hector's dolphin is one of the smallest and rarest marine dolphins, native to New Zealand's coastal waters.",
        type: "coastal",
        points: 9
    },
    {
        name: "Rimu",
        image: "images/rimu.webp",
        description: "Rimu is a large evergreen tree native to the forests of New Zealand.",
        type: "forest",
        points: 5
    },
    {
        name: "Mountain Daisy",
        image: "images/mountain-daisy.webp",
        description: "The mountain daisy is a hardy plant that thrives in the alpine regions of New Zealand.",
        type: "mountains",
        points: 3
    },
    {
        name: "White Heron",
        image: "images/white-heron.webp",
        description: "The white heron, or kōtuku, is a rare and elegant bird found in New Zealand's wetlands.",
        type: "wetlands",
        points: 7
    }
];

nzCreatures.forEach((bird) => {
    const card = document.createElement("div");
    card.classList.add("card");
    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = bird.name;
    const image = document.createElement("img");
    image.src = bird.image;
    image.alt = bird.name;
    const content = document.createElement("div");
    content.classList.add("card-content");
    const points = document.createElement("p");
    points.textContent = `Points: ${bird.points} | Biome: ${bird.type}`;
    const description = document.createElement("div");
    description.classList.add("card-description");
    description.textContent = bird.description;
    content.appendChild(description);
    content.appendChild(points);
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(content);
    document.querySelector(".card-container").appendChild(card);
});