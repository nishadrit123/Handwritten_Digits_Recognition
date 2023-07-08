var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
    let img = cv.imread(canvas);
    cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(img, img, 175, 255, cv.THRESH_BINARY);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    img = img.roi(rect);

    var height = img.rows;
    var width = img.cols;

    if (height > width) {
        height = 20;
        const scaleFactor = img.rows / height;
        width = Math.round(img.cols / scaleFactor);
    }
    else {
        width = 20;
        const scaleFactor = img.cols / width;
        height = Math.round(img.rows / scaleFactor);
    }

    let newSize = new cv.Size(width, height);
    cv.resize(img, img, newSize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - width)/2);
    const RIGHT = Math.floor(4 + (20 - width)/2);
    const TOP = Math.ceil(4 + (20 - height)/2);
    const BOTTOM = Math.floor(4 + (20 - height)/2);
    console.log(`T: ${TOP} B: ${BOTTOM} L: ${LEFT} R: ${RIGHT}`);

    const BLACK = new cv.Scalar(0, 0, 0, 0);
    cv.copyMakeBorder(img, img, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

    // Center of Mass
    cv.findContours(img, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moment = cv.moments(cnt, false);

    const cx = Moment.m10 / Moment.m00;
    const cy = Moment.m01 / Moment.m00;
    console.log(`cx: ${cx} cy: ${cy}`);

    const X_SHIFT = Math.round(img.cols/2.0 - cx);
    const Y_SHIFT = Math.round(img.rows/2.0 - cy);

    newSize = new cv.Size(img.cols, img.rows);
    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    cv.warpAffine(img, img, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK);

    let pixelValues = img.data;
    pixelValues = Float32Array.from(pixelValues);
    pixelValues = pixelValues.map(function(i){
        return i / 255.0;
    });
    // console.log(`Pixels: ${pixelValues}`);

    // Making final Prediction
    const X = tf.tensor([pixelValues]);
    const result = model.predict(X);
    // result.print();
    const output = result.dataSync()[0];   

    // -----------------------------------------------------------
    // Only for Testing 
    let outputCanvas = document.createElement('CANVAS');
    cv.imshow(outputCanvas, img);
    document.body.appendChild(outputCanvas)
    // -----------------------------------------------------------

    // Free up Memory
    img.delete();
    contours.delete();
    cnt.delete();
    hierarchy.delete();
    M.delete();
    X.dispose();
    result.dispose();
    
    return output;
}