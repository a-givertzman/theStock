"use strict";





// =======================================================
// Объект | Модель данных
//          Массив записей соответствующих таблице в базе данных,
//          по этой структуре работают все другие объекты и алгоритмы
//

// набор данных из таблицы place_pattern
var dataSet = [];



const dataModel = {
    data: {
        id: null,
        name: '',
        code: '',
        iwx: 0,
        iwy: 0,
        iwz: 0,
        volume: 0,
        payload: 0,
        nature_id: null,
        wx: 0,
        wy: 0,
        wz: 0,
        archetype_id: null,
        bycoordinates: 0,
        color: 0,
        depth: 0,
        view: 0,
        deleted: null,
        sub1_id: null,
        inrow1: 0,
        position1: 0,
        x1: 0,
        y1: 0,
        sub2_id: null,
        inrow2: 0,
        position2: 0,
        x2: 0,
        y2: 0,
        sub3_id: null,
        inrow3: 0,
        position3: 0,
        x3: 0,
        y3: 0,
        sub4_id: null,
        inrow4: 0,
        position4: 0,
        x4: 0,
        y4: 0,
        sub5_id: null,
        inrow5: 0,
        position5: 0,
        x5: 0,
        y5: 0,
        sub6_id: null,
        inrow6: 0,
        position6: 0,
        x6: 0,
        y6: 0,
        sub7_id: null,
        inrow7: 0,
        position7: 0,
        x7: 0,
        y7: 0,
        sub8_id: null,
        inrow8: 0,
        position8: 0,
        x8: 0,
        y8: 0,
        sub9_id: null,
        inrow9: 0,
        position9: 0,
        x9: 0,
        y9: 0
    },
    type: {
        id: 'number',
        name: 'string',
        code: 'string',
        iwx: 'number',
        iwy: 'number',
        iwz: 'number',
        volume: 'number',
        payload: 'number',
        nature_id: 'number',
        wx: 'number',
        wy: 'number',
        wz: 'number',
        archetype_id: 'number',
        bycoordinates: 'number',
        color: 'string',
        depth: 'number',
        view: 'number',
        deleted: 'string',
        sub1_id: 'number',
        inrow1: 'number',
        position1: 'number',
        x1: 'number',
        y1: 'number',
        sub2_id: 'number',
        inrow2: 'number',
        position2: 'number',
        x2: 'number',
        y2: 'number',
        sub3_id: 'number',
        inrow3: 'number',
        position3: 'number',
        x3: 'number',
        y3: 'number',
        sub4_id: 'number',
        inrow4: 'number',
        position4: 'number',
        x4: 'number',
        y4: 'number',
        sub5_id: 'number',
        inrow5: 'number',
        position5: 'number',
        x5: 'number',
        y5: 'number',
        sub6_id: 'number',
        inrow6: 'number',
        position6: 'number',
        x6: 'number',
        y6: 'number',
        sub7_id: 'number',
        inrow7: 'number',
        position7: 'number',
        x7: 'number',
        y7: 'number',
        sub8_id: 'number',
        inrow8: 'number',
        position8: 'number',
        x8: 'number',
        y8: 'number',
        sub9_id: 'number',
        inrow9: 'number',
        position9: 'number',
        x9: 'number',
        y9: 'number'
    }
};



const saveDataModel = {
    data: {
        id: 'null',
        name: '',
        code: '',
        iwx: 0,
        iwy: 0,
        iwz: 0,
        // volume: 0,
        payload: 0,
        nature_id: 'null',
        wx: 0,
        wy: 0,
        wz: 0,
        archetype_id: 'null',
        bycoordinates: 0,
        color: 0,
        depth: 0,
        view: 0,
        // deleted: 'null',
        sub1_id: 'null',
        inrow1: 0,
        position1: 0,
        x1: 0,
        y1: 0,
        sub2_id: 'null',
        inrow2: 0,
        position2: 0,
        x2: 0,
        y2: 0,
        sub3_id: 'null',
        inrow3: 0,
        position3: 0,
        x3: 0,
        y3: 0,
        sub4_id: 'null',
        inrow4: 0,
        position4: 0,
        x4: 0,
        y4: 0,
        sub5_id: 'null',
        inrow5: 0,
        position5: 0,
        x5: 0,
        y5: 0,
        sub6_id: 'null',
        inrow6: 0,
        position6: 0,
        x6: 0,
        y6: 0,
        sub7_id: 'null',
        inrow7: 0,
        position7: 0,
        x7: 0,
        y7: 0,
        sub8_id: 'null',
        inrow8: 0,
        position8: 0,
        x8: 0,
        y8: 0,
        sub9_id: 'null',
        inrow9: 0,
        position9: 0,
        x9: 0,
        y9: 0
    }
};





