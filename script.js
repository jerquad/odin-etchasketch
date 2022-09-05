// Updates the resolution value on scroll
document.getElementById('rez-scroll').oninput = (e) => {
    const sizeLabels = [ 'x-bold', 'bold', 'medium', 'fine', 'x-fine' ];
    document.getElementById('rez-label').innerText = sizeLabels[e.target.value];
};

// Binding for reset button. Clears the board then rebuilds it.
document.getElementById('button-reset').addEventListener('click', () => {
    const sketchArea = document.getElementById('sketch-area');
    while (sketchArea.firstChild) {
        sketchArea.removeChild(sketchArea.firstChild);
    };
    makeEtchArea();
});

// Main function for building the draw area
const makeEtchArea = (function () {
    const allRez = [ 100, 50, 25, 10, 5 ];
    const rez = allRez[document.getElementById('rez-scroll').value];
    const width =  getComputedStyle(document.getElementById('sketch-area'))
        .getPropertyValue('width').slice(0, -2) / rez;
    const height = getComputedStyle(document.getElementById('sketch-area'))
        .getPropertyValue('height').slice(0, -2) / rez;
    for (let i = 0; i < height; i++) {
        const row = document.createElement('div');
        row.classList.add('container');
        for (let j = 0; j < width; j++) {
            row.appendChild(makeBlock(rez));
        }
        document.getElementById('sketch-area').appendChild(row);
    }
});

// Individual elements of the drawing area
const makeBlock = (function (rez) {
    const div = document.createElement('div')
    div.classList.add('etch-block');
    div.setAttribute(`style`,
        `background-color: rgba(255, 255, 255, 0);
        height: ${rez}px;
        width: ${rez}px;`);
    div.addEventListener('mouseover', (e) => {
        setColor(e.target)
    });
    return div;
});

//  Binding function for each block in the drawing area
const setColor = (function (block) {
    const rgba = getComputedStyle(block).getPropertyValue('background-color').split(', ');
    let shadeVal = getShadeValue(rgba[rgba.length - 1].slice(0, -1));
    block.style.backgroundColor = `rgba(1, 1, 1, ${Number(shadeVal)})`;
})

// Helper function to assess new shade value for each block
const getShadeValue = (function (curVal) {
    const shadeMode = document.getElementById('check-shader').checked;
    const reverseMode = document.getElementById('check-reverse').checked;
    if (!shadeMode && !reverseMode) { 
        return 1; 
    } else if (!shadeMode) { 
        return 0; 
    } else if (!reverseMode) {
        return Number(curVal) + 0.1;
    } else {
        return Number(curVal) - 0.1;
    }
});

// Initial load-in
makeEtchArea();