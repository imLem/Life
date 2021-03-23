// получение рандомного числа для стартового состояния клеток
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
// рефакторинг стиля доски для лучшего визуального восприятия, заменяет 1 и 0 на иные символы
function getRef(result) {
    if (result === 1) {
        return '▓';
    } else {
        return '░';
    };
}
// получает из массива визуальную матрицу
function getMatrix(arr) {
    let subState = [];
    for (let i = 0; i < Math.ceil(arr.length / widthGlobal); i++) {
        subState[i] = arr.slice((i * widthGlobal), (i * widthGlobal) + widthGlobal);
    };
    let startIndex = 0;
    let matrixString = '';
    let createMatrix = '';
    while (startIndex < lengthGlobal) {
        matrixString = subState[startIndex].join('');
        createMatrix = createMatrix + '\n' + String(matrixString);
        startIndex++;
    };
    return createMatrix;
}
// определение какой станет клетка в доске M x N
function getAlive(idx, arr) {
    let right = arr[idx + 1];                         //
    let left = arr[idx - 1];                          //
    let bot = arr[idx + widthGlobal];                 //        определение всех соседей клетки
    let top = arr[idx - widthGlobal];                 //
    let topLeft = arr[idx - widthGlobal - 1];         //
    let topRight = arr[idx - widthGlobal + 1];        //
    let botLeft = arr[idx + widthGlobal - 1];         //
    let botRight = arr[idx + widthGlobal + 1];        //
    if (idx === 0) { // проверка на левый верхний угол
        top = 0;
        left = 0;
        topLeft = 0;
        topRight = 0;
        botLeft = 0;
    };
    if (idx === (widthGlobal - 1)) { // проверка на правый верхний угол
        right = 0;
        top = 0;
        topRight = 0;
        topLeft = 0;
        botRight = 0;
    };
    if (idx === ((lengthGlobal * widthGlobal) - widthGlobal)) { // проверка на нижний левый угол
        left = 0;
        bot = 0;
        botLeft = 0;
        botRight = 0;
        topLeft = 0;
    };
    if (idx === ((lengthGlobal * widthGlobal) - 1)) { // проверка на нижний правый угол
        bot = 0;
        right = 0;
        botRight = 0;
        botLeft = 0;
        topRight = 0;
    };
    if (Number.isInteger((idx + 1) / widthGlobal) && idx != 0) { // проверка на право
        right = 0;
        topRight = 0;
        botRight = 0;
    };
    if (Number.isInteger(idx / widthGlobal)) { // проверка на лево
        left = 0;
        topLeft = 0;
        botLeft = 0;
    };
    if (idx < widthGlobal) { // проверка на верх
        top = 0;
        topLeft = 0;
        topRight = 0;
    };
    if (idx >= (lengthGlobal * widthGlobal) - (widthGlobal - 1)) { // проверка на низ
        bot = 0;
        botLeft = 0;
        botRight = 0;
    };
    if (arr[idx] === 1) { // действия с живой клеткой
        let resultLive = left + right + top + topLeft + topRight + bot + botLeft + botRight;
        if (resultLive < 2 || resultLive > 3) {
            return 0;
        };
        if (resultLive === 2 || resultLive === 3) {
            return 1;
        };
    };
    if (arr[idx] === 0) { // действия с мертвой клетой
        let resultLive = left + right + top + topLeft + topRight + bot + botLeft + botRight;
        if (resultLive === 3) {
            return 1;
        } else {
            return 0;
        };
    };
}
// вспомогательная функция преобразования массива после определения живых и мертвых клеток
function getPush(stateA, stateB) {
    let startCount = 0;
    while (startCount < stateA.length) {
        stateB.push(getAlive(startCount, stateA));
        startCount++;
    }
}
// создание доски
function getTable() {
    let state = [...startArr];
    let stateClear = [];
    let step = 1;
    stateClear = state.map(item => getRef(item));
    console.log(getMatrix(stateClear) + '\n' + 'step: ' + step);
    let stateDirt = [];
    let i = 1;
    function myLoop() {
        setTimeout(function () {
            if (step === 1) {
                stateDirt = [];
                getPush(state, stateDirt);
                stateClear = stateDirt.map(item => getRef(item));
                step++;
                console.log(getMatrix(stateClear) + '\n' + 'step: ' + step);
            } else {
                state = [];
                state = [...stateDirt];
                stateDirt = [];
                getPush(state, stateDirt);
                stateClear = [];
                stateClear = stateDirt.map(item => getRef(item));
                step++;
                console.log(getMatrix(stateClear) + '\n' + 'step: ' + step);
            }
            i++;
            if (i < stepsMatrix) {
                myLoop();
            }
        }, timeout)
    }
    myLoop();
}
// выбор стартового состояния доски
function getStartArr() {
    if (fileName) {
        let fs = require('fs');
        let path = "./" + fileName + ".txt";
        if (fs.existsSync(path)) {
            //console.log('ошибки нет');
        } else {
            return console.log('Файл не найден');
        };
        let arrayFile = fs.readFileSync(path).toString();
        let array = [...arrayFile];
        let i = 0;
        let matrix = [];
        while (i < array.length) {
            if (array[i] === '0' || array[i] === '1') {
                matrix.push(Number(array[i]));
                i++;
            } else {
                i++;
            };
        };
        widthGlobal = (arrayFile.split('\r')[0]).length; // длинна таблицы
        lengthGlobal = (arrayFile.split('\r')).length;    // ширина таблицы
        getPush(matrix, startArr);
        getTable(lengthGlobal, widthGlobal);
    } else {
        while (startArr.length < (lengthGlobal * widthGlobal)) {
            startArr.push(getRandomIntInclusive(0, 1));
        };
        getTable(lengthGlobal, widthGlobal);
    };
}
const stepsMatrix = 200;           // количество шагов
const timeout = 70;                // задержка между выводом таблиц
let lengthGlobal = 25;               // длина
let widthGlobal = 50;                  // ширина 
let fileName = process.argv[2];
let startArr = [];
getStartArr();
