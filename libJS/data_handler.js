"use strict";





// -------------------------------------------------------
// Функция | Копирования объекта, возвращает новый объект
//           С заданным id, который будет копией data
//
function copyData(data, id, dataModel) {
    // console.group("copyData ", data);

    let _copy = {};

    // обновляем данные в ppDataSet
    for(let key in dataModel.data) {
        switch (dataModel.type[key]) {
            case 'int':
            case 'number':
                _copy[key] = data[key] ? parseInt(data[key], 10) : dataModel.data[key];
                break;
            case 'float':
                _copy[key] = data[key] ? parseFloat(data[key]) : dataModel.data[key];
                break;
            case 'string':
                _copy[key] = data[key] ? data[key] : dataModel.data[key];
                break;
        }
    }
    _copy.id = id;

    // console.groupEnd();
    return _copy;
};



// -------------------------------------------------------
// Функция | Сортировки массива объектов - ppDataSet
//
// function sortDataBy(data, key) {
//     console.group("sortDataBy ", key);

    // var first = true;
    // let prevId;
    // for(let index in data) {
    //     if (!first) {
    //         if (data[index][key] < prev[key]) {
    //             let buff = copyData(data[index], data[index].id);
    //             data[index] = copyData(prev, prev.id);
    //             prev = copyData(buff, buff.id);
    //         }
    //     }
    //     prev = copyData(data[index], data[index].id);
    //     first = false;
    // }
//     console.groupEnd();
// };



    // -------------------------------------------------------
    // Функция | Запрос серверу в формате ajax
    //           type = "POST" / "GET"
    //           url = "fileName.php"
    //           dataType = "json"
    //           возвращает данные в формате json в случае успеха
    //           либо false в случае ошибки
    //
    function requestToServer(type, url, dataType, postData, successFunction, errorFunction, context) {
        console.group("requestToServer { url = %o ", url);

        console.time(url);
        console.log('postData: %o', postData);

        // отправляем запрос серверу
        $.ajax({
            type: type,
            url: url,
            dataType: dataType,
            data: postData,
            context: context,

            // получаем ответ в случае успеха
            success: function(jsonResponce, textStatus, jqXHR) {

                console.log('jsonResponce: %o', jsonResponce);
                // console.log('textStatus: ' + textStatus);
                console.timeEnd(url);
                // console.log('jqXHR: %o', jqXHR);

                // возвращаем ответ сервера
                successFunction(jsonResponce, textStatus, jqXHR);
            },

            // получаем ответ в случае ошибок
            error: function(XMLHttpRequest, textStatus, jqXHR) {

                console.warn('textStatus: ' + textStatus);
                console.timeEnd(url);
                console.warn('jqXHR: %o', jqXHR);

                // возвращаем ошибку
                errorFunction(XMLHttpRequest, textStatus, jqXHR);
            }
        });
        console.groupEnd();
    };



    // -------------------------------------------------------
    // Метод | Загрузка всех элементов из базы данных
    //
    function loadData(url, postData = {}, dataSet, dataModel, successFunction, errorFunction) {
        console.group("loadData");
        // console.log("this: %o", this);

        // Формируем данные для отправки на сервер
        // var postData = {};

        // отправляем запрос серверу
        requestToServer('POST', url, 'json', postData,

            // если успешно и сервер вернул данные
            function(jsonResponce) {

                if (parseInt(jsonResponce.errCount) > 0) {
                    alert('Ошибка: ' + jsonResponce.errDump);
                } else {
                    let data = jsonResponce.data;

                    // передаем загруженные данные
                    for(var index in data) {
                        dataSet[data[index].id] = copyData(data[index], data[index].id, dataModel);
                    }
                }

                successFunction(jsonResponce);
            },

            // если запрос серверу вернул ошибку
            function(XMLHttpRequest, textStatus) {

                if (parseInt(XMLHttpRequest.errCount) > 0) {
                    alert('Ошибка: ' + XMLHttpRequest.errDump);
                } else {
                    alert('Ошибка: ' + textStatus);
                }
                errorFunction(XMLHttpRequest, textStatus);
            },
        );
        console.groupEnd();
    };