// =======================================================
// Класс | PlacePattern
//         Работает с одним элементом - прототипом места хранения
//         через dataHendler
//         Рисует элемент и внутренние элементы и
//         передает вычисленные данные в dataHendler.data
//
class PlacePattern {


    // -------------------------------------------------------
    // Метод | Создаем элемент
    constructor(canvas, dataHendler) {
        console.group("class PlacePattern.constructor");

        this.dh = dataHendler;
        this.dh.onChange = (event) => this.update(event);

        // this._settings = null;

        this._iTypeCount = 0;

        // Графические свойства отображения
        //
        this._canvas = canvas;       // объект canvas на котором элемент будет отображен
        this._ctx = this._canvas.getContext('2d');

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
        this._scale = 1;            // масштаб отображения на canvas

        this._autoFit = 'contain';     // contain / none

        this._padding = 0;          // внутренний отступ в % от меньшего габарита viewBox
        // this._margin = 1.0;         // внешний отступ (1 - без отсьупа, 1.01 - отступ в 1%)

        this._viewBox = {           // размер прямоугольника в который должен вписаться элемент при autoFit != 'none
            x: 0,
            y: 0,
            wx: this._canvas.width,
            wy: this._canvas.height
        }

        // поведенческие свойства элемента
        //
        // this._hidden = true;        // если true, то элемент невидимый
        this._active = false;       // если true, то элемент будет реагировать на указатель мыши
        this._mouseOver = false;    // когда указатель мыши над элементом true
        this._selected = false;     // статуса ВЫБРАН / НЕ ВЫБРАН
        this._new = false;          // если true, то элемент новый и его нет в базе данных

        this.onChange;

        console.log("this: %o", this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | id элемента в базе данных
    //
    set id(value) {
        this._id = value;
        this.dh.target = dataSet[value];
        this._new = false;
        this.dh.data.exceeded = '';
        this.update();
    }

    get id() {return this._id;}



    // -------------------------------------------------------
    // Свойство | id базового прототипа элемента в базе данных
    //
    set archetype_id(value) {

        // копируем все поля из целевого объекта в модель данных
        this.dh.data.archetype_id = value;

        const keys = [
            // name: '',
            // code: '',
            'iwx',
            'iwy',
            'iwz',
            'volume',
            'payload',
            'nature_id',
            'wx',
            'wy',
            'wz',
            'wxs1',
            'wys2',
            'wzs3',
            // archetype_id: 0,
            'color'
        ];

        keys.forEach( key => {
            this.dh.data[key] = dataSet[value][key];
        });

        this.update();
    }

    get archetype_id() {return this._archetype_id;}



    // -------------------------------------------------------
    // Свойство | Настройки рисования элементов и содержимого
    //
    // set settings(value) {
        // this._settings = value;
        // this._disposition = this._settings.disposition;
        // this.update();
    // }

    // get settings() {return this._settings;}



    // -------------------------------------------------------
    // Свойство | Количество типов внутренних элементов
    //
    set iTypeCount(value) {
        this._iTypeCount = value;
        this.update();
    }

    get iTypeCount() {return this._iTypeCount;}



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
    // set disposition(value) {
    //     this._disposition = value;
    //     // if (this._autoFit == 'contain') {this.autoScale();}
    // }

    // get disposition() {return this._disposition;}



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
    // Свойство | Если true, то элемента еще нет в базе данных
    //
    set new(value) {this._new = value;}

    get new() {return this._new;}



    // -------------------------------------------------------
    // Метод | Создаем новый элемент, копированием всех свойств из  dataModel
    //
    createNew(baseItem = null) {
        console.group("class PlacePattern.createNew");

        this._id = 0;
        this.dh.target = copyData(                          // создаем новый элемент копированием
            (baseItem == null) ? dataModel.data : baseItem, // если baseItem не null, то на его основе, иначе на основе dataModel
            0,                                              // идентификатор нового элемента будет равен 0
            dataModel                                       // модель данных
        );
        this._new = true;                                   // флаг, указывающий на то, что элемент новый, будет сброшен после сохранения
        // this.dh.data.changed = true;                        // флаг, что новый элемент изменен

        this.update();
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Расчет масштаба отображения элемента
    //
    autoScale() {
        // console.groupCollapsed("class PackageContainerItem.updateScale { );

        if (this._autoFit == 'contain') {

            let wx = parseFloat(this.dh.data[position[this.dh.data['view']].wx]);
            let wy = parseFloat(this.dh.data[position[this.dh.data['view']].wy]);

            let xScale = wx / this._viewBox.wx;
            let yScale = wy / this._viewBox.wy;

            this._scale = Math.max(xScale, yScale);

            this.dh.data.x = (this._viewBox.wx * this._scale - wx) / 2;
            this.dh.data.y = (this._viewBox.wy * this._scale - wy) / 2;
        }

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Стирает элемент на <canvas>
    //         Если clearCanvas = true, то элемент очистит весь canvas
    //
    clear(clearCanvas) {

        let x, y, wx, wy;

        this._ctx.save();

        // если надо очистить всю область canvas
        if (clearCanvas) {

            x = 0;
            y = 0;
            wx = this._ctx.canvas.width;
            wy = this._ctx.canvas.height;
        } else {

            x = this._viewBox.x + this.dh.data[position[this.dh.data['view']].x];
            y = this._viewBox.y + this.dh.data[position[this.dh.data['view']].y];
            wx = this.dh.data[position[this.dh.data['view']].wx];
            wy = this.dh.data[position[this.dh.data['view']].wy];

            this._ctx.scale(1/this._scale, 1/this._scale);
        }

        this._ctx.clearRect(x, y, wx, wy);
        this._ctx.restore();
    }



    // -------------------------------------------------------
    // Метод | Рисуем рамку если есть ._border > 0
    //         Закрашиваем прямоугольник на
    //         Графику выводлим на ._canvas.context
    //         Пишем текст если эелемент активный ._active = true
    //
    drawCube(viewBox, x, y, wx, wy, iwx, iwy, color, selected, ctx, scale, text) {

        var _color = selected ? this._selectedColor : (color[0] == '#' ? color : '#' + color);
        var borderColor = this._mouseOver ? this._mouseOverColor : this._borderColor;
        var border = this._mouseOver ? scale * this._mouseOverBorder / 10 : scale * this._border / 10;
        var iBorderColor = this._iBorderColor;
        var iBorder = scale * this._iBorder / 10;
        var padding = scale * this._padding / 10;

        var _x = viewBox.x + x + padding;
        var _y = viewBox.y + y + padding;
        var _wx = wx - padding * 2;
        var _wy = wy - padding * 2;

        var _ix = viewBox.x + x + (wx - iwx) / 2;
        var _iy = viewBox.y + y + (wy - iwy) / 2;
        var _iwx = iwx;
        var _iwy = iwy;

        ctx.save();
        ctx.scale(1/scale, 1/scale);

        // рисуем прямоугольник
        ctx.fillStyle = _color;
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

        ctx.fillStyle = '#000000';
        ctx.font = Math.min(_wx, _wy) * 0.5 + 'px CoreSansDS25Light';
        ctx.font = scale * 23 + 'px CoreSansDS25Light';
        ctx.fillText(_wx + ' x ' + _wy, _x + scale * 5, _y + _wy - scale * 5);

        // показываем текст
        if (this._showText) {

            ctx.fillStyle = '#ffffff';
            ctx.font = scale * 23 + 'px CoreSansDS25Light';
            // ctx.fillText(text, _x + scale * 5, _y + _wy - scale * 5);
        }
        ctx.restore();
    }



    // -------------------------------------------------------
    // Метод | Вызывает метод рисования прямоугольника с нужными параметрами
    //
    draw() {

        this.drawCube(
        // window.requestAnimationFrame(() => this.drawCube(
            this._viewBox,
            this.dh.data.x,
            this.dh.data.y,
            // this.dh.data[position[this.dh.data['view']].x],
            // this.dh.data[position[this.dh.data['view']].y],
            this.dh.data[position[this.dh.data['view']].wx],
            this.dh.data[position[this.dh.data['view']].wy],
            this.dh.data['i' + position[this.dh.data['view']].wx],
            this.dh.data['i' + position[this.dh.data['view']].wy],
            this.dh.data.color,
            this.selected,
            this._ctx,
            this._scale,
            this.dh.data.code
        );
    }



    // -------------------------------------------------------
    // Метод | Обновляем элемент и все его содержимое
    //
    update() {
        console.group("class PlacePattern.update");

        if (this.dh.data) {

            // масштабируем элемент в размеры viewBox;
            this.autoScale();

            // очищаем элемент
            this.clear(true);

            // рисуем прямоугольник по размерам самого объекта
            this.draw();

            // обновляем внутренние элементы
            if (this.dh.data.depth > 0)
                this.updateItems(this.dh.data, dataSet, this.dh.data.depth);
        }
        console.log('this: %o', this);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Обновляет внутренние элементы
    //         Возвращает true, если внутренние элементы
    //         выходят за границы внутренних размеров контейнера
    //          data - элемент, внутренние элементы которого обновляем
    //          depth - глубина прорисовки кровней внутренних элементов
    //              0 - без внутренних элементов
    //              1 - один уровень внутренних элементов
    //              2 - два уровня внутренних элементов
    //          parentPosIndex - номер положения элемента data в родителе
    //
    updateItems(data, dataSet, depth, parentPosIndex = null) {
        console.group("class PlacePattern.updateItems");
        console.log('depth: %o', depth);

        let exceeded = false;   // флаг выхода внутренних элементов за внутренние размеры контейнера

        let parent = {};        // родительский объект куда будут вписаны внутренние элементы
        parent.id       = data.id;
        parent.posIndex = (parentPosIndex != null) ? parentPosIndex : data.view;
        parent.position = position[parent.posIndex];

        parent.iwx = data.iwx;          // внутренний размер родительского элемента
        parent.iwy = data.iwy;          // внутренний размер родительского элемента
        parent.iwz = data.iwz;          // внутренний размер родительского элемента
        parent.wx = data.wx;            // внещний размер родительского элемента
        parent.wy = data.wy;            // внещний размер родительского элемента
        parent.wz = data.wz;            // внещний размер родительского элемента

        this.rotateItem(parent.posIndex, parent);

        parent.x = data.x + (parent.wx - parent.iwx) / 2, // координата верхнего левого угла
        parent.y = data.y + (parent.wy - parent.iwy) / 2, // координата верхнего левого угла

        console.log('data: %o', data);
            
        let pos = {         // объект для хранения, вычисления и вращения координат
            x: 0, y: 0,                                             // координаты элемента ряда
            dx: 0, dy: 0,                                           // расстояния между элементами ряда
            rotation: {x: 'x', y: 'y'}                              // поворот координат
        };
        let rows = this.itemRows(data, dataSet, this.iTypeCount);

        // рисуем элементы рядов
        if (rows.length > 0) {
            
            // поворачиваем элементы рядов
            this.rowsRotate(data, rows, pos, parentPosIndex);

            // вычисляем суммарные габариты рядов
            // если элемент повернут, то суммарные габариты
            // вычисляются от размеров повернутых внутренних элементов
            exceeded = this.rowsDimensions(rows, pos, parent);

            // даем элементам рядов надписи 
            this.rowsSetItemsDisplayNames(rows, dataSet);

            // выводим на экранную форму элементы рядов
            this.rowsDisplay(rows, pos, dataSet, parent, depth);
        }

        // если элемент привязан к dataHendler
        // if (data.exceeded != undefined) {
            // выводим сообщение, если внутренние элементы вышли  за пределы размеров контейнера
            data.exceeded = exceeded ? 'Несоответствие размеров!' : '';
        // }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Поворачивает ряды
    //
    rowsRotate(data, rows, pos, parentPosIndex) {
        console.group("class PlacePattern.rowsRotate");

        rows.forEach( (row, rowIndex) => {   // row - ряд, rowIndex - индекс ряда от 0
                    
            // перебираем типы элементов в ряду 
            row.item.forEach( (item, i) => {   // item - i-ый тип в ряду, i - индекс типа в ряду
                
                // если второй уровень вложенности
                if (parentPosIndex != null) {
                    
                    // вращение размеров внутреннего элемеента
                    parent.toItemPos = {};    // соотношение размееров родителя и внутреннего элемента из dataSet[parent.id]
                    parent.toItemPos[ position[data.view].wx ] = position[ item.posIndex ].wx;
                    parent.toItemPos[ position[data.view].wy ] = position[ item.posIndex ].wy;
                    parent.toItemPos[ position[data.view].wz ] = position[ item.posIndex ].wz;
                    // console.log('parent - item: %o', parent.toItemPos);
                
                    this.rotateItem(parent.toItemPos, item);    // вращаем элемент в положение как он есть внутри родителя 

                    this.rotateItem(parentPosIndex, item);      // вращаем элемент в текущее положение родителя
                    // console.log('rotated item: %o', item);
                

                    // вращение координат x, y
                    pos.rotation[ position[data.view].x ] = position[ parentPosIndex ].x;
                    pos.rotation[ position[data.view].y ] = position[ parentPosIndex ].y;
                    pos.rotation[ position[data.view].z ] = position[ parentPosIndex ].z;
                    console.log('data.view: %o', data.view);
                    console.log('parentPosIndex: %o', parentPosIndex);
                    console.log('pos.rotation: %o', pos.rotation);

                // если первый уровень вложенности
                } else {
                    // поворачиваем внутренний элемент в соответствии с сохраненной позицией
                    this.rotateItem(item.posIndex, item);
                }
            });
        });
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Вычисляет суммарные габариты рядов
    //         если элемент повернут, то суммарные габариты 
    //         вычисляются от размеров повернутых внутренних элементов
    //
    rowsDimensions(rows, pos, parent) {
        console.group("class PlacePattern.rowsDimensions");

        let exceeded = false;                               // флаг выхода внутренних элементов за внутренние размеры контейнера

        let rowsWy = 0;                                     // суммарная высота всех рядов

        rows.forEach( (row, rowIndex) => {      // row - ряд, rowIndex - индекс ряда от 0

            let count  = 0;                                 // суммарное количество элементов ряда
            row.wx = 0;                                     // суммарная ширина элементов ряда
            let wy = [];                                    // высоты элементов ряда

            // перебираем типы элементов в ряду (их несколько толко когда есть флаг "в ряд")
            row.item.forEach( (item, i) => {    // item - i-ый тип в ряду, i - индекс типа в ряду

                count += item.count;
                row.wx += (item['w' + pos.rotation.x] * item.count);           // суммарная ширина ряда 
                wy.push(item['w' + pos.rotation.y]);
            });

            row.dx = (parent['iw' + pos.rotation.x] - row.wx) / (count + 1);   // расстояние между элементами ряда

            exceeded = exceeded || (row.dx <= 0);           // выход внутр. эл-ов за пределы размеров контейнера

            row.wy = Math.max.apply(null, wy);              // высота ряда по высоте самого высокого элемента

            rowsWy += row.wy;                               // суммарная высота всех рядов
        });

        pos.dy = (parent['iw' + pos.rotation.y] - rowsWy) / (rows.length + 1); // расстояние между рядами

        exceeded = exceeded || (pos.dy <= 0);               // выход внутр. эл-ов за пределы размеров контейнера
        
        console.groupEnd();
        return exceeded;
    }
    


    // -------------------------------------------------------
    // Метод | Задает надписи элементам рядов
    //
    rowsSetItemsDisplayNames(rows, dataSet) {
        console.group("class PlacePattern.rowsSetItemsDisplayNames");

        rows.forEach( (row, rowIndex) => {      // row - ряд, rowIndex - индекс ряда от 0
            row.item.forEach( (item, index) => {    // item - i-ый тип в ряду, i - индекс типа в ряду
                item.text = item.wx + 'x' + item.wy
            });

        });

        console.log('itemRows: %o', rows);
        console.groupEnd();
    }
    


    // -------------------------------------------------------
    // Метод | Выводит элементы рядов на экранную форму
    //
    rowsDisplay(rows, pos, dataSet, parent, depth) {
        console.group("class PlacePattern.rowsDisplay");
    
        pos[pos.rotation.y] = 0;                                          // координата "y" внутр. элементов ряда
        rows.forEach( (row, rowIndex) => {      // row - ряд, rowIndex - индекс ряда от 0

            pos[pos.rotation.x] = 0;                                      // координата "x" внутр. элемента
            pos[pos.rotation.y] += pos.dy;                                // координата "y" текущего ряда

            // перебираем типы элементов в ряду 
            row.item.forEach( (item, index) => {    // item - i-ый тип в ряду, i - индекс типа в ряду

                for(let i = 0; i < item.count; i++) {       // перебор элементов одного типа в ряду
                    
                    if (item.bycoordinates) {
                        pos[pos.rotation.x] = item.x;                         // координата "x" текущего элемента ряда
                        pos[pos.rotation.y] = item.y;                         // координата "y" текущего элемента ряда
                    } else {
                        pos[pos.rotation.x] += row.dx;                        // координата "x" текущего элемента ряда
                    }

                    this.drawCube(
                    // window.requestAnimationFrame(() => this.drawCube(
                        {x: parent.x, y: parent.y, wx: parent.iwx, wy: parent.iwy}, // прямоугольник, в который будут вписаны вн. элементы
                        pos.x,
                        pos.y,
                        item.wx,
                        item.wy,
                        item.iwx,
                        item.iwy,
                        dataSet[item.id].color,
                        this.selected,
                        this._ctx,
                        this._scale,
                        item.text
                    );

                    // рисуем внутренние элементы текущего внутреннего элемента
                    if (depth > 1) {

                        dataSet[item.id].x = parent.x + pos.x;
                        dataSet[item.id].y = parent.y + pos.y;
                        this.updateItems(dataSet[item.id], dataSet, depth - 1, item.posIndex);
                    }
                    pos[pos.rotation.x] += item['w' + pos.rotation.x];
                }                            
            });
            pos[pos.rotation.y] += row.wy;
        });        
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Поворачивает набор размеров в соответствии с
    //         переданным номером положения index
    //
    rotateItem(targetPosition, item1, item2) {
        // console.group("class PlacePattern.rotateItem");
        
        if ((typeof targetPosition == 'number') || (typeof targetPosition == 'string')) {
            if (item1) {
                let pos1 = {x: item1.x, y: item1.y, wx: item1.wx, wy: item1.wy, wz: item1.wz, iwx: item1.iwx, iwy: item1.iwy, iwz: item1.iwz};
                // item.x  =  pos[ position[targetPosition].x   ];
                // item.y  =  pos[ position[targetPosition].y   ];
                item1.wx =  pos1[ position[targetPosition].wx ];
                item1.wy =  pos1[ position[targetPosition].wy ];
                item1.wz =  pos1[ position[targetPosition].wz ];
                item1.iwx = pos1[ 'i' + position[targetPosition].wx ];
                item1.iwy = pos1[ 'i' + position[targetPosition].wy ];
                item1.iwz = pos1[ 'i' + position[targetPosition].wz ];
            }
            
            if (item2) {
                let pos2 = {x: item2.x, y: item2.y, wx: item2.wx, wy: item2.wy, wz: item2.wz, iwx: item2.iwx, iwy: item2.iwy, iwz: item2.iwz};
                // item.x  =  pos[ position[targetPosition].x   ];
                // item.y  =  pos[ position[targetPosition].y   ];
                item2.wx =  pos2[ position[targetPosition].wx ];
                item2.wy =  pos2[ position[targetPosition].wy ];
                item2.wz =  pos2[ position[targetPosition].wz ];
                item2.iwx = pos2[ 'i' + position[targetPosition].wx ];
                item2.iwy = pos2[ 'i' + position[targetPosition].wy ];
                item2.iwz = pos2[ 'i' + position[targetPosition].wz ];
            }
        }

        if (typeof targetPosition == 'object') {
            if (item1) {
                let pos1 = {x: item1.x, y: item1.y, wx: item1.wx, wy: item1.wy, wz: item1.wz, iwx: item1.iwx, iwy: item1.iwy, iwz: item1.iwz};
                // item.x  =  pos[ position[targetPosition].x   ];
                // item.y  =  pos[ position[targetPosition].y   ];
                item1.wx =  pos1[ targetPosition.wx ];
                item1.wy =  pos1[ targetPosition.wy ];
                item1.wz =  pos1[ targetPosition.wz ];
                item1.iwx = pos1[ 'i' + targetPosition.wx ];
                item1.iwy = pos1[ 'i' + targetPosition.wy ];
                item1.iwz = pos1[ 'i' + targetPosition.wz ];
            }
        }
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Возвращает true, если тип с таким индексом задан
    //
    itemTypeExists(data, index) {
        // console.group("class PlacePatternItem.itemExists");

        let x;
        let y;
        let id;
        let bycoordinates = data['bycoordinates' + index];                  // номер положения внутреннего элемента

        id = (data['sub' + index + '_id'] > 0);                         // идентификатор тпа внутр. элементов задан
        
        if (bycoordinates > 0) {
            x = (data['x' + index] >= 0);                               // координата по горизонтали задана
            y = (data['y' + index] >= 0);                               // координата по вертикали задана
        } else {
            x = (data['x' + index] > 0);                                // количество по горизонтали задано
            y = (data['y' + index] > 0);                                // количество по вертикали задано
        }

        // console.groupEnd();
        return id && x && y;
    }
    
    

    // -------------------------------------------------------
    // Метод | Формирует и возвращает массив рядов внутренних элементов
    //          data - элемент, содержащий внутренние элементы
    //          dataSet - массив всех элементов, загруженных из базы
    //          typeCount - количество типов внутренних элементов
    //
    itemRows(data, dataSet, typeCount) {
        console.group("class PlacePattern.itemRows");
    
        let iType = [];                                                 // массив типов внутренних элементов

        for(let index = 1; index <= typeCount; index++) {   // перебираем типы внутренних элементов

            // идентификатор тпа внутр. элементов
            let id = data['sub' + index + '_id'] ? data['sub' + index + '_id'] : null;

            let posIndex = data['position' + index];                    // номер положения внутреннего элемента

            // если тип внутренних элементов задан
            if (this.itemTypeExists(data, index)) {
                
                // то добавляем данный тип в массив iType
                iType[index] = {
                    id:             id,                                 // идентификатор типа внутреннего элемента
                    inrow:          data['inrow' + index],              // флаг объединения типов внутренних элементов в ряд
                    bycoordinates:  data['bycoordinates'],              // флаг что внутренние элементы заданы по координатам
                    posIndex:       posIndex,                           // номер варианта положения типов вн. элемента
                    position:       position[posIndex],                 // вариант положения типов вн. элемента
                    count:          0,                                  // количество элементов в ряду
                    x:              data['x' + index],                  // количество по горизонтали / координата "x"
                    y:              data['y' + index],                  // количество по вертикали / координата "y"
                    z:              0,                                  // координата "z"
                    wx:             dataSet[ id ].wx,                   // размер внутреннего элемента из БД
                    wy:             dataSet[ id ].wy,                   // размер внутреннего элемента из БД
                    wz:             dataSet[ id ].wz,                   // размер внутреннего элемента из БД
                    iwx:            dataSet[ id ].iwx,                  // размер внутреннего элемента из БД
                    iwy:            dataSet[ id ].iwy,                  // размер внутреннего элемента из БД
                    iwz:            dataSet[ id ].iwz                   // размер внутреннего элемента из БД
                };
            }
        }
        console.log('iType: %o', iType);


        // перебираем iType - массив типов внутрениих элементов и делаем массив рядов
        let rows = [];                                                      // массив рядов
        let prevInrow = false;                                              // предыдущий ряд был с флагом "в ряд"
        let rowIndex = -1;                                                  // индекс ряда от 0

        iType.forEach( item => {
            
            if (item.id > 0) {

                if (item.bycoordinates > 0) {           // если элемент задан по координантам

                    if (!rows[0]) rows[0] = {item: [], wx: 0, wy: 0};       // добаляем нулевой ряд, если его нет

                    let rowItem = Object.assign({}, item);                  // копируем свойства типа в новый объект

                    rowItem.count = 1;                                      // количество элементов ряда

                    rows[0].item.push(rowItem);                             // добавляем в ряд все свойства типа
                } else {                                // если елемент задан количеством по горизонтали и вертикали

                    for(let y = 1; y <= item.y; y++) {      // перебор количества по вертикали

                        rowIndex += (item.inrow > 0) ? (prevInrow ? 0 : 1) : 1; // увеличиваем индекс ряда, если предыдущий был не в ряд

                        // если предыдцщий элемент не в ряд и текущий не в ряд
                        if (!prevInrow || !(item.inrow > 0)) {
                            
                            rows[rowIndex] = {item: [], wx: 0, wy: 0};          // добаляем новый ряд
                        }

                        let rowItem = Object.assign({}, item);                  // копируем свойства типа в новый объект

                        rowItem.count = rowItem.x;                              // количество элементов ряда

                        rows[rowIndex].item.push(rowItem);                      // добавляем в ряд все свойства типа
                        
                        prevInrow = (item.inrow > 0);                           // запоминаем, был ли предыдущий ряд с флагом "в ряд"
                    }
                }
            }
        }, this);

        console.log('itemRows: %o', rows);
        console.groupEnd();
        return rows;
    }
}