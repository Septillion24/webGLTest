function setPixel(canvas, x, y, r, g, b, a) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.createImageData(1, 1); // Creates a new, blank ImageData object
    var data = imageData.data;

    data[0] = r; // Red
    data[1] = g; // Green
    data[2] = b; // Blue
    data[3] = a; // Alpha

    ctx.putImageData(imageData, x, y);
}

const canvas = document.getElementById("demo-canvas");

function invertColors(canvas) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
}

function setGradiant(canvas) {
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            let r = (x / canvas.width) * 255;
            let g = (y / canvas.height) * 255;
            setPixel(canvas, x, y, r, g, 0, 255);
        }
    }
}

function displayFunction(canvas) {
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            if(testfunction(x) == y)
            {
                setPixel(canvas, x, y, 255, 255, 255, 255);
            }
            else
            {
                setPixel(canvas, x, y, 0, 0, 0, 255);
            }
        }
    }
}

function testfunction(x) {
    return canvas.height-x;
}

function showError(errorText) {
    const errorBoxDiv = document.getElementById("error-box");
    const errorTextElement = document.createElement("p");
    errorTextElement.innerText = errorText;
    errorBoxDiv.appendChild(errorTextElement);
    console.log(errorText);
}

try {
    displayFunction(canvas);
} catch (e) {
    showError(e);
}