// -------------------------------------------------------
// Метод |  Сохраняет элемент pack в базу данных
//         если объект новый то выполняет INSERT
//         Затем добавляет новый элемент в массив packs и в список <select>
//         иначе оновляет объект в базе запросом UPDATE
//
function saveData(data, dataSet, dataModel, successFunction, errorFunction, context) {
    console.group('saveData');
    console.log('pack: %o', this);

        // Формируем данные для отправки на сервер
        var url = "setPlacePattern.php";

        let postData = {};
        for(let key in dataModel.data) {

            if (data.id > 0) {
                // обновляем данные в ppDataSet
                dataSet[data.id][key] = data[key] ? data[key] : dataModel.data[key];
            }

            // данные для отправки на сервер
            postData[key] = data[key] ? data[key] : dataModel.data[key];
        }

        console.log('postData: %o', postData);
        // отправляем запрос серверу POST (UPDATE)
        requestToServer('POST', url, 'json',
            {"data" :postData
            },

            // если успешно и сервер вернул данные
            function(jsonResponce) {

                // ответ сервера
                var result = jsonResponce; //JSON.parse(jsonResponce);

                if (parseInt(result.errCount) > 0) {
                    alert('Ошибка: ' + result.errDump);
                } else {
                    if (result.id) {

                        console.log('result.id: %o', result.id);
                    }
                }
                successFunction(result);
            },
            // если запрос серверу вернул ошибку
            function(XMLHttpRequest, textStatus) {
                console.log('Сервер вернул ошибку: %o', XMLHttpRequest);

                if (parseInt(XMLHttpRequest.errCount) > 0) {
                    alert('Ошибка: ' + XMLHttpRequest.errDump);
                } else {
                    alert('Ошибка: ' + textStatus);
                }
                errorFunction(XMLHttpRequest, textStatus);
            },
            context
        );
    console.groupEnd();
}



// =======================================================
// Класс | DataHendler
//          Класс хранит одно значение и связывает его
//         с визуальным элементом на экранной форме
//          Если значение класса изменилось, то класс
//         отобразит его в визуальном элементе
//          Если событие изменения визуального поля
//         привязано, то при вводе пользователем нового значения,
//         оно будет присвоено полю класса
//          Параметры инициализации:
//
//         parent   - родительский элемент
//         selector - селектор, по которому будет привязан визуальный элемент экранной формы
//         type     - тип значения ['int', 'uint', 'float', 'text']
//         event    - событие изменения визуального элемента
//
class DataHendler {


