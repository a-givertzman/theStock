"use strict";





// -------------------------------------------------------
// Функция | Генерирует уникальный ID
//
function generateId(len) {
    // console.groupCollapsed("global.generateId { ");
    // console.groupEnd();
    var arr = new Uint8Array((len || 7) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec => ('0' + dec.toString(16)).substr(-2)).join('')
}



// -------------------------------------------------------
// Функция | осветляет или затемняет цвет в парамеетре color,
//           переданный в формате #rrggbb
//           на велдечину percent, переданную в процентах 
function shadeColor (color = "#000000", percent = 0) {
    var num = parseInt (color.slice(1), 16); 
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;
    var new_color = ("#" + (0x1000000 + 
       (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
       (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
       (B < 255 ? B < 1 ? 0 : B : 255)).toString (16).slice (1));
    return new_color;
}





const dataModel = {
    id:      0,
    refId:   0,
    addr:    '',
    code:    '',
    name:    '',
    payload: 0,
    x:       0,
    y:       0,
    wx:      0,
    wy:      0,
    wz:      0,
    iwx:     0,
    iwy:     0,
    iwz:     0,
    inRow:   0,
    item:    null,
    color:   '',
    depth:   0,
    turned:  0,
    type:    5,
    status:  1,
    purpose: 1,
    created: '',
    updated: '',
    deleted: ''
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
    constructor() {
        console.group("Class DataHendler.constructor");

        this._target;       // целевой объект
        this._dataModel;    // набор данных целевого объекта
        this.bind = [];     // массив связей

        console.log("this: ", this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | Целевой объект
    //
    set target(target) {
        console.group("Class DataHendler.set target");
        
        this._target = target;

        console.groupEnd();
    }

    get target() {return this._target;}



    // -------------------------------------------------------
    // Свойство | Модель данных
    //
    set dataMonel(dataMonel) {
        console.group("Class DataHendler.set dataMonel");
        
        this._dataMonel = dataMonel;

        // устанавливаем новому целевому объекту уже настроенные связи
        for(var name in this.bind) {
            // элемент в DOM
            let domElement = document.querySelector(this.bind[name].selector);

            // связываем event элемента в DOM с обработчиком
            domElement.removeEventListener(this.bind[name].event, e => this.slotElementChange(e));

            // связываем значение в модели данных с элемеентов в DOM
            this.setDataBind(this.bind[name].selector, this.bind[name].name, this.bind[name].type, this.bind[name].event);
        }

        console.groupEnd();
    }

    get dataMonel() {return this._dataMonel;}



    // -------------------------------------------------------
    // Метод | Добавляет новую связь domElement <=> target.name
    //
    setDataBind(selector, name, type, event) {
        console.group("Class DataHendler.setBind");

        // настраиваем domElement в зависимости от type
        var domElement;
        switch (type) {
            case 'list':
                domElement = selector;
                break;
            default:
                // элемент в DOM
                domElement = document.querySelector(selector);
        }
        // связываем event элемента в DOM с обработчиком
        domElement.addEventListener(event, e => this.slotElementChange(e));

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
        console.log("bind.keys: ", Object.keys(this.bind));
        console.log("this.bind: ", this.bind[name]);


        // Добавляем свойство name в dataModel
        if (this.dataModel) {

            Object.defineProperty(this.dataModel, name, {
                
                set: function(newValue) {
                    
                    // сохраняем новое значение во внутренней переменой dataModel
                    // if (newValue != undefined) {

                        this['_' + name] = newValue;
                        // console.log("domElement: ", domElement);
                        // console.log("name: ", name);
                        console.log("newValue: ", newValue);
                        
                        // если значение было изменено из целевого обюъекта
                        if (domElement.value.toString() !== newValue.toString()) {
                            // обновляем его в domElement
                            domElement.value = newValue;
                            // console.log("domElement.value: ", domElement.value);
                        }
                    // }
                },
                
                get: function() {
                    return this['_' + name];
                },   
                
                configurable: false
            });
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если изменилось значение в domElement
    //
    slotElementChange(event) {
        console.group("Class DataHendler.slotElementChange");

        let name = Object.keys(this.bind).find(key => this.bind[key].domElement === event.target);

        let bind = this.bind[name];

        this.target[bind.name] = this.parseDomElementValue(event.target, bind.type);
        console.groupEnd();
    }
    
    
    
    // -------------------------------------------------------
    // Метод | Парсит значение в из domElement в соответствии с типом
    //
    parseDomElementValue(domElement, type) {

        let value = domElement.value;

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
            case 'list':
                return value;
        }
    }


    // -------------------------------------------------------
    // Метод | Возвращает массив для отправки на сервер в формате json
    //
    parse(targetObject = null) {
        
        var array = {};

        var target = targetObject ? targetObject : this._target;
        // console.log("target: %o", target);

        var names = Object.keys(dataModel);
        // console.log("names: %o", names);

        names.forEach( name => {
            if (name[0] != '_') {
                if (name != 'item') {
                    if (typeof dataModel[name] == 'number') {
                        array[name] = isNaN(target[name]) ? 0 : target[name];
                    } else {
                        array[name] = target[name] ? target[name] : 'NULL';
                    }
                }
            }
        })
        if ((target['item']) && (target['item'].length)) {
            array['item'] = [];
            target['item'].forEach( item => {
                array['item'].push(this.parse(item));
            });
        }
        // console.log("array: %o", array);
        return array;
    }
}





// =======================================================
// Класс | PackageContainerItem
//         Контеейнер для хранения элементов в двумерном массиве
//         Сам является элементарным элементом, наследником PackageSimple
//         И так же может включать в себя любое количемтво элеементов типра PackageSimple 
//         Элементы располагаются в горизонтальных рядах,
//         Каждый ряд может содержать в себе любое количество элементов
//         количество рядов хранится в свойстве rowCount
//         количество элементов в i-том ряде в свойстве colCount(i)
//
class PackageContainerItem {

    // -------------------------------------------------------
    // Метод | Создаем элемент
    //           Если передать data то из этой структуры
    //         будут взяты все параметры элемента и будут созданы внутренние элементы
    //         формат структуры:
    //              {
    //                  id: "0",
    //                  code: "",
    //                  name: "",
    //                  color: "000000",
    //                  x: "".
    //                  y: "".
    //                  z: "".
    //                  wx: "",
    //                  wy: "",
    //                  wz: "",
    //                  payload: "",
    //                  item: [],               // массив внутренних элементов
    //                  material_id: null,
    //                  material_name: null,
    //                  photo_id: null,
    //                  created: null,
    //                  updated: null,
    //                  deleted: null
    //              }
    //
    constructor(parent, data, settings, canvas) {
        console.groupCollapsed("Class PackageContainerItem.constructor");
        console.log("data: %o", data);

        this._parent = parent;      // родительский контейнер
        
        this._dataModel = null;     // модель данных
        this.dataHendler = null;

        // технологические свойства элемента
        //
        this._id = parseInt(data.id);
        this._refId = 0;            // ссылочный id, указывающий на тип данного элемента
        this._addr;                 // аддрес элемента
        this._code;                 // обозначение
        this._name;                 // наименование 
        this._material;             // название материала из которого сделан
        this._payload;              // вес который выдерживает
        this.type = 5;
        this.status = 1;
        this.purpose = 1;
    
        // Графические свойства отображения
        //
        this._canvas = canvas;       // объект canvas на котором элемент будет отображен
        this._ctx = this._canvas.getContext('2d');

        this._color = '#646464';    // цвет элемента (по умолчанию #646464)
        this._selectedColor = shadeColor(this._color, -20);
        this._mouseOverColor = "#ff0000" //shadeColor(this._color, -90);

        this._border = 0;           // толщина рамки в % от меньшего габарита viewBox
        this._mouseOverBorder = 20; // толщина рамки в % от меньшего габарита viewBox когда указатель мыши над элементом
        this._borderColor = "#000000";
        this._iborder = 0;          // толщина рамки внутренних размеров в % от меньшего габарита viewBox
        this._iBorderColor = "#000000"; // цвет рамки внутренних размеров

        this._showText = false;     // если true, то элемент показывает текст
        this._textColor = "#ffffff";    // цвет текста, белый по умолчанию
        
        // Геометрические сврйства элемента
        //
        this._yScale = 1;           // масштаб по вертикали
        this._xScale = 1;           // масштаб пл горизонтали
        this._scale = 1;            // масштаб отображения на canvas

        this._autoFit = 'none';     // contain / none

        this._padding = 0;          // внутренний отступ в % от меньшего габарита viewBox
        // this._margin = 1.0;         // внешний отступ (1 - без отсьупа, 1.01 - отступ в 1%)
        
        this._x = 0;                // координаты верхнего левого угла прямоугольника элемента
        this._y = 0;                // координаты верхнего левого угла прямоугольника элемента

        this._wx = 0;               // наружний размер вправо от левого верхнего угла с фронта в положении эксплуатации
        this._wy = 0;               // наружний размер вниз от левого верхнего угла с фронта в положении эксплуатации
        this._wz = 0;               // наружний размер в глубину от левого верхнего угла с фронта в положении эксплуатации
        this._iwx = 0;              // внутренний размер вправо от левого верхнего угла с фронта в положении эксплуатации
        this._iwy = 0;              // внутренний размер вниз от левого верхнего угла с фронта в положении эксплуатации
        this._iwy = 0;              // внутренний размер в глубину от левого верхнего угла с фронта в положении эксплуатации

        this._viewBox = {           // размер прямоугольника в который должен вписаться элемент при autoFit != 'none
            x: 0,
            y: 0,
            wx: this._canvas.width,
            wy: this._canvas.height
        }    
        
        // расположение элемента в контейнере
        //  это соответствие пространственных осей элемента осям его контейнера
        this._disposition = {
            x: 'x',
            y: 'y',
            wx: 'wx',
            wy: 'wy',
            wz: 'wz'
        };

        // поведенческие свойства элемента
        //
        this._inRow = 0;            // элемент встает в один ряд с предыдущим 
        this._depth = 0;            // количество уровней внутренних элементов
        this._turned = 0;           // элемент отображается повернутым
        this._hidden = true;        // если true, то элемент невидимый
        this._active = false;       // если true, то элемент будет реагировать на указатель мыши
        this._mouseOver = false;    // когда указатель мыши над элементом true
        this._selected = false;     // статуса ВЫБРАН / НЕ ВЫБРАН 
        this._changed = true;       // если true, то элемент был изменен
        this._NEW = true;           // если true, то элемент новый и его нет в базе данных

        this.onChange;
                
        // ссылка на набор настроект для данного уровня
        this._settings = settings;
        
        // массив внутренних элементов
        this.item = [];
        
        // массив выделенных элементов
        this.selectedItem = [];
        
        // заполняем все свойства элемента
        // и создаем внутренние элементы из структуры data
        this.setData(data, settings);
        
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | Связь данного объекта с моделью данных
    //
    set dataModel(value) {
        console.groupCollapsed("Class PackageContainerItem.set dataModel");
        this._dataModel = value;
        if (this._dataModel) {
            for(var name in this._dataModel) {
                if (name[0] !== '_') {
                    this._dataModel[name] = this[name];
                }
            }
        }
        // console.log("this._dataModel: %o", this._dataModel);
        console.groupEnd();
    }

    get dataModel() {return this._dataModel;}



    // -------------------------------------------------------
    // Свойство | id элемента в базе данных
    //
    set id(value) {
        value = parseInt(value);
        this._id = isNaN(value) ? 0 : value;
        if (this._dataModel) {this._dataModel.id = this._id;}
    }

    get id() {return this._id;}



    // -------------------------------------------------------
    // Свойство | id элемента в базе данных
    //
    set refId(value) {
        value = parseInt(value);
        this._refId = isNaN(value) ? 0 : value;
        if (this._dataModel) {this._dataModel.refId = this._refId;}
    }

    get refId() {return this._refId;}



    // -------------------------------------------------------
    // Свойство | Обозначение элемента
    //
    set addr(value) {
        if (this._addr != value) {
            this.clear();
            this._addr = value;
            if (this._dataModel) {this._dataModel.addr = value;}
            this.draw();
        }
    }

    get addr() {return this._addr;}



    // -------------------------------------------------------
    // Свойство | Обозначение элемента
    //
    set code(value) {
        this._code = value;
        if (this._dataModel) {this._dataModel.code = value;}
    }

    get code() {return this._code;}



    // -------------------------------------------------------
    // Свойство | Нименование элемента
    //
    set name(value) {
        this._name = value;
        if (this._dataModel) {this._dataModel.name = value;}
    }

    get name() {return this._name;}



    // -------------------------------------------------------
    // Свойство | Материал элемента
    //
    set material(value) {
        this._material = value;
        if (this._dataModel) {this._dataModel.material = value;}
    }

    get material() {return this._material;}



    // -------------------------------------------------------
    // Свойство | Вес который может выдержать элемент, в граммах
    //
    set payload(value) {
        this._payload = value;
        if (this._dataModel) {this._dataModel.payload = value;}
    }

    get payload() {return this._payload;}



    // -------------------------------------------------------
    // Свойство | Элемент canvas на котором элемент себя рисует
    //
    set canvas(value) {
        this._canvas = value;
                
        // получаем 2d контекст (объект для вывода всей графики)
        this._ctx = this._canvas.getContext('2d');
    }

    get canvas() {return this._canvas;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set color(value) {
        console.groupCollapsed("Class PackageContainerItem.set color");
        if (this._color != value) {
            if (!this._parent) {this.clear();}
            this._color = value;
            if (this._dataModel) {this._dataModel.color = value;}
            this._selectedColor = shadeColor(this._color, -20);
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
        console.groupEnd();
    }

    get color() {return this._color;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set border(value) {
        if (this._border != value) {
            if (!this._parent) {this.clear();}
            this._border = value;
            if (!this._parent) {this.draw();}
        }
    }

    get border() {return this._border;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set borderColor(value) {
        if (this._borderColor != value) {
            if (!this._parent) {this.clear();}
            this._borderColor = value;
            if (!this._parent) {this.draw();}
        }
    }

    get borderColor() {return this._borderColor;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set iBorder(value) {
        if (this._iBorder != value) {
            if (!this._parent) {this.clear();}
            this._iBorder = value;
            if (!this._parent) {this.draw();}
        }
    }

    get iBorder() {return this._iBorder;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set iBorderColor(value) {
        if (this._iBorderColor != value) {
            if (!this._parent) {this.clear();}
            this._iBorderColor = value;
            if (!this._parent) {this.draw();}
        }
    }

    get iBorderColor() {return this._iBorderColor;}



    // -------------------------------------------------------
    // Свойство | Если true, элемент выводит текст
    //
    set showText(value) {this._showText = value;}

    get showText() {return this._showText;}



    // -------------------------------------------------------
    // Свойство | Цвет текста
    //
    set textColor(value) {this._textColor = value;}

    get textColor() {return this._textColor;}



    // -------------------------------------------------------
    // Свойство | масштаб отображения MAX(wx/viewBox.wx, wy/viewBox.wy) мм/px
    //
    set scale(value) {

        if (this._scale != value) {

            if (!this._parent) {this.clear(true);}

            // обновляем масштаб элемента
            this._scale = value;
    
            // обновляем масштаб внутренних элементов
            this.item.forEach( subItem => {
                subItem.scale = this._scale;
            });

            if (!this._parent) {this.draw();}
        }
    }

    get scale() {return this._scale;}



    // -------------------------------------------------------
    // Свойство | Если true, то элемент впишет себя во viewBox
    //
    set autoFit(value) {

        if (this._autoFit != value) {

            if (!this._parent) {this.clear();}

            // обновляем autoFit элемента
            this._autoFit = value;
            this.autoScale();
        
            // обновляем viewBox внутренних элементов
            this.setItemsViewBox();
    
            // обновляем масштаб внутренних элементов
            this.item.forEach( subItem => {
                subItem.scale = this._scale;
            });

            if (!this._parent) {this.draw();}
        }
    }

    get autoFit() {return this._autoFit;}


    
    // -------------------------------------------------------
    // Свойство | Отступ цветного прямоугольбник от краев элемента
    //
    set padding(value) {
        if (this._padding != value) {
            if (!this._parent) {this.clear();}
            this._padding = value;
            if (!this._parent) {this.draw();}
        }
    }

    get padding() {return this._padding;}



    // -------------------------------------------------------
    // Свойство | Координата на canvas
    //
    set x(value) {
        if (this.x != value) {
            if (!this._parent) {this.clear(true);
            } else {this._parent.clear();}
            this._x = value;
            if (this._dataModel) {this._dataModel.x = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();
            } else {this._parent.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get x() {return this._x;}



    // -------------------------------------------------------
    // Свойство | Координата на canvas
    //
    set y(value) {
        if (this._y != value) {
            if (!this._parent) {this.clear(true);
            } else {this._parent.clear();}
            this._y = value;
            if (this._dataModel) {this._dataModel.y = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();
            } else {this._parent.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get y() {return this._y;}



    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set wx(value) {
        if (this._wx != value) {
            if (!this._parent) {this.clear(true);}
            this._wx = value;
            if (this._dataModel) {this._dataModel.wx = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
        
    get wx() {return this._wx;}
        
        

    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set wy(value) {
        if (this._wy != value) {
            if (!this._parent) {this.clear(true);}
            this._wy = value;
            if (this._dataModel) {this._dataModel.wy = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
    
    get wy() {return this._wy;}
    

    
    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set wz(value) {
        if (this._wz != value) {
            if (!this._parent) {this.clear(true);}
            this._wz = value;
            if (this._dataModel) {this._dataModel.wz = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get wz() {return this._wz;}



    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set iwx(value) {
        if (this._iwx != value) {
            if (!this._parent) {this.clear(true);}
            this._iwx = value;
            if (this._dataModel) {this._dataModel.iwx = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
        
    get iwx() {return this._iwx;}
        

        
    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set iwy(value) {
        if (this._iwy != value) {
            if (!this._parent) {this.clear(true);}
            this._iwy = value;
            if (this._dataModel) {this._dataModel.iwy = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
    
    get iwy() {return this._iwy;}
    
    

    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set iwz(value) {
        if (this._iwz != value) {
            if (!this._parent) {this.clear(true);}
            this._iwz = value;
            if (this._dataModel) {this._dataModel.iwz = value;}
            this.setItemsViewBox();
            if (!this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get iwz() {return this._iwz;}



    // -------------------------------------------------------
    // Свойство | Прямоугольник в котором элемент будет отображен
    //
    set viewBox(value) {

        if (!this._parent) {this.clear();}

        // обновляем viewBox элемента
        this._viewBox = value;
        if (this._autoFit == 'contain') {this.autoScale();}

        // обновляем viewBox внутренних элементов
        this.setItemsViewBox();

        if (!this._parent) {this.draw();}
    }

    get viewBox() {return this._viewBox;}



    // -------------------------------------------------------
    // Свойство | Расположение элемента в контейнере
    //
    set disposition(value) {

        if (!this._parent) {this.clear(true);}

        // обновляем viewBox элемента
        this._disposition = value;
        if (this._autoFit == 'contain') {this.autoScale();}
        
        var scale = this._scale;

        // обновляем viewBox внутренних элементов
        this.setItemsViewBox();

        // обновляем disposition внутренних элементов
        this.item.forEach( subItem => {
            // subItem.disposition = value;
            subItem.scale = scale;
        });        
        
        if (!this._parent) {this.draw();}

        if (!this._parent) {this.changed = true;}
    }

    get disposition() {return this._disposition;}



    // -------------------------------------------------------
    // Свойство | Определяет положение элемента в один ряд со следующим
    //
    set inRow(value) {
        this._inRow = value;
        if (this._dataModel) {this._dataModel.inRow = value;}
    }

    get inRow() {return this._inRow;}



    // -------------------------------------------------------
    // Свойство | Определяет глубину загрузки и отображения
    //            внутренних элементов
    //
    set depth(value) {
        this._depth = value;
        if (this._dataModel) {this._dataModel.depth = value;}

        if (!this._parent) {
            if (!this._hidden) {
                this.hide();
                this.show();
            }
        }
        if (!this._parent) {this.changed = true;}
    }

    get depth() {return this._depth;}



    // -------------------------------------------------------
    // Свойство | Определяет повернут ли элемент
    //
    set turned(value) {
        this._turned = value;
        if (this._dataModel) {this._dataModel.turned = value;}
        if (this._autoFit == 'contain') {this.autoScale();}
        console.log("value turned: ", value);
        console.log("this: ", this);
        console.log("settings: ", this._settings);
        if (normalView && turnedView) {
            if (this._turned == 1) {
                this._settings = turnedView;
            } else {
                this._settings = normalView;
            }
        }

        this.turn(this._settings)

        if (!this._parent) {this.changed = true;}
    }

    get turned() {return this._turned;}



    // -------------------------------------------------------
    // Свойство | Определяет реагирует ли элемент на указатель мыши
    //
    set active(value) {
        this._active = value;
    }

    get active() {return this._active;}



    // -------------------------------------------------------
    // Свойство | Определяет выбран ли элемент пользователем
    //
    set selected(value) {
        this._selected = value;
        this.draw();
    }

    get selected() {return this._selected;}



    // -------------------------------------------------------
    // Свойство | Если true, то элемент был изменен и не сохранен
    //
    set changed(value) {
        this._changed = value;
        if (this.onChange) {this.onChange(this);}
    }

    get changed() {return this._changed;}



    // -------------------------------------------------------
    // Свойство | Если true, то элемента еще нет в базе данных
    //
    set NEW(value) {this._NEW = value;}

    get NEW() {return this._NEW;}



    // -------------------------------------------------------
    // Метод | Поворачивает элемент
    //
    turn(settings) {

        this.disposition = settings.disposition;
        
        this.item.forEach( subItem => {
            subItem.turn(settings.item);
        });

        if (!this._parent) {
            if (!this._hidden) {
                this.clear(true);
                this.draw();
            }
        }
    }



    // -------------------------------------------------------
    // Метод | Обновляет viewBox внутренних элементов
    //
    setItemsViewBox() {
        // if (!this._hidden) {this.clear();}
        this.item.forEach( subItem => {
            subItem.viewBox = {
                x: this.viewBox.x + this.x,
                y: this.viewBox.y + this.y,
                wx: this[this.disposition.wx],
                wy: this[this.disposition.wy]
            }
        });
        // if (!this._hidden) {this.draw();}
    }



    // -------------------------------------------------------
    // Метод | Расчет масштаба отображения элемента
    //
    autoScale() {
        // console.groupCollapsed("class PackageContainerItem.updateScale { );

        if (this._autoFit == 'contain') {
            
            var wx = parseFloat(this[this.disposition.wx]);
            var wy = parseFloat(this[this.disposition.wy]);

            this._xScale = wx / this.viewBox.wx;
            this._yScale = wy / this.viewBox.wy;
    
            this.scale = Math.max(this._xScale, this._yScale);
    
            this.x = (this.viewBox.wx * this._scale - wx) / 2;
            this.y = (this.viewBox.wy * this._scale - wy) / 2;
        }

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
        console.group("pack.requestToServer { url = %o ", url);

        console.time();
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
                console.timeEnd();
                // console.log('jqXHR: %o', jqXHR);

                // возвращаем ответ сервера
                successFunction(target, jsonResponce, caller);
            },

            // получаем ответ в случае ошибок
            error: function(XMLHttpRequest, textStatus, jqXHR) {

                console.warn('textStatus: ' + textStatus);
                console.timeEnd();
                console.warn('jqXHR: %o', jqXHR);
                
                // возвращаем ошибку
                errorFunction(XMLHttpRequest, textStatus);
            }
        });
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод |  Сохраняет элемент pack в базу данных
    //         если объект новый то выполняет INSERT
    //         Затем добавляет новый элемент в массив packs и в список <select>
    //         иначе оновляет объект в базе запросом UPDATE
    //
    save(successFunction, errorFunction) {
        console.group('Class PackageContainerItem.save');
        console.log('pack: %o', this);

            // Формируем данные для отправки на сервер
            var url = "../package/setPlace.php";

            // отправляем запрос серверу POST (UPDATE)
            this.requestToServer(this, 'POST', url, 'json',

                {"item": this.dataHendler.parse()},

                // если успешно и сервер вернул данные
                function(target, jsonResponce) {
        
                    // ответ сервера
                    var result = jsonResponce;

                    console.log('result.data_id: %o', result.data_id);
                    if (result.data_id) {

                        //если элемент новый
                        if (target.NEW) {
                            
                            // обновляем id элемента
                            target.id = result.data_id;
                            
                            // снимаем статус "new"
                            target.NEW = false;
                        }
                        // помечаем что элемент сохранен
                        target.changed = false;    
                    }
                    successFunction(target, result);
                },
                // если запрос серверу вернул ошибку
                function(XMLHttpRequest, textStatus) {
                    console.log('Сервер вернул ошибку: %o', XMLHttpRequest);
                    
                    errorFunction(XMLHttpRequest, textStatus);
                }
            );   
        console.groupEnd();
    }
    
    
    
    // -------------------------------------------------------
    // Функция | Загрузка элемента pack из базы данных в selectedPack по заданному id
    //
    load(id, successFunction, errorFunction, caller, depth) {
        console.group("class PackageContainerItem.load {");
        console.log("this: %o", this);

        // формируем данные для отправки на сервер
        var data = {
            "data_id": id ? id : this.id,         // идентификатор загружаемого элемента
            "data_depth": depth ? depth : this.settings.depth
        };
        console.log("data: %o", data);

        // отправляем запрос серверу
        this.requestToServer(this, 'POST', '../package/getPlace.php', 'json', data,

            // если успешно и сервер вернул данные
            function(target, jsonResponce) {
                    
                if (parseInt(jsonResponce.errCount) > 0) {
                } else {

                    // в ответе сервера одна запись, 
                    // содержит всю информацию одного элемента 
                    var row = jsonResponce[0];
                    console.log("row: %o", row);

                    // Заполняем все свойства элемента из ответа сервера
                    target.setData(row, target.settings, caller);

                    // убираем статус "изменен", так как элемент существует в базе данных
                    target.changed = false;

                    // убираем статус "новый", так как элемент существует в базе данных
                    target.NEW = false;
                }

                successFunction(target, caller, jsonResponce);
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
    // Свойство | Инициализирует все свойства элемента
    //
    setSettings(settings, caller) {
        this.padding      = settings.padding      ? settings.padding      : 0;
        this.border       = settings.border       ? settings.border       : 0;
        this.borderColor  = settings.borderColor  ? settings.borderColor  : 0;
        this.iBorder      = settings.iBorder      ? settings.iBorder      : 0;
        this.iBorderColor = settings.iBorderColor ? settings.iBorderColor : "#000000";
        this.showText     = settings.showText     ? settings.showText     : 0;
        this.textColor    = settings.textColor    ? settings.textColor    : 0;
        if (this != caller) {
            this.disposition  = settings.disposition  ? settings.disposition  : {x: 'x', y: 'y', wx: 'wx', wy: 'wy', wz: 'wz'};
            this.active       = settings.active       ? settings.active       : false;
            this.autoFit      = settings.autoFit      ? settings.autoFit      : 'none';
            this.viewBox      = {x: 0, y: 0, wx: this._canvas.width, wy: this._canvas.height};
        }
    }

    get settings() {return this._settings;}



    // -------------------------------------------------------
    // Метод | Заполняем все свойства элемента из структуры data
    //
    setData(data, settings, caller) {
        console.group("class PackageContainerItem.setData {");
        console.log("this: %o", this);
        console.log("data: %o", data);
        console.log("settings: %o", settings);
        
        var show = false;
        if (!this._hidden) {

            this.hide();
            show = true;
        }
        
        this.setSettings(settings, caller);
        
        this.refId        = data.refId          ? data.refId : 0;
        this.code         = data.code             ? data.code : "";
        this.name         = data.name             ? data.name : "";
        this.payload      = data.payload          ? parseInt(data.payload) : 0;
        this.color        = data.color            ? (data.color[0] == "#" ? "" : "#") + data.color  : "#000000";
            this.addr         = data.addr             ? data.addr : "0";
            this.x            = data.x ? parseFloat(data.x) : 0;     // если в data есть координата, то беерем ее, иначе берем 0 
            this.y            = data.y ? parseFloat(data.y) : 0;     // если в data есть координата, то беерем ее, иначе берем 0
        this.wx           = parseInt(data.wx ? data.wx : 0);     // размеры элемента из базы
        this.wy           = parseInt(data.wy ? data.wy : 0);     // размеры элемента из базы
        this.wz           = parseInt(data.wz ? data.wz : 0);     // размеры элемента из базы
        this.iwx          = parseInt(data.iwx ? data.iwx : 0);   // размеры элемента из базы
        this.iwy          = parseInt(data.iwy ? data.iwy : 0);   // размеры элемента из базы
        this.iwz          = parseInt(data.iwz ? data.iwz : 0);   // размеры элемента из базы
        // this.inRow        = data.inrow ? parseInt(data.inrow) : 0;     // если в data есть inRow, то беерем, иначе берем 0
        
        // создаем внутренние элементы
        this.createItems(data.item, settings.item);
        
        if (!this._parent && (this != caller)) {
            this.depth = data.depth ? parseInt(data.depth) : settings.depth;
            // console.log("this.depth: %o", this.depth);
            this.turned = (data.turned == null || data.turned == undefined) ? 0 : parseInt(data.turned);        
            // console.log("this.turned: %o", data.turned);
        }
        if (show) {this.show();}

        console.log("this: %o", this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Удаляет все внутренние элементы
    //
    createItems(data, settings) {
        console.group("Class PackageContainerItem.createItems");
        console.log("this: %o", this);

        // if (!this._hidden) {this.clear();}

        // если информация о внутренних элементах имеется
        if (data) {

            // то создаем массив внутренних элементов
            data.forEach(sub => {
                // console.log("sub item: %o }", sub);

                // создаем новый внутренний элемент
                var item = new PackageContainerItem(this, sub, settings, canvas);

                // сообщаем новому элементу область, где он будет размещен
                item.viewBox = {x: this.x, y: this._y, wx: this._wx, wy: this._wy};

                // сообщаем новому элементу масштаб отображения
                item.scale = this._scale;

                // добавляем новый элемент в массив внутренних элементов
                this.item.push(item);

                if (!this._parent) {this.changed = true;}
            });
        }
        // if (!this._hidden) {this.draw();}

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Удаляет все внутренние элементы
    //
    clearItems() {
        console.group("class PackageContainerItem.clearItems {");
        console.log("this: %o", this);

        if (!this._hidden) {this.clear();}
        
        this.item = [];

        if (!this._parent) {this.changed = true;}

        if (!this._hidden) {this.draw();}

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Стирает элемент на <canvas>
    //         Если clearCanvas = true, то элемент очистит весь canvas
    //
    clear(clearCanvas) {
        // console.groupCollapsed("class PackageContainerItem.clear {");
        // console.log("this: %o", this);

        if (!this._hidden) {

            var x, y, wx, wy;
            
            // если надо очистить всю область canvas
            if (clearCanvas) {
                
                x = 0;
                y = 0;
                wx = this.canvas.width;
                wy = this.canvas.height;
            } else {
                
                x = this.viewBox.x + this[this.disposition.x];
                y = this.viewBox.y + this[this.disposition.y];
                wx = this[this.disposition.wx];
                wy = this[this.disposition.wy];
            }
            
            this._ctx.save();
            this._ctx.scale(1/this.scale, 1/this.scale);
            
            this._ctx.clearRect(x, y, wx, wy);
            
            this._ctx.restore();
            
            this.item.forEach( subItem => {
                subItem.clear();
            });
        }

        // console.groupEnd();
    }


    
    // -------------------------------------------------------
    // Метод | Рисуем рамку если есть ._border > 0
    //         Закрашиваем прямоугольник на 
    //         Графику выводлим на ._canvas.context
    //         Пишем текст если эелемент активный ._active = true
    //         
    drawCube(x, y, wx, wy, iwx, iwy, selected, ctx, scale, text) {

        var color = selected ? this._selectedColor : this.color;
        var borderColor = this._mouseOver ? this._mouseOverColor : this._borderColor;
        var border = this._mouseOver ? scale * this._mouseOverBorder / 10 : scale * this.border / 10;
        var iBorderColor = this.iBorderColor;
        var iBorder = scale * this.iBorder / 10;
        var padding = scale * this.padding / 10;

        var _x = this.viewBox.x + x + padding;
        var _y = this.viewBox.y + y + padding;
        var _wx = wx - padding * 2;
        var _wy = wy - padding * 2;

        var _ix = this.viewBox.x + x + (wx - iwx) / 2;
        var _iy = this.viewBox.y + y + (wy - iwy) / 2;
        var _iwx = iwx;
        var _iwy = iwy;

        ctx.save();
        ctx.scale(1/scale, 1/scale);

        // рисуем прямоугольник
        ctx.fillStyle = color;
        ctx.fillRect(
            _x,
            _y,
            _wx,
            _wy
        );
        
        // рисуем рамку
        if (border > 0) {
            ctx.lineWidth = border;
            ctx.strokeStyle = borderColor;

            ctx.strokeRect(
                _x + border,
                _y + border,
                _wx - border * 2,
                _wy - border * 2
            );
        }

        // рисуем рамку внутренних размеров
        if (iBorder > 0) {
            ctx.lineWidth = iBorder;
            ctx.strokeStyle = iBorderColor;

            ctx.strokeRect(
                _ix + iBorder,
                _iy + iBorder,
                _iwx - iBorder * 2,
                _iwy - iBorder * 2
            );
        }

        // показываем текст
        if (this._showText) {

            ctx.fillStyle = '#ffffff';
            ctx.font = Math.min(_wx, _wy) * 0.5 + 'px CoreSansDS25Light';
            ctx.fillText(text, _x + _wx * 0.05, _y + _wy * 0.9, _wx * 0.9);
        }

        ctx.restore();
    }



    // -------------------------------------------------------
    // Метод | Коннтейнер рисует себя и внутренние прямоугольники
    //
    draw() {
        if (!this._hidden) {
            // console.groupCollapsed("class PackageContainerItem.draw {");
            // console.log("this: %o", this);

            // рисуем элемент
            this.drawCube(
                // window.requestAnimationFrame(() => this.drawCube(
                    this[this._disposition.x],
                    this[this._disposition.y],
                    this[this._disposition.wx],
                    this[this._disposition.wy],
                    this[this._disposition.wx],
                    this[this._disposition.wy],
                    this.selected,
                    this._ctx,
                    this.scale,
                    this.addr
                );
    
            // рисуем блоки                
            this.item.forEach( subItem => {
                subItem.draw();
            });
            // console.groupEnd();
        }
    }



    // -------------------------------------------------------
    // Метод | Перерисуем элемент
    //
    reDraw() {
        if (!this._hidden) {
            console.groupCollapsed("class PackageContainerItem.reDraw {");

            this.clear();
            this.draw();
            console.groupEnd();
        }
    }



    // -------------------------------------------------------
    // Метод | Перерисуем все внутренние элементы
    //
    reDrawItems() {
        // console.groupCollapsed("class PackageContainerItem.reDrawItems {");
        if (!this._hidden) {

            this.item.forEach( subItem => {
                subItem.clear();
                subItem.draw();
            });
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Делаем элемент не видимым
    //
    hide() {
        // console.groupCollapsed("class PackageContainerItem.hide {");
        if (!this._hidden) {

            // стираем элемент
            this.clear(true && !this._parent);

            // скрываем элемент
            this._hidden = true;
            
            // скрываем внутренние элементы
            this.item.forEach( subItem => {
                subItem.hide();
            });
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Делаем элемент видимым
    //
    show(depth) {
        // console.groupCollapsed("class PackageContainerItem.show {");
        if (this._hidden) {
            
            if (!this._parent) {
                
                this.clear(true);
            }

            // рисуем элемент
            this._hidden = false;
        
            // рисуем элемент
            this.draw();
    
            if (!this._parent) {depth = this.depth;}

            // рисуем блоки
            if (depth > 1) {
                // показываем внутренние элементы
                this.item.forEach( subItem => {
                    subItem.show(depth - 1);
                });
            }
        }
        // console.groupEnd();
    }
    


    // -------------------------------------------------------
    // Слот | Обрабатываем перемещение указателя мыши
    //
    // 
    mouseInRect(mouseX, mouseY) {
        // console.group("class PackageContainerItem.mouseInRect { id: %i; code: %s", this._id, this._code);    

        // приводим координаты к плоскости настроенной в .disposition
        var x = this[this.disposition.x];
        var y = this[this.disposition.y];
        var wx = this[this.disposition.wx];
        var wy = this[this.disposition.wy];

        var dpi = this.canvas.width / parseInt(this.canvas.style.width);
        // приводим координаты мыши в клиентской области <canvas>
        // к текущему масштабу
        var _mouseX = (mouseX * this.scale * dpi);
        var _mouseY = (mouseY * this.scale * dpi);
        
        // проверяем попадает ли указатель мыши по горизонтали в ширину ячейки
        let xClickInside = (_mouseX > (this.viewBox.x + x)) && (_mouseX < (this.viewBox.x + x + wx));
        
        // проверяем попадает ли по вертикали указатель мыши в высоту ячейки
        let yClickInside = (_mouseY > (this.viewBox.y + y)) && (_mouseY < (this.viewBox.y + y + wy));
        
        // проверяем попадание курсора в ячейку
        var mouseInRect = xClickInside && yClickInside;

        return mouseInRect
    }



    // -------------------------------------------------------
    // Слот | Обрабатываем перемещение указателя мыши
    //
    // 
    onMouseOver(mouseX, mouseY) {
        // console.group("class PackageContainerItem.onMouseOver { id: %i; code: %s", this._id, this._code);    
        
        // если элемент видимый
        if (!this._hidden) {
        
            // передаем попадание указателя мыши в ячейку
            if (this.active && this.mouseInRect(mouseX, mouseY)) {
                
                if (!this._mouseOver) {
                    // выделенный элемент подсвечивает себя цветом
                    this._mouseOver = true;
                    this.draw();
                }
            } else {
                
                if (this._mouseOver) {

                    // перерисовываем елемент в нормальном цвете
                    this._mouseOver = false;
                    this.draw();
                }
            }

            //  передаем событие дальше внутренним элементам
            var subMouseOver = [];
            this.item.forEach( subItem => {
                var mouseOver = subItem.onMouseOver(mouseX, mouseY);
                if (mouseOver) {
                    subMouseOver.push(mouseOver);
                }
            });

            return subMouseOver[0] ? subMouseOver[0] : ((this._active && this._mouseOver) ? this : false);
        } else {

            return false;
        }
        // console.groupEnd();    
    }
    

    
    // -------------------------------------------------------
    // Слот | Обрабатываем клик мышью
    // 
    onClick(mouseX, mouseY) {
        // console.group("class PackageContainerItem.onClick { pack: %o; code: %s", this, this._code);    
                
        // если элемент видимый
        if (!this._hidden) {

            // очищаем массив выделенных внутренних элементов
            this.selectedItem = [];
    
            // передаем попадание клика в ячейку
            // для изменения и запоминания нового статуса "ВЫБРАН"
            if (this.active && this.mouseInRect(mouseX, mouseY)) {
    
                if (!this.selected) {
                    // выделенный элемент подсвечивает себя цветом
                    this.selected = true;
                }
            } else {

                if (this.selected) {

                    // элемент не выделен, убирает подсвечивание себя цветом
                    this.selected = false;
                }
            }
    
            //  передаем событие дальше внутренним элементам
            var subSelected;
            this.item.forEach( subItem => {
                subSelected = subItem.onClick(mouseX, mouseY);
                if (subSelected) {
                    this.selectedItem.push(subSelected);
                }
            });
    
            // елемент активный, то возвращает себя, иначе возвращает первый выбранный внутренний элемент
            return this.selectedItem[0] ? this.selectedItem[0] : ((this._active && this._selected) ? this : false);
        } else {

            return false;
        }
        // console.groupEnd();    
    }



    // -------------------------------------------------------
    // Слот | Обрабатываем двойной клик мышью
    // 
    onDblClick(mouseX, mouseY) {
        // console.group("class PackageContainerItem.onDblClick { pack: %o; code: %s", this, this._code);    
                
        // если элемент видимый
        if (!this._hidden) {

            // очищаем массив выделенных внутренних элементов
            this.selectedItem = [];
    
            // передаем попадание клика в ячейку
            // для изменения и запоминания нового статуса "ВЫБРАН"
            if (this.active && this.mouseInRect(mouseX, mouseY)) {
    
                if (!this.selected) {
                    // выделенный элемент подсвечивает себя цветом
                    this.selected = true;
                }
            } else {

                if (this.selected) {

                    // элемент не выделен, убирает подсвечивание себя цветом
                    this.selected = false;
                }
            }
    
            //  передаем событие дальше внутренним элементам
            var subSelected;
            this.item.forEach( subItem => {
                subSelected = subItem.onDblClick(mouseX, mouseY);
                if (subSelected) {
                    this.selectedItem.push(subSelected);
                }
            });
    
            // елемент активный, то возвращает себя, иначе возвращает первый выбранный внутренний элемент
            return this.selectedItem[0] ? this.selectedItem[0] : (this.active && this.selected) ? this : false;
        } else {

            return false;
        }
        // console.groupEnd();    
    }
}