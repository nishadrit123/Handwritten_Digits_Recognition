var context, canvas;
var currentX = 0, currentY = 0, previousX = 0, previousY = 0;

function prepareCanvas() {
    var isPainting = false;

    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d', { willReadFrequently: true });

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.lineJoin = 'round';

    document.addEventListener('mousedown', function(event){
        console.log("Clicked");
        isPainting = true;
        currentX = event.clientX - canvas.offsetLeft;
        currentY = event.clientY - canvas.offsetTop;
    });

    document.addEventListener('mouseup', function(){
        console.log("Released");
        isPainting = false;
    });

    document.addEventListener('mousemove', function(event){
        if (isPainting) {
            previousX = currentX;
            currentX = event.clientX - canvas.offsetLeft;
        
            previousY = currentY;
            currentY = event.clientY - canvas.offsetTop;

            draw();
        }
    });

    canvas.addEventListener('mouseleave', function(){
        isPainting = false;
    });

    canvas.addEventListener('touchstart', function (event) {
        isPainting = true;
        currentX = event.touches[0].clientX - canvas.offsetLeft;
        currentY = event.touches[0].clientY - canvas.offsetTop;
    });

    canvas.addEventListener('touchend', function (event) {
        isPainting = false;
    });

    canvas.addEventListener('touchcancel', function (event) {
        isPainting = false;
    });

    canvas.addEventListener('touchmove', function (event) {
        if (isPainting) {
            previousX = currentX;
            currentX = event.touches[0].clientX - canvas.offsetLeft;

            previousY = currentY;
            currentY = event.touches[0].clientY - canvas.offsetTop;

            draw();
        }
    });
}

function draw() {
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(currentX, currentY);
    context.closePath();
    context.stroke();
}

function clearCanvas() {
    currentX = 0;
    currentY = 0;
    previousX = 0;
    previousY = 0;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}