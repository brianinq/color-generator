const colorDivs = document.querySelectorAll('.color');
const genBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"')
const currentHexes = document.querySelectorAll('.color h2')
let initialColors;
const popup = document.querySelector('.copy-container')

//listeners

sliders.forEach((slider) => {
    slider.addEventListener('input', hslControls)
})
colorDivs.forEach((slider, index) => {
    slider.addEventListener('change', () => {
        updateText(index)
    })
})
currentHexes.forEach((hex) => {
    hex.addEventListener('click', () => {
        copyToClipboard(hex)
    })
})
popup.addEventListener('animationend', () => {
    popup.classList.remove('active')
    popup.children[0].classList.remove('active')
});




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

function randomColors() {
    initialColors = []
    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = genHex();
        const icons = div.querySelectorAll('.controls button')
        initialColors.push(chroma(randomColor).hex())
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        //change color of displayed hex based on contrast
        checkContrast(hexText, randomColor)
        icons.forEach((icon) => {
            checkContrast(icon, randomColor)
        })
        //color slider

        const color = chroma(randomColor)
        const sliders = div.querySelectorAll('.sliders input')
        const hue = sliders[0]
        const brightness = sliders[1]
        const saturation = sliders[2]

        colourizeSliders(color, hue, brightness, saturation);
    });
    //reset input
    resetInputs();

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


function hslControls(event) {
    const index = event.target.getAttribute('data-bright') || event.target.getAttribute('data-sat') || event.target.getAttribute('data-hue');
    let sliders = event.target.parentElement.querySelectorAll('input[type="range"')
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]
    const background = initialColors[index]
    console.log(background)

    let color = chroma(background)
        .set('hsl.l', brightness.value)
        .set('hsl.s', saturation.value)
        .set('hsl.h', hue.value)

    colorDivs[index].style.backgroundColor = color;

    //update sliders 
    colourizeSliders(color, hue, brightness, saturation)
}

function updateText(index) {
    const activeDiv = colorDivs[index]
    const color = chroma(activeDiv.style.backgroundColor)
    const hexText = activeDiv.querySelector('h2')
    const icons = activeDiv.querySelectorAll('.controls button')
    hexText.innerText = color.hex();

    checkContrast(hexText, color)
    icons.forEach((icon) => {
        checkContrast(icon, color)
    })

}

function resetInputs() {
    sliders.forEach((slider) => {
        if (slider.name === 'hue') {
            hueColor = initialColors[slider.getAttribute('data-hue')]
            hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue)
        }

        if (slider.name === 'saturation') {
            saturationColor = initialColors[slider.getAttribute('data-sat')]
            saturationValue = chroma(saturationColor).hsl()[1]
            slider.value = Math.floor(saturationValue * 100) / 100
        }

        if (slider.name === 'brightness') {
            brightnessColor = initialColors[slider.getAttribute('data-bright')]
            brightnessValue = chroma(brightnessColor).hsl()[2]
            slider.value = Math.floor(brightnessValue * 100) / 100
        }
    })
}


function copyToClipboard(hex) {
    const element = document.createElement('textarea')
    element.value = hex.innerText;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element)

    //pop up
    const popupBox = popup.children[0]
    popup.classList.add('active')
    popupBox.classList.add('active')
}

randomColors()