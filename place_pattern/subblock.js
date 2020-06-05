"use strict";





// =======================================================
// Класс | SubBlock
//          Один блок это набор из нескольких строк однотипных элементов
//         имеет количество горизонтальных рядов rowCount       (вводит пользователь - inpNy)
//         и количество вертикальных столбцов colCount          (вводит пользователь - inpNx)
//         а так же тип всех его элементов packId               (вводит пользователь - packList)
//          Если блоку задать тип элементов, то он отобразит 
//         размеры данного типа в полях inpSizeWx, inpSizeWy
//
class SubBlock {


    // Создаем блок для настройки внутренних элементов
    constructor(index, subBlock) {
        // console.group("Class SubBlock.constructor");
        


        // -------------------------------------------------------
        // Свойства | 
        //
        this.dh = null;

        this._index = index;        // индекс данного блока в контейнере
        this._subPack = null;       // указатель на элемент - тип внутренних элементов

        this._label = subBlock.querySelector('#subLabel' + index);   // номер блока (для отображения на форме)
        this._packList = this.newPackList(subBlock.querySelector('#packList' + index));
        this._inpNx = subBlock.querySelector('#inpNx' + index);
        this._inpNy = subBlock.querySelector('#inpNy' + index);
        this._checkBox = subBlock.querySelector('#checkBoxInRow' + index);
        this._inpSizeWx = subBlock.querySelector('#inpSizeWx' + index);
        this._inpSizeWy = subBlock.querySelector('#inpSizeWy' + index);
        this._inpTotal = subBlock.querySelector('#inpTotal' + index);
        // this._inpPosition = subBlock.querySelector("#inpPosition" + index);
        this._btnTurn = subBlock.querySelector("#btnTurn" + index);
        
        this._label.innerText = (index + 1);

        // подключаем слоты к сигналам внутренних визуальных элементов
        this.connectSignals();


        // -------------------------------------------------------
        // Сигналы | 
        //
        
        // изменились размеры
        this.sizeChanged;

        // изменился тип внутренних элементов
        this.contentChanged;

        // console.log("this: %o", this);
        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | ссылка на выпадающий список
    //
    set packList(value) {
        this._packList = value;
    } 

    get packList() {
        return this._packList;
    }
    


    // -------------------------------------------------------
    // Метод | Подключение слотов к сигналам внутренних визуальных элементов
    //
    connectSignals() {
        // console.group("class SubBlock.connectSignals");
        // console.log("this: %o", this);

        this.packList.onItem0 = (id) => this.slotSubPackChanged(id);
        this.packList.onChange = (id) => this.slotSubPackChanged(id);
        this._btnTurn.addEventListener('click', event => this.slotTurnClicked(event));
        // this.inpNx.addEventListener('input', event => this.slotSizeChanged(event));
        // this.inpNy.addEventListener('input', event => this.slotSizeChanged(event));
        // this._checkBox.addEventListener('change', event => this.slotInRowChanged(event));

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Подключение слотов к сигналам внутренних визуальных элементов
    //
    disconnectSignals() {
        // console.group("class SubBlock.disconnectSignals {");
        // console.log("this: %o", this);

        this.packList.onItem0 = null;
        this.packList.onChange = null;
        this._btnTurn.removeEventListener('click', event => this.slotTurnClicked(event));
        // this.inpNx.removeEventListener('input', event => this.slotSizeChanged(event));
        // this.inpNy.removeEventListener('input', event => this.slotSizeChanged(event));
        // this._checkBox.removeEventListener('change', event => this.slotInRowChanged(event));

        // console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Создает выпадающий список для блока внутренних элементов
    //         для выбора типа элемента из базы данных
    //
    newPackList(ul) {
        console.group("class SubBlockContainer.newPackList");
        console.log("block index: %i", this._index);
        
        // выпадающий список
        var packList = new SearchList(ul);

        packList.item0 = 'Тип'

        packList.listFormat = listFormat;
        packList.selectedFormat = ['code'];

        console.groupEnd();
        return packList;
    }



    // -------------------------------------------------------
    // Слот | Если изменился id внутренних элементов
    //
    slotSubPackChanged(id) {
        console.group("class SubBlock.slotSubPackChanged");
        console.log("block: %o", this);

        // выводим размеры выбранного типа внутренних элементов
        this._inpSizeWx.value = id ? this._packList.dataSet[ id ]['wx'] : '';
        this._inpSizeWy.value = id ? this._packList.dataSet[ id ]['wy'] : '';

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Если изменился id внутренних элементов
    //
    slotTurnClicked(id) {
        console.group("class SubBlock.slotTurnClicked");
        
        // текущее значение position
        let positionIndex = this.dh.data['position' + (this._index + 1)];
        
        // вращаем position данного блока типа внутренних элементов по кругу от 0 до 5
        this.dh.data['position' + (this._index + 1)] = ((positionIndex + 1) < position.length) ? (positionIndex + 1) : 0;
        
        console.log("block: %o; position: %i", this, this.dh.data['position' + (this._index + 1)]);

        this.dh.changed = true;

        console.groupEnd();
    }
}





// =======================================================
// Класс | SubBlockContainer
//          Контейнер блоков
//         Одномерный массив элементов типа SubBlock
//
class SubBlockContainer {


    // Создаем контейнер
    constructor(templateId) {
        console.group("Class SubBlockContainer.constructor");

        this._subBlockTamplate = document.getElementById(templateId);    // темплейт блока внутренних элементов

        this._count = 0;
        this.item = [];

        this._inpTotal = document.querySelector('#inpTotal');


        // -------------------------------------------------------
        // Создаем блоки для редактирования внутренних элементов
        //
        for(var index = 0; index < 9; index++) {
                
            // добавляем блок внутренних элементов
            this.add(index, this._subBlockTamplate);
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Свойство | количество блоков типов внутренних элементов
    //
    get count() {
        return this._count;
    }



    // -------------------------------------------------------
    // Метод | Очищаем все данные блоков
    //
    connectSignals() {
        console.group("class SubBlockContainer.connectSignals");

        this.item.forEach ( item => {

            item.connectSignals();
        });
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод | Очищаем все данные блоков
    //
    disconnectSignals() {
        console.group("class SubBlockContainer.disconnectSignals");

        this.item.forEach ( item => {

            item.disconnectSignals();
        });
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Метод |  Добавляем новй блок в позицию index
    //
    add(index, subBlockTamplate) {
        console.group("class SubBlockContainer.add");
        console.log("subBlockTamplate: %o", subBlockTamplate);
        console.log("index: %i", index);

        if (subBlockTamplate) {
            
            // массив имен всех внутренних элементовбез суфиксов
            var subBlockElementIds = [
                'subLabel',
                'checkBoxInRow',
                'inpSizeWx',
                'inpSizeWy',
                'packList',
                'inpNy',
                'inpNx',
                'inpTotal',
                // 'inpPosition',
                'btnTurn'
            ];

            // получаем контейнер темплейта
            var subBlockContainer = subBlockTamplate.parentNode;
                        
            // копированием из темплейта создаем очередной блок внутренних элементов
            var newSubBlock = subBlockTamplate.cloneNode(true);

            // даем id новому блоку
            newSubBlock.id = 'subBlock' + (index);
                    
            // перебираем все варианты имеен элементов в новом блоке
            subBlockElementIds.forEach(elementId => {
                
                // получаем очередной элемент блока
                var subBlockElement = newSubBlock.querySelector('#' + elementId + '_');
                
                // даем id и name элементу блока 
                subBlockElement.id = elementId + index;
            });

            // добавляеем созданный блок в конейнер
            subBlockContainer.appendChild(newSubBlock);

            // показываем блок внутренних элементов
            newSubBlock.classList.remove('hidden');

            var item = new SubBlock(index, newSubBlock);
            
            // подписываемся на сигналы блока
            // item.sizeChanged = () => this.onItemSizeChanged();
            // item.contentChanged = () => this.onItemContentChanged();
            
            this.item.push(item);
            
            // увеличиваем количество блоков
            this._count++;
        }
        console.groupEnd();
    }
}