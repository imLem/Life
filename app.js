// получение рандомного числа для стартового состояния доски и клеток
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
    for (let i = 0; i < Math.ceil(arr.length / n); i++) {
        subState[i] = arr.slice((i * n), (i * n) + n);
    };
    let startIndex = 0; 
    let matrixString = ''; 
    let createMatrix = '';
    while (startIndex < m) {
        matrixString = subState[startIndex].join('');
        createMatrix = createMatrix + '\n' + String(matrixString);
        startIndex++;
    };
    return createMatrix;
}
// определение какой станет клетка в доске M x N
function getAlive(z, arr) {
    let right = arr[z + 1];               //
    let left = arr[z - 1];                //
    let bot = arr[z + n];                 //        определение всех соседей клетки
    let top = arr[z - n];                 //
    let topLeft = arr[z - n - 1];         //
    let topRight = arr[z - n + 1];        //
    let botLeft = arr[z + n - 1];         //
    let botRight = arr[z + n + 1];        //
    if (z === 0) { // проверка на левый верхний угол
        top = 0;
        left = 0;
        topLeft = 0;
        topRight = 0;
        botLeft = 0;
    };
    if (z === (n - 1)) { // проверка на правый верхний угол
        right = 0;
        top = 0;
        topRight = 0;
        topLeft = 0;
        botRight = 0;
    };
    if (z === ((m * n) - n)) { // проверка на нижний левый угол
        left = 0;
        bot = 0;
        botLeft = 0;
        botRight = 0;
        topLeft = 0;
    };
    if (z === ((m * n) - 1)) { // проверка на нижний правый угол
        bot = 0;
        right = 0;
        botRight = 0;
        botLeft = 0;
        topRight = 0;
    };
    if (Number.isInteger((z + 1) / n) && z != 0) { // проверка на право
        right = 0;
        topRight = 0;
        botRight = 0;
    };
    if (Number.isInteger(z / n)) { // проверка на лево
        left = 0;
        topLeft = 0;
        botLeft = 0;
    };
    if (z < n) { // проверка на верх
        top = 0;
        topLeft = 0;
        topRight = 0;
    };
    if (z >= (m * n) - (n - 1)) { // проверка на низ
        bot = 0;
        botLeft = 0;
        botRight = 0;
    };

    // отладочная часть
    /*console.log('state[z] = ' + arr[z] + ' ' + 'z = ' + z + ' ' 
    + 'left = ' + left + ' ' + 'right = ' + right + ' ' + 'top = ' + top + ' ' + 'topLeft = ' + topLeft 
    + ' ' + 'topRight = ' + topRight + ' ' + 'bot = ' + bot + ' ' + 'botLeft = ' + botLeft + ' ' + 'botRight = ' + botRight);*/

    if (arr[z] === 1) { // действия с живой клеткой
        let resultLive = left + right + top + topLeft + topRight + bot + botLeft + botRight;
        if (resultLive < 2 || resultLive > 3) {
            //console.log(resultLive);
            //console.log(0);
            return 0;
        };
        if (resultLive === 2 || resultLive === 3) {
            //console.log(resultLive);
            //console.log(1);
            return 1;
        };
    };
    if (arr[z] === 0) { // действия с мертвой клетой
        let resultLive = left + right + top + topLeft + topRight + bot + botLeft + botRight;
        if (resultLive === 3) {
            //console.log(resultLive);
            //console.log(1);
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
// создание доски и последующие преобразование ее клеток
function getTable(m, n) {
    let state = startArr;
    while (state.length < (m * n)) {
        state.push(getRandomIntInclusive(0, 1));
    };
    
    let stateClear = [];
    let stateDirt = [];
    let step = 1;
    let i = 1;
    
    stateClear = state.map(item => getRef(item));
    console.log(getMatrix(stateClear) + '\n' + 'step: ' + step);

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
        let array = fs.readFileSync(path).toString();
        let i = 0;
        let matrix1 = [];
        while (i < array.length) {
            if (String(array[i]) === '0' || String(array[i]) === '1') {
                matrix1.push(Number(array[i]));
                i++;
            } else {
                i++;
            };
        };
        n = (fs.readFileSync(path).toString().split('\r')[0]).length; // длинна таблицы
        m = (fs.readFileSync(path).toString().split('\r')).length;    // ширина таблицы
        console.log(n);
        console.log(m);
        console.log(matrix1);
        i = 0;
        while (i < matrix1.length) {
            startArr.push(matrix1[i]);
            i++;
        }
        getTable(m, n);
    } else {
        getTable(m, n);
    };
}
let stepsMatrix = 200;
let timeout = 70;
let m = 15; //getRandomIntInclusive(5, 20);
let n = 30; //getRandomIntInclusive(5, 20);
let fileName = process.argv[2];
let startArr = [];
getStartArr();
