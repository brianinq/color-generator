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
    return hexCode;
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

        //color slider

        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]
        console.log(sliders)

        colourizeSliders(color, hue, brightness, saturation);
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

function colourizeSliders(color, hue, brightness, saturation) {
    const noSaturation = color.set('hsl.s', 0)
    const fullSaturation = color.set('hsl.s', 1)
    // set saturation scale from low to the current color to high
    const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation])
    // set input saturation range
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(1)})`

    //btightness set scale
    const midBrightness = color.set('hsl.l', 0.5)
    // from dark to mid brightness to low light
    const scaleBrightness = chroma.scale(['black', midBrightness, 'white'])
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0.5)}, ${scaleBrightness(1)} )`

    //set hue (all RGBs)
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`
}



randomColors()