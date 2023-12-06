const startButton = document.querySelector('.start');
const gameContainer = document.querySelector('.game');
const level = document.querySelector('.level');

const difficult = { easy: 1, medium: 2, hard: 3 };
let divisions = 0;
let correctCount = 0;
let tries = 0;
let incorrectExercises = [];

level.addEventListener('click', (e) => {
    divisions = difficult[e.target.id];
    startGame();
});

function startGame() {
    level.classList.add('hide');
    gameContainer.innerHTML = '';

    if (tries < 10) {
        const [dividend, divisor] = generateDivisionProblem(divisions);

        const problemElement = document.createElement('h1');
        problemElement.textContent = `Tienes ${dividend} flores para ${divisor} abejas, \n¿Cuántas flores le tocan a cada abeja?`;
        problemElement.style.whiteSpace = 'pre-line';
        gameContainer.appendChild(problemElement);

        const answerOptions = generateAnswerOptions(dividend, divisor);

        answerOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => {
                checkAnswer(dividend, divisor, option);
            });
            gameContainer.appendChild(button);
        });

        gameContainer.style.display = 'flex';
        gameContainer.style.flexDirection = 'column';
        gameContainer.style.alignItems = 'center';
        gameContainer.style.justifyContent = 'center';
    } else {
        showFinalMessage(`Juego terminado. Tuviste ${correctCount} respuestas correctas.`, incorrectExercises);
    }
}

function generateAnswerOptions(dividend, divisor) {
    const correctAnswer = dividend / divisor;
    const incorrectAnswers = [];

    while (incorrectAnswers.length < 2) {
        const incorrectAnswer = getRandomInt(1, 20);
        if (incorrectAnswer !== correctAnswer && !incorrectAnswers.includes(incorrectAnswer)) {
            incorrectAnswers.push(Math.round(incorrectAnswer));
        }
    }

    const answerOptions = [...incorrectAnswers, Math.round(correctAnswer)];
    return answerOptions.sort(() => Math.random() - 0.5);
}


function generateDivisionProblem(difficulty) {
    let divisor, dividend;

    switch (difficulty) {
        case 1:
            divisor = getRandomInt(2, 5);
            dividend = divisor * getRandomInt(5, 10);
            break;
        case 2:
            divisor = getRandomInt(2, 10);
            dividend = divisor * getRandomInt(10, 20);
            break;
        case 3:
            divisor = getRandomInt(2, 15);
            dividend = divisor * getRandomInt(20, 30);
            break;
        default:
            divisor = 1;
            dividend = 1;
    }

    return [dividend, divisor];
}

function checkAnswer(dividend, divisor, answer) {
    const correctAnswer = dividend / divisor;
    const userAnswer = parseFloat(answer);
    tries++;
    if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
        showResultMessage('¡Correcto!', true);
        correctCount++;
    } else {
        incorrectExercises.push(`Tienes ${dividend} flores para ${divisor} abejas. Respuesta correcta: ${correctAnswer}`);
        showResultMessage('Sigue intentando', false);
    }
}

function showResultMessage(message, isCorrect) {
    gameContainer.innerHTML = '';

    const resultElement = document.createElement('h2');
    resultElement.textContent = message;
    resultElement.classList.add(isCorrect ? 'correct-color' : 'incorrect-color');

    gameContainer.appendChild(resultElement);
    
    setTimeout(startGame, 2000);
}

function showFinalMessage(message, incorrectExercises) {
    gameContainer.innerHTML = '';

    const resultElement = document.createElement('h3');
    resultElement.textContent = message;
    gameContainer.appendChild(resultElement);

    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Volver a jugar';
    playAgainButton.addEventListener('click', () => {
        resetGame();
    });
    gameContainer.appendChild(playAgainButton);

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Descargar PDF';
    downloadButton.addEventListener('click', () => {
        downloadPDF(incorrectExercises);
    });
    gameContainer.appendChild(downloadButton);
}

function downloadPDF(incorrectExercises) {
    const pdf = new jsPDF();
    const fechaActual = new Date();
    const formatoFechaHora =
        `${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}_${fechaActual.getDate().toString().padStart(2, '0')}_${fechaActual.getFullYear()}-` +
        `${fechaActual.getHours().toString().padStart(2, '0')}_${fechaActual.getMinutes().toString().padStart(2, '0')}_${fechaActual.getSeconds().toString().padStart(2, '0')}`;

    const nombreArchivo = `informe_juego_${formatoFechaHora}.pdf`;

    pdf.text('Fecha del juego: ' + new Date().toLocaleDateString(), 20, 20);
    pdf.text('Dificultad del juego: ' + divisions, 20, 30);
    pdf.text('Respuestas correctas: ' + correctCount, 20, 40);

    pdf.text('Ejercicios incorrectos:', 20, 50);
    incorrectExercises.forEach((exercise, index) => {
        pdf.text(`${index + 1}. ${exercise}`, 20, 60 + index * 10);
    });

    pdf.save(nombreArchivo);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetGame() {
    gameContainer.innerHTML = '';
    correctCount = 0;
    tries = 0;
    incorrectExercises = [];
    location.reload();
}
