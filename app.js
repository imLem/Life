// получение рандомного числа для стартового состояния доски и клеток
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
};
// рефакторинг стиля доски для лучшего визуального восприятия, заменяет 1 и 0 на иные символы
function getRef(result) {
    if (result === 1) {
        return '▓';
    } else {
        return '░';
    };
};
// получает из массива визуальную матрицу
function getMatrix(arr) {
    let subwidth = [];
    for (let i = 0; i < Math.ceil(arr.length / n); i++) {
        subwidth[i] = arr.slice((i * n), (i * n) + n);
    };
    a = 0;
    b = '';
    c = '';
    while (a < m) {
        b = subwidth[a].join('');
        c = c + '\n' + String(b);
        a++;
    };
    return c;
};
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
    /*console.log('width[z] = ' + arr[z] + ' ' + 'z = ' + z + ' ' 
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
};
// создание доски и последующие преобразование ее клеток
function getTable(m, n) {
    let width = startArr;
    while (width.length < (m * n)) {
        width.push(getRandomIntInclusive(0, 1));
    };
    let b = 0;
    let width2 = [];
    while (b < width.length) {
        width2.push(getAlive(b, width));
        b++;
    };
    let width3 = [];
    width3 = width.map(item => getRef(item));
    console.log(getMatrix(width3) + '\nstep: 1');
    width3 = [];
    width3 = width2.map(item => getRef(item));
    console.log(getMatrix(width3) + '\nstep: 2');
    let step = 2;
    let i = 1;                  //  set your counter to 1
    function myLoop() {         //  create a loop function
        setTimeout(function () {   //  call a 3s setTimeout when the loop is called
            width3 = [];
            width = [];
            width = [...width2];
            width2 = [];
            b = 0;
            while (b < width.length) {
                width2.push(getAlive(b, width));
                b++;
            };
            width3 = width2.map(item => getRef(item));
            step++
            let s = new Date();
            console.log(getMatrix(width3) + '\n' + 'step: ' + step);
            i++;                    //  increment the counter
            if (i < 800) {           //  if the counter < 10, call the loop function
                myLoop();             //  ..  again which will trigger another 
            }                       //  ..  setTimeout()
        }, 1000)
    }
    myLoop();
};
//
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
        while (i < matrix1.length){
            startArr.push(matrix1[i]);
            i++;
        }
        getTable(m, n);
    } else {
        getTable(m, n);
    };
};
let m = 30; //getRandomIntInclusive(5, 20);
let n = 60; //getRandomIntInclusive(5, 20);
let nodePath = process.argv[0];
let appPath = process.argv[1];
let fileName = process.argv[2];
let startArr = [];


getStartArr();