    // -------------------------------------------------------
    // Метод | Создаем элемент
    //
    constructor(dataModel) {
        console.groupCollapsed("Class DataHendler.constructor");

        this._target;                       // целевой объект
        this.data;                          // внутренний объект с набором данных целевого объекта
        this.bind = [];                     // массив связей внутреннего объекта данных с полями ввода/вывода
        this._dataModel = dataModel         // модель целевого объекта (структура, значения по умолчанию и типамы данных)

        this._changed = '';
        this.onChange = null;               // этот метод привязан, то будет вызван каждый раз при изменении данных в DOM

        this._onChangeEnabled = false;      // флаг разрешающий передавать событие изменения во внутреннем объекте

        console.log("this: ", this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | Признак того, что поле внутреннего объекта было изменено
    //
    set changed(value) {
        console.groupCollapsed("Class DataHendler.set changed");

        this._changed = value
        
        this.data.changed = value ? 'изменен' : '';

        // вызываем метод по изменению, если привязан и установлен флаг "изменен"
        if (value && this.onChange && this._onChangeEnabled) {this.onChange(event);}
        
        console.groupEnd();
    }

    get changed() {return this._changed;}



    // -------------------------------------------------------
    // Свойство | Целевой объект - объект данных, чьи свойства
    //            копируются во внутренний объект
    //
    set target(target) {
        console.groupCollapsed("Class DataHendler.set target");

        this._target = target;

        if (this._target) {
            this.setTarget(this._target);
        } else {
            console.error('DataHendler получил пустой целевой объект')
        }
        console.groupEnd();
    }

    get target() {return this._target;}



    // -------------------------------------------------------
    // Свойство | Модель данных - структура, значения по умолчанию и типы данных
    //
    set dataModel(value) {
        console.groupCollapsed("Class DataHendler.set dataModel");

        if (value) {
            this._dataModel = value;
        } else {
            console.error('DataHendler получил пустую модель данных')
        }
        this._dataModel = value;

        console.groupEnd();
    }

    get dataModel() {return this._dataModel};



    // -------------------------------------------------------
    // Свойство | Целевой объект
    //
    setTarget(target) {
        console.groupCollapsed("Class DataHendler.setTarget");

        // очищаем модель данных
        this.data = null;
        this.data = {};

        this._onChangeEnabled = false;                                      // отключаем передачу изменений внутреннего объекта

        // пересоздаем новому целевому объекту все настроенные связи
        for(let name in this.bind) {

            // если связь не с кастомным списком то удаляем event
            if (this.bind[name].type != 'list') {
                if (this.bind[name].selector) {

                    // элемент в DOM
                    let domElement = document.querySelector(this.bind[name].selector);

                    // связываем event элемента в DOM с обработчиком
                    if (domElement)
                        domElement.removeEventListener(this.bind[name].event, e => this.slotElementChange(e));
                }
            }

            // связываем значение в модели данных с элемеентов в DOM
            this.setDataBind(this.bind[name].selector, this.bind[name].name, this.bind[name].type, this.bind[name].event);
        }

        for(let key in this._dataModel.data) {           // копируем все поля из целевого объекта во внутренний
            this.data[key] = target[key] ? target[key] : this._dataModel.data[key];
        }

        this.changed = false;                                               // сбрасываем флаг changed
        this._onChangeEnabled = true;                                       // разрешаем передавать изменения внутреннего объекта

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Добавляет новую связь domElement <=> data.name
    //
    setDataBind(selector, name, type, event) {
        // console.group("Class DataHendler.setBind");

        // настраиваем domElement в зависимости от type
        var domElement;
        switch (type) {
            case 'list':
                // кастомный выпадающий список
                domElement = selector;
                break;
            default:
                // элемент в DOM
                domElement = selector ? document.querySelector(selector) : null;
        }

        // если domElement не найден, выводим сообщение и не связываем event
        if (domElement && event) {
            // связываем event элемента в DOM с обработчиком
            domElement.addEventListener(event, e => this.slotElementChange(e));
        } else {
            if (!event) {console.warn('Связь ' + name + ' создана без event');}
            if (!domElement) {console.warn('Связь ' + name + ' создана без элемента в DOM');}
        }

        // добавляем связь если ее нет
        if (!this.bind[name]) {
            this.bind[name] = {
                name: name,
                type: type,
                event: event,
                selector: selector,
                domElement: domElement,
            };
        }
        // console.log("bind.keys: ", Object.keys(this.bind));
        // console.log("this.bind: ", this.bind[name]);


        // Добавляем свойство name во внутренний объект
        if (this.data) {

            // ссылка на себя
            var self = this;

            // сылка на целевой объект
            // var target = this._target;

            Object.defineProperty(this.data, name, {

                set: function(newValue) {

                    // обновляем значение поля внутреннего объекта
                    this['_' + name] = newValue;

                    // console.log("target[name]: " + target[name]);
                    // console.log("newValue: " + newValue);
                    // console.log("target: %o", target);
                    // console.log("target[name]: " + target[name]);
                    // console.log("domElement: ", domElement);
                    // console.log("name: ", name);

                    // если значение было изменено из целевого обюъекта
                    if (domElement) {

                        switch(domElement.type) {

                            case 'checkbox':
                                if (domElement.checked !== self.parseValueToView(newValue, self.bind[name].type)) {

                                    // обновляем его в domElement
                                    domElement.checked = self.parseValueToView(newValue, self.bind[name].type);
                                }
                                break;
                            default:
                                if (String(domElement.value) !== String(newValue)) {

                                    // обновляем его в domElement
                                    domElement.value = self.parseValueToView(newValue, self.bind[name].type);
                                }
                        }
                    }
                },

                get: function() {
                    // console.log("name: ", name , self.bind[name].type, this['_' + name]);
                    return self.parseValue(this['_' + name], self.bind[name].type);
                },

                configurable: false
            });
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если изменилось значение в domElement
    //
    slotElementChange(event) {
        console.groupCollapsed("Class DataHendler.slotElementChange");

        let name = Object.keys(this.bind).find(key => this.bind[key].domElement === event.target);

        let bind = this.bind[name];

        this.data[bind.name] = this.parseDomElementValue(event.target, bind.type);

        // устанавливаем флаг, что набор данных изменен
        this.changed = true;

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Парсит значение из domElement в соответствии с типом
    //
    parseDomElementValue(domElement, type) {

        switch(domElement.type) {

            case 'checkbox':
                return this.parseValueFromView(domElement.checked, type);
                break;
            default:
                return this.parseValueFromView(domElement.value, type);
        }
    }



    // -------------------------------------------------------
    // Метод | Парсит значение в соответствии с типом
    //         data <-> data
    //
    parseValue(value, type) {

        let parsed;
        switch(type) {
            case 'int':
                parsed = parseInt(value, 10);
                return isNaN(parsed) ? 0 : parsed;
            case 'uint':
                parsed = parseInt(value, 10);
                return isNaN(parsed) ? 0 : parsed;
            case 'float':
                parsed = parseFloat(value);
                return isNaN(parsed) ? 0 : parsed;
            case 'text':
                return value;
            case 'color':
                return value ? value.replace("#", "") : '000000';
            case 'list':
                return value;
            default:
                return value;
        }
    }



    // -------------------------------------------------------
    // Метод | Парсит значение в соответствии с типом
    //         view -> data
    //
    parseValueFromView(value, type) {

        let parsed;
        switch(type) {
            case 'bool':
                return (value == true) ? 1 : 0;
            case 'int':
                parsed = parseInt(value, 10);
                return isNaN(parsed) ? 0 : parsed;
            case 'uint':
                parsed = parseInt(value, 10);
                return isNaN(parsed) ? 0 : parsed;
            case 'float':
                parsed = parseFloat(value);
                return isNaN(parsed) ? 0 : parsed;
            case 'text':
                return value;
            case 'color':
                return value.replace("#", "");
            case 'list':
                return value;
            default:
                return value;
        }
    }



    // -------------------------------------------------------
    // Метод | Парсит значение в соответствии с типом
    //         data -> view
    //
    parseValueToView(value, type) {

        let parsed;
        switch(type) {
            case 'bool':
                parsed = parseInt(value, 10);
                return (parsed > 0) ? true : false;
            case 'int':
                parsed = parseInt(value, 10);
                return (isNaN(parsed) || (parsed == 0)) ? '' : parsed;
            case 'uint':
                parsed = parseInt(value, 10);
                return (isNaN(parsed) || (parsed == 0)) ? '' : parsed;
            case 'float':
                parsed = parseFloat(value);
                return (isNaN(parsed) || (parsed == 0)) ? '' : parsed;
            case 'text':
                return value;
            case 'color':
                return '#' + value;
            case 'list':
                return value;
            default:
                return value;
        }
    }
}