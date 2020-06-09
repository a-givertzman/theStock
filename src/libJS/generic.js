"use strict";





// -------------------------------------------------------
// Функция | Включает / отключает вывод в консоль
//
function disableConsole(disable) {
    // console.groupCollapsed("global.generateId { ");
    
    if (disable)
        console.log = function() {};

    // console.groupEnd();
}



// -------------------------------------------------------
// Функция | Генерирует уникальный ID длиной len символов
//
export function generateId(len) {
    // console.groupCollapsed("global.generateId { ");
    
    let arr = new Uint8Array((len || 7) / 2);
    
    window.crypto.getRandomValues(arr);
    
    let id = Array.from(arr, dec => ('0' + dec.toString(16)).substr(-2)).join('');
    
    // console.groupEnd();
    return id;
}



// -------------------------------------------------------
// Функция | Возвращает размер текста width x height в px
//
export function getTextSize(text, font) {
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.font = font;
    let size = ctx.measureText(text);
    size.height = size.actualBoundingBoxAscent - size.actualBoundingBoxDescent;
    console.log('text size: %o', size);
    return size;
 }
 