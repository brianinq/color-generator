const colorDivs = document.querySelectorAll('.color');
const genBtn = document.querySelector('.generate')
const sliders = document.querySelectorAll('input[type="range"')
const currentHexes = document.querySelectorAll('.color h2')
let initialColors;
const locks = document.querySelectorAll('.lock')
const popup = document.querySelector('.copy-container')
const adjustBtn = document.querySelectorAll('.adjust')
const closeAdjustment = document.querySelectorAll('.close-adjustment')
const sliderContainers = document.querySelectorAll('.sliders')
//local storage
let savedPalettes = [];

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
adjustBtn.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        openPanel(index)
    })
})
closeAdjustment.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        closePanel(index);
    })
})
genBtn.addEventListener('click', randomColors)

locks.forEach((lock, index) => {
    lock.addEventListener('click', () => {
        colorDivs[index].classList.add('locked')
        lock.children[0].classList.toggle('fa-lock-open')
        lock.children[0].classList.toggle('fa-lock')
    })
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
        //lock color
        if (div.classList.contains('locked')) {
            initialColors.push(hexText.innerText)
            return
        } else {
            initialColors.push(chroma(randomColor).hex())
        }
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

function openPanel(index) {
    sliderContainers[index].classList.toggle('active')
}

function closePanel(index) {
    sliderContainers[index].classList.remove('active')
}


//local storage
const saveBtn = document.querySelector('.save')
const submitSave = document.querySelector('.submit-save')
const closeSave = document.querySelector('.close-save')
const saveContainer = document.querySelector('.save-container')
const saveInput = document.querySelector('.save-name')
const libraryContainer = document.querySelector('.library-container')
const libraryBtn = document.querySelector('.library')
const closelibraryBtn = document.querySelector('.close-library')

saveBtn.addEventListener('click', openPalette)
closeSave.addEventListener('click', closePalette)
submitSave.addEventListener('click', savePalette)
libraryBtn.addEventListener('click', openLibrary)
closelibraryBtn.addEventListener('click', closeLibrary)

function openPalette(event) {
    const popup = saveContainer.children[0]
    saveContainer.classList.add('active');
    popup.classList.add('active')
}

function closePalette(event) {
    const popup = saveContainer.children[0]
    saveContainer.classList.remove('active');
    popup.classList.remove('active')
}

function savePalette(event) {
    saveContainer.classList.remove('active')
    saveContainer.children[0].classList.remove('active')
    const name = saveInput.value;
    const colors = []
    currentHexes.forEach((hex) => {
        colors.push(hex.innerText)
    })
    let paletteNum = savedPalettes.length
    const paletteObject = {
        name: name,
        colors: colors,
        id: paletteNum
    }
    savedPalettes.push(paletteObject)

    //push to local storage
    saveToLocal(paletteObject)
    saveInput.value = '';

    // create palette for library
    const palette = document.createElement('div')
    palette.classList.add('custom-palette')
    const title = document.createElement('h4')
    title.innerText = paletteObject.name;
    const preview = document.createElement('div')
    preview.classList.add('small-preview')
    paletteObject.colors.forEach((color) => {
        const smallDiv = document.createElement('div')
        smallDiv.style.background = color
        preview.appendChild(smallDiv)
    })
    const paletteBtn = document.createElement('button')
    paletteBtn.classList.add('pick-palette-btn')
    paletteBtn.classList.add(paletteObject.id)
    paletteBtn.innerText = 'Select';

    paletteBtn.addEventListener('click', (event) => {
        closeLibrary();
        const palleteId = event.target.classList[1]
        initialColors = []
        savedPalettes[palleteId].colors.forEach((color, index) => {
            initialColors.push(color)
            colorDivs[index].style.background = color;
            const text = colorDivs[index].children[0]
            text.innerText = color;
            checkContrast(text, color);
            const icons = colorDivs[index].querySelectorAll('.controls button')
            icons.forEach((icon) => {
                checkContrast(icon, color)
            })
        })
        resetInputs()
    })


    // append to library
    palette.appendChild(title)
    palette.appendChild(preview)
    palette.appendChild(paletteBtn)
    libraryContainer.children[0].appendChild(palette)

}

function saveToLocal(paletteObject) {
    if (localStorage.getItem('palettes')) {
        localPalettes = JSON.parse(localStorage.getItem('palettes'))
    } else {
        localPalettes = []
    }
    localPalettes = [...localPalettes, paletteObject]
    localStorage.setItem('palettes', JSON.stringify(localPalettes))
}

function openLibrary() {
    libraryContainer.classList.add('active')
    libraryContainer.children[0].classList.add('active')
}

function closeLibrary() {
    libraryContainer.classList.remove('active')
    libraryContainer.children[0].classList.remove('active')
}

function getFromLocal() {
    if (localStorage.getItem('palettes')) {
        palleteOjects = JSON.parse(localStorage.getItem('palettes'))
        palleteOjects.forEach((paletteObject) => {
            const palette = document.createElement('div')
            palette.classList.add('custom-palette')
            const title = document.createElement('h4')
            title.innerText = paletteObject.name;
            const preview = document.createElement('div')
            preview.classList.add('small-preview')
            paletteObject.colors.forEach((color) => {
                const smallDiv = document.createElement('div')
                smallDiv.style.background = color
                preview.appendChild(smallDiv)
            })
            const paletteBtn = document.createElement('button')
            paletteBtn.classList.add('pick-palette-btn')
            paletteBtn.classList.add(paletteObject.id)
            paletteBtn.innerText = 'Select';

            paletteBtn.addEventListener('click', (event) => {
                closeLibrary();
                const paletteId = event.target.classList[1]
                initialColors = []
                palleteOjects[paletteId].colors.forEach((color, index) => {
                    initialColors.push(color)
                    colorDivs[index].style.background = color;
                    const text = colorDivs[index].children[0]
                    text.innerText = color;
                    checkContrast(text, color);
                    const icons = colorDivs[index].querySelectorAll('.controls button')
                    icons.forEach((icon) => {
                        checkContrast(icon, color)
                    })
                })
                resetInputs()
            })
            palette.appendChild(title)
            palette.appendChild(preview)
            palette.appendChild(paletteBtn)
            libraryContainer.children[0].appendChild(palette)
        })
    } else {
        paletteObect = []
    }
}

getFromLocal()
randomColors()