"use strict";





// =======================================================
// Класс | HtmlDom
//         Класс инструментов работы с DOM
//
export class HtmlDom {


    // -------------------------------------------------------
    // Метод | Создаем элемент
    //
    constructor() {
        console.group("Class HtmlDom.constructor");

        console.groupEnd;
    }



    // -------------------------------------------------------
    // Метод | Возвращает ссылку на элемент DOM по Id
    //
    elementById(id) {
        // console.group("Class HtmlDom.domElementById { id: %o", id);
        var item = document.getElementById(id);
        // console.log("elment: %o", element);

        // console.groupEnd();
        return item;
    }



    // -------------------------------------------------------
    // Метод | Возвращает ссылку на элемент DOM по селектору
    //
    element(selector) {
        // console.group("Class HtmlDom.domElementById { id: %o", id);
        var item = document.querySelectorAll(selector)[0];
        // console.log("elment: %o", element);

        // console.groupEnd();
        return item;
    }



    // -------------------------------------------------------
    // Метод | Делает элементы доступными для редактирования
    //         если enabled = true, иначе блокирует их
    //         элементы выбирает по селектору selector
    //
    setEnabled(selector, enabled = false) {
        console.group("Class HtmlDom.setDomElementsEnabled");
        console.log("selector: %o; enabled: %o", selector, enabled);

        // получаем htmlCollection - коллекцию элементов с классом disabled
        var disabledItems = document.querySelectorAll(selector);

        // и делаем их все доступными / недоступными для редактирования
        for (var item of disabledItems) {
            item.disabled = !enabled;
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Возвращает адекватные координаты мыши
    //         внутри клиентской области <canvas>
    //
    getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
        }
    }


    // -------------------------------------------------------
    // Метод | подгоняем размер тега <input> под его содержимое
    //         если параметр min = true то размер всегда будет минимально возможным
    //
    tuneInputSize(target, min = false) {
        if (min) {
            target.size = target.value.length;
        } else if (target.size < target.value.length) {
            target.size = target.value.length;
        }
    }
}


