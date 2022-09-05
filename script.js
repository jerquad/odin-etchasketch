// global variable used for keyboard controls
let cursor = null;

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

// All keyboard bindings as follows: 
document.addEventListener('keydown', (e) => {
    if (e.key == 'w') {
        let shadeCheck = document.getElementById('check-shader');
        shadeCheck.checked = (shadeCheck.checked) ? false : true;
    }

    if (e.key == 'e') {
        let revCheck = document.getElementById('check-reverse');
        revCheck.checked = (revCheck.checked) ? false: true;
    }
    
    if (e.key == '`') {
        const sketchArea = document.getElementById('sketch-area');
        if (getComputedStyle(sketchArea).getPropertyValue('background-color') == 'rgb(153, 153, 153)') {
            sketchArea.style.backgroundColor = 'rgb(255, 255 , 255)';
        } else {
            sketchArea.style.backgroundColor = 'rgb(153, 153, 153)';
        }
    }

    if (e.key == 'ArrowRight') {        
        if (cursor.nextElementSibling) {
            cursor = cursor.nextElementSibling;
        }
        setColor(cursor);
    }

    if (e.key == 'ArrowLeft') {
        if (cursor.previousElementSibling) { 
            cursor = cursor.previousElementSibling;
        }
        setColor(cursor);
    }

    if (e.key == 'a') {
        if (cursor.parentNode.nextSibling) {
            const pos = Array.prototype.indexOf.call(cursor.parentNode.children, cursor);
            cursor = cursor.parentNode.nextSibling.children[pos];
        }
        setColor(cursor);
    }

    if (e.key == 'd') {
        if (cursor.parentNode.previousSibling) {
            const pos = Array.prototype.indexOf.call(cursor.parentNode.children, cursor);
            cursor = cursor.parentNode.previousSibling.children[pos];
        }
        setColor(cursor);
    }
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
    cursor = document.getElementById('sketch-area').firstChild.firstChild;
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
        cursor = e.target;
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