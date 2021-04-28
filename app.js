const colorDivs = document.querySelectorAll('.color');
const genBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"')
const currentHexes = document.querySelectorAll('.color h2')
let initialColors;




function genHex() {
    // const letters = '123456789ABCDEF'
    // let hash = '#'
    // for (let i = 0; i < 6; i++) {
    //     hash += letters[Math.floor(Math.random() * 15)]
    // }
    // return hash

    hexCode = chroma.random();
    return hexCode
}
console.log(colorDivs)

function randomColors() {
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = genHex();
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        //change color of displayed hex based on contrast
        checkContrast(hexText, randomColor)
    });
}

function checkContrast(text, color) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = '#000';
    } else {
        text.style.color = '#fff';
    }
}

randomColors()