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





// =======================================================
// Класс | PackageSimple
//         место хранения, простого типа, 
//         состоящее из одного элементарного элемента 
//
class PackageSimple {

    
    // -------------------------------------------------------
    // Метод | Создаем элемент
    constructor(parent, id = 0, canvas) {
        console.group("class PackageSimple.constructor");
        console.log("id: %i", id);
        
        this._parent = parent;      // родительский контейнер

        // this.hashCode = generateId(7);
        // технологические свойства элемента
        //
        this._id = id;
        this._code;                 // обозначение
        this._name;                 // наименование 
        this._material;             // название материала из которого сделан
        this._payload;              // вес который выдерживает

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
        this._new = true;           // если true, то элемент новый и его нет в базе данных

        this.onChange;

        console.log("this: %o", this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | id элемента в базе данных
    //
    set id(value) {this._id = value;}

    get id() {return this._id;}



    // -------------------------------------------------------
    // Свойство | Обозначение элемента
    //
    set code(value) {this._code = value;}

    get code() {return this._code;}



    // -------------------------------------------------------
    // Свойство | Нименование элемента
    //
    set name(value) {this._name = value;}

    get name() {return this._name;}



    // -------------------------------------------------------
    // Свойство | Материал элемента
    //
    set material(value) {this._material = value;}

    get material() {return this._material;}



    // -------------------------------------------------------
    // Свойство | Вес который может выдержать элемент, в граммах
    //
    set payload(value) {this._payload = value;}

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
    // Свойство | Цвет прямоугольника элемента в нормальном состоянии
    //
    set color(value) {
        this._color = value;
        this._selectedColor = shadeColor(this._color, -20);
    }

    get color() {return this._color;}



    // -------------------------------------------------------
    // Свойство | Рамка элемента когда указатель мыши на ним
    //
    set border(value) {this._border = value;}

    get border() {return this._border;}



    // -------------------------------------------------------
    // Свойство | Цвет рамки
    //
    set borderColor(value) {this._borderColor = value;}

    get borderColor() {return this._borderColor;}



    // -------------------------------------------------------
    // Свойство | Рамка внутренних размеров элемента
    //
    set iBorder(value) {this._iBorder = value;}

    get iBorder() {return this._iBorder;}



    // -------------------------------------------------------
    // Свойство | Цвет рамки внутренних размеров
    //
    set iBorderColor(value) {this._iBorderColor = value;}

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
    // Свойство | масштаб отображения MAX(wx/dispW, wy/dispH) мм/px
    //
    set scale(value) {this._scale = value;}

    get scale() {return this._scale;}



    // -------------------------------------------------------
    // Свойство | Если true, то элемент впишет себя во viewBox
    //
    set autoFit(value) {
        this._autoFit = value;
        this.autoScale();
    }

    get autoFit() {return this._autoFit;}



    // -------------------------------------------------------
    // Свойство | Отступ цветного прямоугольбник от краев элемента
    //
    set padding(value) {this._padding = value;}

    get padding() {return this._padding;}



    // -------------------------------------------------------
    // Свойство | Координата на canvas
    //
    set x(value) {
        this._x = value;
        // this.setSize(this._wx, this._wy, this._wz, true);
    }

    get x() {return this._x;}



    // -------------------------------------------------------
    // Свойство | Координата на canvas
    //
    set y(value) {
        this._y = value;
        // this.setSize(this._wx, this._wy, this._wz, true);
    }

    get y() {return this._y;}



    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set wx(value) {
        this.setSize(value, this._wy, this._wz);
    }
        
    get wx() {return this._wx;}
       
    
        
    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set wy(value) {
        this.setSize(this._wx, value, this._wz);
    }
    
    get wy() {return this._wy;}
    

    
    // -------------------------------------------------------
    // Свойство | Внутренний размер
    //
    set wz(value) {
        this.setSize(this._wx, this._wy, value);
    }

    get wz() {return this._wz;}



    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set iwx(value) {
        this.setInternalSize(value, this._iwy, this._iwz);
    }
        
    get iwx() {return this._iwx;}
        

        
    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set iwy(value) {
        this.setInternalSize(this._iwx, value, this._iwz);
    }
    
    get iwy() {return this._iwy;}
    

    
    // -------------------------------------------------------
    // Свойство | Наружний размер
    //
    set iwz(value) {
        this.setInternalSize(this._iwx, this._iwy, value);
    }

    get iwz() {return this._iwz;}



    // -------------------------------------------------------
    // Свойство | Прямоугольник в котором элемент рисует себя
    //
    set viewBox(value) {
        this._viewBox = value;
        if (this._autoFit == 'contain') {this.autoScale();}
    }

    get viewBox() {return this._viewBox;}



    // -------------------------------------------------------
    // Свойство | Соответствие координат и размеров элемента 
    //            координатам и размерам отображения
    //
    set disposition(value) {
        this._disposition = value;
        if (this._autoFit == 'contain') {this.autoScale();}
    }

    get disposition() {return this._disposition;}



    // -------------------------------------------------------
    // Свойство | Определяет положение элемента в один ряд со следующим
    //
    set inRow(value) {
        this._inRow = value;
    }

    get inRow() {return this._inRow;}



    // -------------------------------------------------------
    // Свойство | Определяет глубину загрузки и отображения
    //            внутренних элементов
    //
    set depth(value) {
        this._depth = value;
    }

    get depth() {return this._depth;}



    // -------------------------------------------------------
    // Свойство | Определяет повернут ли элемент
    //
    set turned(value) {
        this._turned = value;
        if (this._autoFit == 'contain') {this.autoScale();}
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
    set new(value) {this._new = value;}

    get new() {return this._new;}



    // -------------------------------------------------------
    // Метод | Расчет масштаба отображения элемента
    //
    autoScale() {
        // console.groupCollapsed("class PackageContainerItem.updateScale { );

        if (this._autoFit == 'contain') {
            
            var wx = parseFloat(this['_' + this._disposition.wx]);
            var wy = parseFloat(this['_' + this._disposition.wy]);

            this._xScale = wx / this._viewBox.wx;
            this._yScale = wy / this._viewBox.wy;
    
            this._scale = Math.max(this._xScale, this._yScale);
    
            this._x = (this._viewBox.wx * this._scale - wx) / 2;
            this._y = (this._viewBox.wy * this._scale - wy) / 2;
        }

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Изменение внешних размеров элемента
    //
    setSize(wx = 0, wy = 0, wz = 0, force = false) {

        // если размеры элемента изменились или forse = true
        if ((this._wx != wx) || (this._wy != wy) || (this._wz != wz) || force) {

            // сохраняем новые значения размеров
            this._wx = wx;
            this._wy = wy;
            this._wz = wz;
         
            // если autoFit = 'contain' то подгоняем масштаб что бы вписать элемент в контейнер не изменяя пропорции
            if (this._autoFit == 'contain') {this.autoScale();}
        }
    }


    
    // -------------------------------------------------------
    // Метод | Изменение внутренних размеров элемента
    //
    setInternalSize(wx = 0, wy = 0, wz = 0, force = false) {

        // если размеры элемента изменились или forse = true
        if ((this._iwx != wx) || (this._iwy != wy) || (this._iwz != wz) || force) {

            // сохраняем новые значения размеров
            this._iwx = wx;
            this._iwy = wy;
            this._iwz = wz;
        }
    }


    
    // -------------------------------------------------------
    // Метод | Стирает элемент на <canvas>
    //         Если clearCanvas = true, то элемент очистит весь canvas
    //
    clear(clearCanvas) {

        var x, y, wx, wy;

        // если надо очистить всю область canvas
        if (clearCanvas) {

            x = 0;
            y = 0;
            wx = this._canvas.width;
            wy = this._canvas.height;
        } else {

            x = this._viewBox.x + this['_' + this._disposition.x];
            y = this._viewBox.y + this['_' + this._disposition.y];
            wx = this['_' + this._disposition.wx];
            wy = this['_' + this._disposition.wy];
        }

        this._ctx.save();
        this._ctx.scale(1/this._scale, 1/this._scale);

        this._ctx.clearRect(x, y, wx, wy);

        this._ctx.restore();
    }



    // -------------------------------------------------------
    // Метод | Делает элемент невидимым
    //
    hide() {
        if (!this._hidden) {

            this._hidden = true;
            
            // стираем элемент
            this.clear(true);
        }
    }



    // -------------------------------------------------------
    // Метод | Делает элемент видимым
    //
    show() {
        this._hidden = false;
        
        // рисуем элемент
        this.draw();
    }
    

    
    // -------------------------------------------------------
    // Метод | Рисуем рамку если есть ._border > 0
    //         Закрашиваем прямоугольник на 
    //         Графику выводлим на ._canvas.context
    //         Пишем текст если эелемент активный ._active = true
    //         
    drawCube(x, y, wx, wy, iwx, iwy, selected, ctx, scale, text) {

        var color = selected ? this._selectedColor : this._color;
        var borderColor = this._mouseOver ? this._mouseOverColor : this._borderColor;
        var border = this._mouseOver ? scale * this._mouseOverBorder / 10 : scale * this._border / 10;
        var iBorderColor = this._iBorderColor;
        var iBorder = scale * this._iBorder / 10;
        var padding = scale * this._padding / 10;

        var _x = this._viewBox.x + x + padding;
        var _y = this._viewBox.y + y + padding;
        var _wx = wx - padding * 2;
        var _wy = wy - padding * 2;

        var _ix = this._viewBox.x + x + (wx - iwx) / 2;
        var _iy = this._viewBox.y + y + (wy - iwy) / 2;
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
    // Метод | Вызывает метод рисования прямоугольника с нужными параметрами
    //
    draw() {
        if (!this._hidden) {
            // console.log("class PackageSimple.draw{ id=" + this._id);

            this.drawCube(
            // window.requestAnimationFrame(() => this.drawCube(
                this['_' + this._disposition.x],
                this['_' + this._disposition.y],
                this['_' + this._disposition.wx],
                this['_' + this._disposition.wy],
                this['_i' + this._disposition.wx],
                this['_i' + this._disposition.wy],
                this.selected,
                this._ctx,
                this._scale,
                this._code
            );
            // console.log("class PackageSimple.draw }");
        }
    }



    // -------------------------------------------------------
    // Метод | Перерисовывает ячейку на <canvas>
    //
    reDraw() {
        if (!this._hidden) {

            this.clear();
            this.draw();
        }
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
class PackageContainerItem extends PackageSimple {

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

        // вызов конструктора родителя
        super(parent, data.id, canvas);

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
    // Свойство | 
    //
    set color(value) {
        if (this._color != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.color = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get color() {return this._color;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set border(value) {
        if (this._border != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.border = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get border() {return this._border;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set borderColor(value) {
        if (this._borderColor != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.borderColor = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get borderColor() {return this._borderColor;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set iBorder(value) {
        if (this._iBorder != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.iBorder = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get iBorder() {return this._iBorder;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set iBorderColor(value) {
        if (this._iBorderColor != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.iBorderColor = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get iBorderColor() {return this._iBorderColor;}



    // -------------------------------------------------------
    // Свойство | масштаб отображения MAX(wx/viewBox.wx, wy/viewBox.wy) мм/px
    //
    set scale(value) {

        if (this._scale != value) {

            if (!this._hidden && !this._parent) {this.clear(true);}

            // обновляем масштаб элемента
            super.scale = value;
    
            // обновляем масштаб внутренних элементов
            this.item.forEach( subItem => {
                subItem.scale = this._scale;
            });

            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get scale() {return this._scale;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set autoFit(value) {

        if (this._autoFit != value) {

            if (!this._hidden && !this._parent) {this.clear();}

            // обновляем autoFit элемента
            super.autoFit = value;
    
            // обновляем viewBox внутренних элементов
            this.setItemsViewBox();
    
            // обновляем масштаб внутренних элементов
            this.item.forEach( subItem => {
                subItem.scale = this._scale;
            });

            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get autoFit() {return this._autoFit;}


    
    // -------------------------------------------------------
    // Свойство | 
    //
    set padding(value) {
        if (this._padding != value) {
            if (!this._hidden && !this._parent) {this.clear();}
            super.padding = value;
            if (!this._hidden && !this._parent) {this.draw();}
        }
    }

    get padding() {return this._padding;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set x(value) {
        if (this._x != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.x = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get x() {return this._x;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set y(value) {
        if (this._y != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.y = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get y() {return this._y;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set wx(value) {
        if (this._wx != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.wx = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
        
    get wx() {return this._wx;}
        
        

    // -------------------------------------------------------
    // Свойство | 
    //
    set wy(value) {
        if (this._wy != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.wy = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
    
    get wy() {return this._wy;}
    

    
    // -------------------------------------------------------
    // Свойство | 
    //
    set wz(value) {
        if (this._wz != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.wz = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get wz() {return this._wz;}



    // -------------------------------------------------------
    // Свойство | 
    //
    set iwx(value) {
        if (this._iwx != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.iwx = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
        
    get iwx() {return this._iwx;}
        

        
    // -------------------------------------------------------
    // Свойство | 
    //
    set iwy(value) {
        if (this._iwy != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.iwy = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }
    
    get iwy() {return this._iwy;}
    
    

    // -------------------------------------------------------
    // Свойство | 
    //
    set iwz(value) {
        if (this._iwz != value) {
            if (!this._hidden && !this._parent) {this.clear(true);}
            super.iwz = value;
            this.setItemsViewBox();
            if (!this._hidden && !this._parent) {this.draw();}
        }
        if (!this._parent) {this.changed = true;}
    }

    get iwz() {return this._iwz;}



    // -------------------------------------------------------
    // Свойство | Прямоугольник в котором элемент будет отображен
    //
    set viewBox(value) {

        if (!this._hidden && !this._parent) {this.clear();}

        // обновляем viewBox элемента
        super.viewBox = value;

        // обновляем viewBox внутренних элементов
        this.setItemsViewBox();

        if (!this._hidden && !this._parent) {this.draw();}
    }

    get viewBox() {return this._viewBox;}



    // -------------------------------------------------------
    // Свойство | Расположение элемента в контейнере
    //
    set disposition(value) {

        if (!this._hidden && !this._parent) {this.clear(true);}

        // обновляем viewBox элемента
        super.disposition = value;
        
        var scale = this._scale;

        // обновляем viewBox внутренних элементов
        this.setItemsViewBox();

        // обновляем disposition внутренних элементов
        this.item.forEach( subItem => {
            // subItem.disposition = value;
            subItem.scale = scale;
        });        
        
        if (!this._hidden && !this._parent) {this.draw();}

        if (!this._parent) {this.changed = true;}
    }

    get disposition() {return this._disposition;}



    // -------------------------------------------------------
    // Свойство | Определяет глубину загрузки и отображения
    //            внутренних элементов
    //
    set depth(value) {
        super.depth = value;

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
        super.turned = value;
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
                x: this._viewBox.x + this._x,
                y: this._viewBox.y + this._y,
                wx: this['_' + this.disposition.wx],
                wy: this['_' + this.disposition.wy]
            }
        });
        // if (!this._hidden) {this.draw();}
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
            var url = "setPackage.php";
            var subItems = [];
            this.item.forEach( item => {
                subItems.push({
                    'sub_package_id': item.id,
                    'inrow': item.inRow,
                    'x': item.x,
                    'y': item.y
                });
            });

            // элемент новый
            if (this._new) {
                
                url = "addPackage.php";
            }

            // отправляем запрос серверу POST (UPDATE)
            this.requestToServer(this, 'POST', url, 'json',
                { 
                    "package_id": this._id,
                    "package_code": this._code,
                    "package_name": this._name,
                    "package_payload": this._payload,
                    "package_wx": this._wx,
                    "package_wy": this._wy,
                    "package_wz": this._wz,
                    "package_iwx": this._iwx,
                    "package_iwy": this._iwy,
                    "package_iwz": this._iwz,
                    "package_color": this._color.replace("#", ""),
                    "item": subItems.length > 0 ? subItems : null,
                    "package_depth": this._depth,
                    "package_turned": this._turned
                },

                // если успешно и сервер вернул данные
                function(target, jsonResponce) {
        
                    // ответ сервера
                    var result = jsonResponce; //JSON.parse(jsonResponce);

                    if (result.package_id) {

                        //если элемент новый
                        if (target.new) {
                            
                            // обновляем id элемента
                            target._id = result.package_id ? parseInt(result.package_id) : 0;
                            
                            // снимаем статус "new"
                            target._new = false;
                        }
                        // помечаем что элемент сохранен
                    }
                    target.changed = false;    
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
    load(successFunction, errorFunction, caller, depth) {
        console.group("class PackageContainerItem.load {");
        console.log("this: %o", this);

        // формируем данные для отправки на сервер
        var data = {
            "package_id": this._id,         // идентификатор загружаемого элемеента
            "package_depth": depth ? depth : this._settings.depth
        };

        // отправляем запрос серверу
        this.requestToServer(this, 'POST', '../package/getPackage.php', 'json', data,

            // если успешно и сервер вернул данные
            function(target, jsonResponce) {
                    
                if (parseInt(jsonResponce.errCount) > 0) {
                } else {

                    // в ответе сервера одна запись, 
                    // содержит всю информацию одного элемента 
                    var row = jsonResponce[0];

                    // Заполняем все свойства элемента из ответа сервера
                    target.setData(row, target._settings);

                    // убираем статус "изменен", так как элемент существует в базе данных
                    target.changed = false;

                    // убираем статус "новый", так как элемент существует в базе данных
                    target._new = false;
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
    setSettings(settings) {
        this.padding      = settings.padding      ? settings.padding      : 0;
        this.border       = settings.border       ? settings.border       : 0;
        this.borderColor  = settings.borderColor  ? settings.borderColor  : 0;
        this.iBorder      = settings.iBorder      ? settings.iBorder      : 0;
        this.iBorderColor = settings.iBorderColor ? settings.iBorderColor : "#000000";
        this.showText     = settings.showText     ? settings.showText     : 0;
        this.textColor    = settings.textColor    ? settings.textColor    : 0;
        this.disposition  = settings.disposition  ? settings.disposition  : {x: 'x', y: 'y', wx: 'wx', wy: 'wy', wz: 'wz'};
        this.active       = settings.active       ? settings.active       : false;
        this.autoFit      = settings.autoFit      ? settings.autoFit      : 'none';
    }

    get settings() {return this._settings;}



    // -------------------------------------------------------
    // Метод | Заполняем все свойства элемента из структуры data
    //
    setData(data, settings) {
        console.group("class PackageContainerItem.setData {");
        console.log("this: %o", this);
        console.log("data: %o", data);
        console.log("settings: %o", settings);
        
        var show = false;
        if (!this._hidden) {

            this.hide();
            show = true;
        }

        this.setSettings(settings);
        
        this.art          = data.art              ? data.art  : "0";
        this.code         = data.code             ? data.code : "";
        this.name         = data.name             ? data.name : "";
        this.payload      = data.payload          ? parseInt(data.payload) : 0;
        this.color        = data.color            ? (data.color[0] == "#" ? "" : "#") + data.color  : "#000000";
        this.viewBox      = {x: 0, y: 0, wx: this._canvas.width, wy: this._canvas.height};
        this.x            = data.x ? parseFloat(data.x) : 0;     // если в data есть координата, то беерем ее, иначе берем 0 
        this.y            = data.y ? parseFloat(data.y) : 0;     // если в data есть координата, то беерем ее, иначе берем 0
        this.setSize(
            parseInt(data.wx ? data.wx : 0),      // размеры элемента из базы
            parseInt(data.wy ? data.wy : 0),      // размеры элемента из базы
            parseInt(data.wz ? data.wz : 0)       // размеры элемента из базы
        );               
        this.setInternalSize(
            parseInt(data.iwx ? data.iwx : 0),      // размеры элемента из базы
            parseInt(data.iwy ? data.iwy : 0),      // размеры элемента из базы
            parseInt(data.iwz ? data.iwz : 0)       // размеры элемента из базы
        );               
        this.inRow        = data.inrow ? parseInt(data.inrow) : 0;     // если в data есть inRow, то беерем, иначе берем 0

        // создаем внутренние элементы
        this.createItems(data.item, settings.item);
        
        if (!this._parent) {
            this.depth = data.depth ? parseInt(data.depth) : settings.depth;
            // console.log("this.depth: %o", this.depth);
            this.turned = (data.turned == null || data.turned == undefined) ? 0 : parseInt(data.turned);        
            // console.log("this.turned: %o", data.turned);
        }

        if (show) {this.show();}

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
                item.viewBox = {x: this._x, y: this._y, wx: this._wx, wy: this._wy};

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
    // Метод | Стираем ячейку на <canvas>
    //
    clear(clearCanvas) {
        // console.groupCollapsed("class PackageContainerItem.clear {");
        // console.log("this: %o", this);

        super.clear(clearCanvas);

        this.item.forEach( subItem => {
            subItem.clear();
        });

        // console.groupEnd();
    }


    
    // -------------------------------------------------------
    // Метод | Коннтейнер рисует себя и внутренние прямоугольники
    //
    draw() {
        if (!this._hidden) {
            // console.groupCollapsed("class PackageContainerItem.draw {");
            // console.log("this: %o", this);

            // рисуем элемент
            super.draw();

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

            // скрываем элемент
            super.hide();

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
            super.show();

            if (!this._parent) {depth = this._depth;}

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
        var x = this['_' + this._disposition.x];
        var y = this['_' + this._disposition.y];
        var wx = this['_' + this._disposition.wx];
        var wy = this['_' + this._disposition.wy];

        var dpi = this._canvas.width / parseInt(this._canvas.style.width);
        // приводим координаты мыши в клиентской области <canvas>
        // к текущему масштабу
        var _mouseX = (mouseX * this._scale * dpi);
        var _mouseY = (mouseY * this._scale * dpi);
        
        // проверяем попадает ли указатель мыши по горизонтали в ширину ячейки
        let xClickInside = (_mouseX > (this._viewBox.x + x)) && (_mouseX < (this._viewBox.x + x + wx));
        
        // проверяем попадает ли по вертикали указатель мыши в высоту ячейки
        let yClickInside = (_mouseY > (this._viewBox.y + y)) && (_mouseY < (this._viewBox.y + y + wy));
        
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
            if (this._active && this.mouseInRect(mouseX, mouseY)) {
                
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
            if (this._active && this.mouseInRect(mouseX, mouseY)) {
    
                if (!this._selected) {
                    // выделенный элемент подсвечивает себя цветом
                    this.selected = true;
                }
            } else {

                if (this._selected) {

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
            if (this._active && this.mouseInRect(mouseX, mouseY)) {
    
                if (!this._selected) {
                    // выделенный элемент подсвечивает себя цветом
                    this.selected = true;
                }
            } else {

                if (this._selected) {

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
            return this.selectedItem[0] ? this.selectedItem[0] : (this._active && this._selected) ? this : false;
        } else {

            return false;
        }
        // console.groupEnd();    
    }
}