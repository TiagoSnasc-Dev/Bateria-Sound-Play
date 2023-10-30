//JS Bateria
let bateriaSection = document.getElementById('bateria');

bateriaSection.addEventListener('mouseover', function() {
    document.body.addEventListener('keyup', handleKeyUp);
});

bateriaSection.addEventListener('mouseout', function() {
    document.body.removeEventListener('keyup', handleKeyUp);
});

function handleKeyUp(event) {
    playSound(event.code.toLocaleLowerCase());
}

document.querySelector('.composer button').addEventListener('click', ()=> {
    let song = document.querySelector('#input').value;

    if(song !== '') {
        let songArray = song.split('')
        playComposition(songArray);
    }
});

function playSound(sound) {
    let audioElement = document.querySelector(`#s_${sound}`)
    let keyElement = document.querySelector(`div[data-key="${sound}"]`)

    if(audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
    }

    if(keyElement) {
        keyElement.classList.add('active')
        setTimeout(()=>{
            keyElement.classList.remove('active')
        }, 300);
    }
}

function playComposition(songArray) {
    let wait = 0;
    for(let songItem of songArray) {
        setTimeout(()=>{
            playSound(`key${songItem}`)
        }, wait);

        wait += 250;
    }
}
const keys = document.querySelectorAll(".key");
keys.forEach(key => {
    key.addEventListener("touchstart", (event) => {
        // Evita que o evento seja disparado mais de uma vez se houver múltiplos toques
        event.preventDefault();
        // Pega o valor do atributo data-key e toca o som
        playSound(key.dataset.key);
    });
});








// JS Relógio Analógico
let digitalElement = document.querySelector('.digital')
let sElement = document.querySelector('.p_s')
let mElement = document.querySelector('.p_m')
let hElement = document.querySelector('.p_h')

function updateClock() {
    let now = new Date()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()

    digitalElement.innerHTML = `${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`

    let sDeg = ((360 / 60) * second) - 90;
    let mDeg = ((360 / 60) * minute) - 90;
    let hDeg = ((360 / 12) * hour) - 90;

    sElement.style.transform = `rotate(${sDeg}deg)`;
    mElement.style.transform = `rotate(${mDeg}deg)`;
    hElement.style.transform = `rotate(${hDeg}deg)`;
}

function fixZero(time) {
    return time < 10 ? `0${time}` : time;
}

setInterval(updateClock, 1000)
updateClock()







// Projeto Clima
document.querySelector('.busca').addEventListener('submit', async (event)=>{
    event.preventDefault()

    let input = document.querySelector('#searchInput').value

    if(input !== '') {
        clearInfo()
        showWarning('Carregando...')

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=4701b19666205d1837c1de46d767ee49&units=metric&lang=pt_br`
        
        let results = await fetch(url)
        let json = await results.json()

        if(json.cod === 200) {
            showInfo({
                name: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                windAngle: json.wind.deg
            })
        } else {

            showWarning('Não encontramos esta localizacão.')
        }
    }
})

function showInfo(json) {
    showWarning('')

    document.querySelector('.resultado').style.display = 'block'

    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`
    document.querySelector('.ventoInfo').innerHTML = `${json.windSpeed} <span>km/h</span>`

    document.querySelector('.temp img').setAttribute('src', `http://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)

    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle-90}deg)`

}

function clearInfo() {
    showWarning('')
    document.querySelector('.resultado').style.display = 'none'
}

function showWarning(msg) {
    document.querySelector('.aviso').innerHTML = msg
}





// JOGO DA VELHA

// Initial Data
let square = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: '',
}
let player = '';
let warning = '';
let playing = false;

reset()

// Events
document.querySelector('.reset').addEventListener('click', reset);
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', itemClick);
});

// Functions
function itemClick(event) {
    let item = event.target.getAttribute('data-item')
    if(playing && square[item] === '') {
        square[item] = player;
        renderSquare();
        togglePlayer();
    }
}

function reset() {
    warning = '';

    let random = Math.floor(Math.random() * 2);
    player = (random === 0) ? 'x' : 'o';

    for(let i in square) {
        square[i] = '';
    }

    playing = true;

    clearWinnerClasses();
    renderSquare()
    renderInfo()
}

function renderSquare() {
    for(let i in square) {
        let item = document.querySelector(`div[data-item=${i}]`);
        item.innerHTML = square[i];
    }

    checkGame();
}

function renderInfo() {
    document.querySelector('.vez').innerHTML = player;
    document.querySelector('.resultado-velha').innerHTML = warning;
}

function togglePlayer() {
    player = (player === 'x') ? 'o' : 'x';
    renderInfo();
}

function occupiedSquaresCount() {
    let count = 0;
    for (let i in square) {
        if (square[i] !== '') {
            count++;
        }
    }
    return count;
}


function checkGame() {
    if (occupiedSquaresCount() < 3) {
        return; // Menos de 3 movimentos, então não verifique o vencedor ainda
    }
    if(checkWinnerFor('x')) {
        warning = 'O "x" venceu!';
        playing = false;
    } else if (checkWinnerFor('o')) {
        warning = 'O "o" venceu!';
        playing = false;
    } else if (isFull()) {
        warning = 'Deu empate';
        playing = false;
    }
}

function clearWinnerClasses() {
    document.querySelectorAll('.item.winner').forEach(item => {
        item.classList.remove('winner');
    });
    const area = document.querySelector('.area');
    area.classList.remove('winner-diagonal-ltr', 'winner-diagonal-rtl','winner-horizontal-top','winner-horizontal-middle', 'winner-horizontal-bottom', 'winner-vertical-left', 'winner-vertical-center', 'winner-vertical-right'   );
}

