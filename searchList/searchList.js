"use strict";





// =======================================================
// Класс | SearchList
//          Объект хранит в себе указатель на родительский контейнер div,
//         лейбл label, инпут для ввода поискового запроса input, список ul
//         и кнопку button, раскрывающую весь список.
//          При изменении поискового запроса объект делает фоновый запрос к базе даных,
//         получает результат и показывает записи результата в выпадающем списке
//          Если нажать кнопку, то список отобразит результаты для defaultSearchQuery
//
class SearchList {



    // -------------------------------------------------------
    // Метод | Создаем элемент
    //
    constructor(ul, url) {
        console.group("class SearchList.constructor");

        this._url = url;        // путь к php файлу, который вернет поисковую выдачу

        this._searchQuery;      // текст поискового запроса
        this._defaultQuery = "%";     // поисковый запрос по умолчанию

        this._ul = ul;          // родительский ul где отображены результаты поисковой выдачи
        // this._label = ul.parentNode.getElementsByTagName("label");            // текст, отобразаемый рядом с поисковой строкой
        this._input = ul.parentNode.getElementsByTagName("input")[0];            // строка ввода поискового запроса
        this._button = ul.parentNode.getElementsByTagName("button")[0];          // кнопка, раскрывающая весь список

        this._item0 = '';       // нулевой пункт списка, если не инициализирован, то не отображается

        this._selectedId = 0;   // id выбранного элемента
        this._prevouseId = 0;   // id предыдущего выбранного элемента
        this._selectedIndex;    // номер элемента выбранного в списке

        this._dataSet = [];        // массив для хранения результатов поисковой выдачи

        this._listFormat;       // формат вывода элементов списка вида ['code', '.|', 'name', '.|', 'wx', '.x', 'wy', '.x', 'wz'],
        this._selectedFormat;   // формат вывода элементов списка вида ['code', '.|', 'name', '.|', 'wx', '.x', 'wy', '.x', 'wz'],

        this._expanded = false; // когда список раскрыт, свойство содержит true

        this._listener = null;  // метод, вызываемый, если привязано событие по addEventListener


        // -------------------------------------------------------
        // Сигналы |
        //

        // когда выбран нулевой элемент в спсиске
        this.onItem0;

        // когда выбран новый элемент в спсиске поисковой выдачи
        this.onChange;

        this._input.addEventListener('input', event => this.slotInputChange(event));
        this._button.addEventListener('click', event => this.slotClick(event));
        this._ul.parentNode.addEventListener('blur', event => this.slotBlur(event));
        this._input.addEventListener('blur', event => this.slotInputBlur(event));
        console.log("this: ", this)

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | Модель данных, откуда поисок берет все данные
    //
    set dataSet(value) {
        this._dataSet = null;
        this._dataSet = value;
    }

    get dataSet() {return this._dataSet;}



    // -------------------------------------------------------
    // Свойство | текст, отобразаемый рядом с поисковой строкой
    //
    set label(value) {this._label = value;}

    get label() {return this._label;}



    // -------------------------------------------------------
    // Свойство | строка ввода поискового запроса
    //
    set input(value) {
        this._input = value;
        this._input.addEventListener('input', event => this.slotInputChange(event));
    }

    get input() {return this._input;}



    // -------------------------------------------------------
    // Свойство | родительский ul где отображены результаты поисковой выдачи
    //
    set ul(value) {this._ul = value;}

    get ul() {return this._ul;}



    // -------------------------------------------------------
    // Свойство | кнопка, раскрывающая весь список
    //
    set button(value) {this._button = value;}

    get button() {return this._button;}



    // -------------------------------------------------------
    // Свойство | Нулевой элемент
    //
    set item0(value) {
        this._item0 = value;
    }

    get item0() {return this._item0;}



    // -------------------------------------------------------
    // Свойство | id выбранного элемента - дублирует selectedId
    //            сделано для dataHendler
    //
    set value(value) {
        this._selectedId = value;
        this.updateInput(value);
        // посылаем event
        this.sendEvents(value);
    }

    get value() {return this._selectedId;}



    // -------------------------------------------------------
    // Свойство | id выбранного элемента
    //
    set selectedId(value) {

        if (value) {

            this._selectedId = value;
            this.updateList(this.dataSet);  // для обновления всего списка перед сменой выделенного в случае нового элемента в dataSet
            this.updateInput(value);
        } else {
            this._input.value = '';
        }
    }

    get selectedId() {return this._selectedId;}



    // -------------------------------------------------------
    // Свойство | id предыдущего выбранного элемента
    //
    set prevouseId(value) {
        this._prevouseId = value;
    }

    get prevouseId() {return this._prevouseId;}



    // -------------------------------------------------------
    // Свойство | Номер выбранного элемента
    //
    set selectedIndex(value) {this._selectedIndex = value;}

    get selectedIndex() {return this._selectedIndex;}



    // -------------------------------------------------------
    // Свойство | формат вывода элементов списка
    //            массив ['code', '.|', 'name', '.|', 'wx', '.x', 'wy', '.x', 'wz', '.|', 'Внут ', 'item_count', ' шт']
    //
    set listFormat(value) {this._listFormat = value;}

    get listFormat() {return this._listFormat;}



    // -------------------------------------------------------
    // Свойство | формат вывода элементов списка
    //            массив ['code', '.|', 'name', '.|', 'wx', '.x', 'wy', '.x', 'wz', '.|', 'Внут ', 'item_count', ' шт']
    //
    set selectedFormat(value) {this._selectedFormat = value;}

    get selectedFormat() {return this._selectedFormat;}



    // -------------------------------------------------------
    // Метод | Очищает выпадающий список поисковой выдачи
    //
    clearList() {
        // console.group("Class SearchList.clearList");

        while (this._ul.firstChild) {
            this._ul.removeChild(this._ul.firstChild);
        }

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Делает форматированную строку для отображения
    //         элементов списка и текстра выбранного элемента
    //         в элементе <input>
    //
    formatedContent(row, format) {
        // console.groupCollapsed("Class SearchList.formatedContent");
        // console.log('row: %o', row);
        // console.log('format: %o', format);

        var prefix = '';
        var innerText = "";

        format.forEach( item => {
            if (item[0] == '(') {
                var arr = item.replace(/\(|\)/g, '').split(' ');

                innerText += (row[arr[1]] && (row[arr[1]] != '0')) ? (prefix + arr[0] + ' ' + row[arr[1]] + ' ' + arr[2]) : '';
            } else {
                innerText += (item != '|') ? (row[item] ? (prefix + row[item]) : (prefix + item)) : '';
            }
            prefix = (item == '|') ? '<i>|</i>' : '';
        });
        // console.groupEnd();
        return innerText;
    }



    // -------------------------------------------------------
    // Метод | Раскрывает список поисковой выдачи
    //
    expand() {
        // console.groupCollapsed("Class SearchList.expand");

        this._ul.classList.remove("hidden");                                            // раскрываем список

        // прокручиваем к выбранному элементу
        let li = this._ul.querySelector(".selected");

        if (li) {

            if (li.offsetTop < this._ul.scrollTop) {                                    // если элемент выше viewPort

                this._ul.scrollTop = li.offsetTop - 60;                                 // прокручиваем что бы он появился вверху списка
            }

            if (li.offsetTop > (this._ul.scrollTop + this._ul.clientHeight)) {          // если элемент ниже viewPort

                this._ul.scrollTop = li.offsetTop - this._ul.clientHeight + 90;         // прокручиваем что бы он появился внизу списка
            }
        }
        this._expanded = true;
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Сворачивает список поисковой выдачи
    //
    collapse() {
        // console.groupCollapsed("Class SearchList.collapse");

        this._ul.classList.add("hidden");

        this._expanded = false;
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Сортирует выпадающий список поисковой выдачи
    //
    sortListBy(key) {
        console.group("Class SearchList.sortListBy");

        // получаем все элементы выпадающего списка
        let items = this._ul.getElementsByTagName('li');
        console.log('items: %o', items);

        // первый элемент из сортируемого списка
        let first = this._item0 ? 1 : 0;

        for (let i  = first; i < (items.length - 1); i++) {

            let m = i;  // индекс элемента с минимальным key
            for (let j = i + 1; j < items.length; j++) {
                if (this.dataSet[items[j].value][key] < this.dataSet[items[m].value][key]) {
                    m = j;
                }
            }

            // если нашли элемент с меньшим key
            if (m != i) {
                // меняем местами элементы с индексами i <> m

                // удаляем event у элементов
                items[m].removeEventListener('click', event => this.slotChange(event));
                items[i].removeEventListener('click', event => this.slotChange(event));

                // запоминаем элемент с индексом m
                let mValue = items[m].value;
                let mInnerHTML = items[m].innerHTML;

                // переставляем элемент с индексом i в элемент с индексом m
                items[m].value = items[i].value;
                items[m].innerHTML = items[i].innerHTML;

                // вставляем запомненный элемент с индексом m в элемент с индексом i
                items[i].value = mValue;
                items[i].innerHTML = mInnerHTML;

                // добавляем event элементам
                items[m].addEventListener('click', event => this.slotChange(event));
                items[i].addEventListener('click', event => this.slotChange(event));
            }
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Обновляет списка поисковой выдачи
    //
    updateList(rows) {
        // console.groupCollapsed("Class SearchList.updateList");

        this.clearList();

        if (this._item0) {

            // если есть нулевой элемент
            var li = document.createElement('li');

            li.value = 0;

            // Форматированная строка вывода для элемента списка
            li.innerHTML = this._item0;

            li.addEventListener('click', event => this.slotChange(event));

            // добавляем нулевой элемент в выпадающий список
            this._ul.appendChild(li);
        }

        rows.forEach( row => {

            var li = document.createElement('li');

            li.value = row.id;

            // Форматированная строка вывода для элемента списка
            li.innerHTML = this.formatedContent(row, this._listFormat);

            li.addEventListener('click', event => this.slotChange(event));

            // добавляем новый элемент в выпадающий список
            this._ul.appendChild(li);
        });

        // сортируем список
        this.sortListBy('code');

        // Обновляем выбранный элемент в выпадающем списке
        this.updateSelected(this._selectedId);

        // console.log("listItem: %o",  item);
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Запрос серверу в формате ajax
    //           type = "POST" / "GET"
    //           url = "fileName.php"
    //           dataType = "json"
    //           возвращает данные в формате json в случае успеха
    //           либо false в случае ошибки
    //
    requestToServer(target, type, url, dataType, data, successFunction, errorFunction, caller) {
        console.group("Class SearchList.requestToServer");

        console.time(url);
        console.log('data: %o', data);

        // отправляем запрос серверу
        $.ajax({
            type: type,
            url: url,
            dataType: dataType,
            data,

            // получаем ответ в случае успеха
            success: function(jsonResponce, textStatus, jqXHR) {

                console.log('jsonResponce: %o', jsonResponce);
                // console.log('textStatus: ' + textStatus);
                console.timeEnd(url);
                // console.log('jqXHR: %o', jqXHR);

                // возвращаем ответ сервера
                successFunction(target, jsonResponce, caller);
            },

            // получаем ответ в случае ошибок
            error: function(XMLHttpRequest, textStatus, jqXHR) {

                console.warn('textStatus: ' + textStatus);
                console.timeEnd(url);
                console.warn('jqXHR: %o', jqXHR);

                // возвращаем ошибку
                errorFunction(XMLHttpRequest, textStatus);
            }
        });
        console.groupEnd();
    }



    // -------------------------------------------------------
    //  Метод | Загружает поисковую выдачу
    //
    load(successFunction, errorFunction, caller) {
        console.group('Class SearchList.load ');

        // формируем данные для отправки на сервер
        var data = {
            "search_query": this._searchQuery ? "%" + this._searchQuery + "%" : this._defaultQuery         // поисковый запрос
        };

        // загружаем элемент по id и все его внутренние элементы
        this.requestToServer(this, 'POST', this._url, 'json', data,

            // если успешно и сервер вернул данные
            function(target, jsonResponce) {

                // сохраняем ответ сервера до новой загрузки
                target.dataSet = jsonResponce;

                if (successFunction) {successFunction(target, caller);}
            },

            // если запрос серверу вернул ошибку
            function(XMLHttpRequest, textStatus) {

                errorFunction(XMLHttpRequest, textStatus);
            },

            caller      // вызывающий объект
        );
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если нажата кнопка раскрытия списка
    //
    slotClick(event) {
        console.group("class SearchList.slotClick");
        // this.slotInputChange();
        // return false;
        if (this._expanded) {

            this.collapse();
        } else {

            if (this._url) {
                this.load(
                    function(target, caller) {
                        caller.expand();
                    },

                    function() {
                    },

                    this
                );
            } else {
                this.updateList(this.dataSet);
                this.expand();
            }
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если изменился поисковый запрос
    //
    slotInputChange(event) {
        console.group("class SearchList.slotInputChange");

        this._searchQuery = this._input.value;

        if (this._url) {
            this.load(
                function(target, caller) {
                    // в ответе сервера массив записей
                    target.updateList(target.dataSet);

                    caller.expand();
                },

                function() {
                },

                this
            );
        } else {

            // фильтруем список
            let dataSet = this._dataSet.filter( row => {
                let match = false;

                // названия полей по которым выполняется поиск и фильтрация списка
                let searchFields = ['code', 'name'];

                // значения полей текущего элемента списка
                // по которым выполняется поиск соединенные в одну строку
                let values = searchFields.reduce( function(accumulator, currentValue) {
                    return accumulator + row[currentValue];
                }, '');

                // создаем регулярное выражение на основе поискового запроса
                let reg = new RegExp('\\.*' + this._searchQuery + '\\.*', 'gmi');

                // ищем поисковый запрос в наборе значений полей
                match = reg.test(values);
                return match;
            });

            this.updateList(dataSet);

            this.expand();
        }

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Обновляет выбранный элемент и его отображаемое в input
    //
    updateInput(id) {
        console.group("Class SearchList.updateInput");
        console.log('selected id: %o', id);

        if (!isNaN(id)) {

            if (id > 0) {
                
                // ищем элемнт с задданным id в массиве
                let row = this._dataSet.find( item => (item ? (item.id == id) : false));
                
                // если выбранный элемент есть
                if (row) {
                    console.log('selected row: %o', row);
                    // отображаем выбранный элемент в input с учетом формтирования
                    this._input.value = this.formatedContent(row, this._selectedFormat);
                }
                
                this._searchQuery = this._input.value;
            } else {
                
                this._input.value = this._item0;
                
                this._searchQuery = this._defaultQuery;
            }
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Обновляет выбранный элемент и его отображаемое в списке
    //
    updateSelected(id) {
        console.group("Class SearchList.updateSelected");
        console.log('selected id: %o', id);

        // ищем выбранный ранее элемент
        var item = this._ul.querySelector(".selected");

        // если выбранный ранее есть
        if (item) {
            // то убираем выделение
            item.classList.remove('selected');
        }

        if (id && (id > 0)) {

            // ищем элемнт с задданным id в массиве
            var row = this._dataSet.find( item => (item ? (item.id == id) : false));
            console.log('selected row: %o', row);

            // ищем вновь выбранный элемент
            item = this._ul.querySelector("[value=\'" + id + "\']");

        } else {

            // ищем нулевой элемент
            item = this._ul.querySelector("[value=\'0\']");
        }

        // если выбранный элемент есть
        if (item) {
            // то подсвечиваем его
            item.classList.add('selected');
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если пользователь кликнул на элемент списка,
    //        выбранный элемент изменился
    //
    slotChange(event) {
        console.group("Class SearchList.slotChange");
        console.log('event: %o', event);

        // id выбранного элемента
        var id = parseInt(event.target.value);

        if (!isNaN(id)) {

            // если в списке выбран "Новый"
            if (id > 0) {

                // сохраняем id предыдущего выбранного элемента
                this._prevouseId = event.target.value;
            } else {

                // сохраняем id предыдущего выбранного элемента
                this._prevouseId = this._selectedId;
            }

            // сохраняем id выбранного элемента
            this._selectedId = id;

            // Обновляем выбранный элемент и его отображаемое в input
            this.updateInput(id);

            this.collapse();

            // посылаем event
            this.sendEvents(id);
        }

        console.groupEnd();
    }


    // -------------------------------------------------------
    // Метод | Посылает подписчикам event
    //         что выбранный элемент изменился
    //
    sendEvents(id) {
        // console.group("class SearchList.sendEvents");
        if (id > 0) {

            if (this._listener) {this._listener({target: this});}

                // передаем сигнал, что выбранный элемент изменился
            if (this.onChange) {this.onChange(id);}
        } else {

            if (this._listener) {this._listener({target: this});}

            // передаем сигнал, что выбран нулевой элемент
            if (this.onItem0) {this.onItem0(0);}
        }

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если input потерял фокус
    //
    slotInputBlur(event) {
        // console.group("class SearchList.slotInputBlur");

        if (this._expanded) {

            setTimeout(() => {

                this.collapse();
            }, 300);
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если элемент потерял фокус
    //
    slotBlur(event) {
        // console.group("class SearchList.slotBlur");
        // console.log(event);

        if (this._expanded) {

            setTimeout(() => {

                this.collapse();
            }, 300);
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Устанавливает addEventListener на событие change
    //
    addEventListener(event, listener) {
        console.group("class SearchList.slotClick");
        console.log('event: %o', event);
        console.log('listener: %o', listener);
        this._listener = listener;
        console.groupEnd();
    }
}