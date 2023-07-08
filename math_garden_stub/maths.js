var answer, score = 0;
var backgroundImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    document.getElementById('n1').innerHTML = n1;
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n2').innerHTML = n2;
    answer = n1 + n2;
}

function checkAnswer() {
    const prediction = predictImage();
    console.log(`Prediction: ${prediction}\nAnswer: ${answer}`);
    if (prediction == answer) {
        score++;
        if (score > 6) {
            alert("Congratulations !");
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages
        }
        else {
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        }
    }
    else {
        if (score) score--;
        alert("Wrong");
        setTimeout(() => {
            backgroundImages.pop();
            document.body.style.backgroundImage = backgroundImages;
        }, 1000);
    }
}