function checkWinnerFor(player) {
    let pos = [
        'a1,a2,a3',
        'b1,b2,b3',
        'c1,c2,c3',
        'a1,b1,c1',
        'a2,b2,c2',
        'a3,b3,c3',
        'a1,b2,c3',
        'a3,b2,c1'
    ];

    let area = document.querySelector('.area');

    for (let w in pos) {
        let pArray = pos[w].split(','); 
        let hasWon = pArray.every(option => square[option] === player);
        if (hasWon) {
            switch (pos[w]) {
                case 'a1,a2,a3':
                    area.classList.add('winner-horizontal-top');
                    break;
                case 'b1,b2,b3':
                    area.classList.add('winner-horizontal-middle');
                    break;
                case 'c1,c2,c3':
                    area.classList.add('winner-horizontal-bottom');
                    break;
                case 'a1,b1,c1':
                    area.classList.add('winner-vertical-left');
                    break;
                case 'a2,b2,c2':
                    area.classList.add('winner-vertical-center');
                    break;
                case 'a3,b3,c3':
                    area.classList.add('winner-vertical-right');
                    break;
                case 'a1,b2,c3':
                    area.classList.add('winner-diagonal-ltr');
                    break;
                case 'a3,b2,c1':
                    area.classList.add('winner-diagonal-rtl');
                    break;
            }
        }
    }
}


function isFull() {
    for(let i in square) {
        if(square[i] === '') {
            return false;
        }
    }
    return true
}





// PROJETO CANVAS
let currentColor = 'black'
let canDraw = false
let mouseX = 0
let mouseY = 0

let screen = document.querySelector('#tela')
let ctx = screen.getContext('2d')

document.querySelectorAll('.colorArea .color').forEach(item => {
    item.addEventListener('click', colorClickEvent)
})
screen.addEventListener('mousedown', mouseDownEvent)
screen.addEventListener('mousemove', mouseMoveEvent)
screen.addEventListener('mouseup', mouseUpEvent)
document.querySelector('.clear').addEventListener('click', clearScreen)

function colorClickEvent(e) {
    let color = e.target.getAttribute('data-color')
    currentColor = color

    document.querySelector('.color.active').classList.remove('active')
    e.target.classList.add('active')
}
function mouseDownEvent(e) {
    canDraw = true
    mouseX = e.pageX - screen.offsetLeft;
    mouseY = e.pageY - screen.offsetTop
}
function mouseMoveEvent(e) {
    if(canDraw) {
        draw(e.pageX, e.pageY)
    }
}
function mouseUpEvent() {
    canDraw = false
}
function draw(x, y) {
    let pointX = x - screen.offsetLeft;
    let pointY = y - screen.offsetTop

    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.lineJoin = 'round'
    ctx.moveTo(mouseX, mouseY)
    ctx.lineTo(pointX, pointY)
    ctx.closePath()
    ctx.strokeStyle = currentColor
    ctx.stroke()

    mouseX = pointX
    mouseY = pointY
}
function clearScreen() {
    ctx.setTransform(1, 0, 0, 1, 0, 0,)
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

// PROJETO QUIZ

// Initial Data
let currentQuestion = 0;
let correctAnswers = 0;

showQuestions();

// Events
document.querySelector('.scoreArea button').addEventListener('click', resetEvent);

// Functions
function showQuestions() {
    if (questions[currentQuestion]) {
        let q = questions[currentQuestion];  // Corrigido

        let pct = Math.floor((currentQuestion / questions.length) * 100);  // Corrigido
        document.querySelector('.progress--bar').style.width = `${pct}%`;

        document.querySelector('.scoreArea').style.display = 'none';
        document.querySelector('.questionArea').style.display = 'block';

        document.querySelector('.question').innerHTML = q.question;
        let optionsHtml = '';
        for (let i in q.options) {
            optionsHtml += `<div data-op="${i}" class='option'><span>${parseInt(i) + 1}</span> ${q.options[i]}</div>`  // Corrigido
        }
        document.querySelector('.options').innerHTML = optionsHtml;

        document.querySelectorAll('.options .option').forEach(item => {
            item.addEventListener('click', optionClickEvent);
        });
    } else {
        finishQuiz();
    }
}
function optionClickEvent(e) {
    let clickedOption = parseInt(e.target.getAttribute('data-op'));

    if (questions[currentQuestion].answer === clickedOption) {
        correctAnswers++;  // Corrigido
    }

    currentQuestion++;
    showQuestions();
}
function finishQuiz() {
    let points = Math.floor((correctAnswers / questions.length) * 100);  // Corrigido

    if (points < 30) {
        document.querySelector('.scoreText1').innerHTML = 'Tá ruim hein!';
        document.querySelector('.scorePct').style.color = '#ff0000';
    } else if (points >= 30 && points < 70) {
        document.querySelector('.scoreText1').innerHTML = 'Muito bem';  // Corrigido
        document.querySelector('.scorePct').style.color = '#ffff00';
    } else if (points >= 70) {
        document.querySelector('.scoreText1').innerHTML = 'Parabéns';  // Corrigido
        document.querySelector('.scorePct').style.color = '#0d630d';
    }

    document.querySelector('.scorePct').innerHTML = `Acertou ${points}%`;
    document.querySelector('.scoreText2').innerHTML = `Você respondeu ${questions.length} questões e acertou ${correctAnswers}`;  // Corrigido

    document.querySelector('.scoreArea').style.display = 'block';
    document.querySelector('.questionArea').style.display = 'none';
    document.querySelector('.progress--bar').style.width = '100%';
}
function resetEvent() {
    correctAnswers = 0;  // Corrigido
    currentQuestion = 0;
    showQuestions();
}
