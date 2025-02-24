import domtoimage from "dom-to-image";

document.getElementById(`capture_button`).addEventListener("click", () => {
    const capture = document.getElementById(`capture`);

    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    domtoimage.toPng(capture)
    .then(data => {
        const link = document.createElement(`a`);
        link.href = data;
        link.download = `${document.getElementById(`character_name`).textContent}-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        link.click();
    })
})