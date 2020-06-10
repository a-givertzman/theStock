"use strict";
// import * as generic from '../libJS/generic'
import 
import {btn, messageBox} from '../dialog/dialog'
import {HtmlDom} from '../libJS/html_utils'
import {copyData, requestToServer, loadData, saveData, DataHendler} from '../libJS/data_handler'
import {position, normalView} from '../place_pattern/settings'
import {SearchList} from '../searchList/searchList'
import {PlacePattern, dataSet, dataModel, saveDataModel} from '../place_pattern/place_pattern'
import {SubBlockContainer} from '../place_pattern/subblock'
import {createStore, applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {rootReducer} from '../redux/rootReducer'
import {initialState} from '../redux/initialState'
import {codeChanged} from '../redux/actions'





// ***********************************************************************
// **                                                                   **
// **                             M A I N                               **
// **                                                                   **
// ***********************************************************************



// -------------------------------------------------------
// КОНСТАНТЫ |
//


// формат выпадающего списка
const listFormat = ['code', '|', 'name', '|', 'wx', 'х', 'wy', 'х', 'wz', '|', 'iwx', 'х', 'iwy', 'х', 'iwz', '|', '(Внут item_count шт)']

// формат вывода выбранного элемента выпадающего списка
const selectedFormat = ['code', ' | ', 'name']


// redux/store всего приожения
const store = createStore(
    rootReducer, 
    initialState, 
    applyMiddleware(thunk)
)


// -------------------------------------------------------
// ГЛОБАЛЬНЫЕ ФУНКЦИИ |
//

// -------------------------------------------------------
// Слот | Страница полностью загружена
//
window.addEventListener("load", () => {

    console.group("index.php loaded");


    // -------------------------------------------------------
    // Функция | Выводит статусное сообщение в элемент lblStatus
    //           и убирает его через время timeout в миллисекундах
    //           если timeout=0 то сообщение будет видимым пока
    //           его не перекроет текст нового сообщения
    //
    function setStatus(statusText, showTimeout, clearTimeout) {
        console.group("main.setStatus { text: %o", statusText);

        // показываем статус с задержкой showTimeout в миллисекундах
        setTimeout(() => {
            lblStatus.value = statusText;
        }, showTimeout);

        // если timeout больше 0
        if (clearTimeout > 0) {

            // стираем выведенное сообщение через время timeout в миллисекундах
            setTimeout(() => {
                lblStatus.value = "";
            }, clearTimeout);
        }

        console.groupEnd("main.setStatus }");
    }


    // -------------------------------------------------------
    // ЭЛЕМЕНТЫ DOM | Объявляем константы связи с элементами страницы и/или формы
    //

    var htmlDom = new HtmlDom();

    const selectPanel = htmlDom.element("#selectPanel");
    const editPanel = htmlDom.element("#editPanel");
    const inpCode = htmlDom.element("#inpCode");
    const inpName = htmlDom.element("#inpName");
    const inpPayload = htmlDom.element("#inpPayload");
    const inpSizeWx = htmlDom.element("#inpSizeWx");
    const inpSizeWy = htmlDom.element("#inpSizeWy");
    const inpSizeWz = htmlDom.element("#inpSizeWz");
    const inpInternalSizeWx = htmlDom.element("#inpInternalSizeWx");
    const inpInternalSizeWy = htmlDom.element("#inpInternalSizeWy");
    const inpInternalSizeWz = htmlDom.element("#inpInternalSizeWz");
    const inpColor = htmlDom.element("#inpColor");
    const inpVolume = htmlDom.element("#inpVolume");
    const inpVolumeUnit = htmlDom.element("#inpVolumeUnit");
    const inpView = htmlDom.element("#inpView");
    const checkBoxHasContent = htmlDom.element("#checkBoxHasContent");
    const checkBoxByCoordinares = htmlDom.element("#checkBoxByCoordinares");
    const btnEdit = htmlDom.element("#btnEdit");
    const btnBack = htmlDom.element("#btnBack");
    const btnCopy = htmlDom.element("#btnCopy");
    const btnTurn = htmlDom.element("#btnTurn");
    const btnApply = htmlDom.element("#btnApply");
    const lblStatus = htmlDom.element("#lblStatus");
    const lblStatusEdit = htmlDom.element("#lblStatusEdit");
    const lblStatusChanged = htmlDom.element("#lblStatusChanged");
    const lblStatusInfo = htmlDom.element("#lblStatusInfo");
    // получаем и сохраняем указатель на <canvas> где будет вся графика
    var canvas = htmlDom.element("#canvas");



    // -------------------------------------------------------
    // ИНИЦИАЛИЗАЦИЯ |
    //

    var settings;
    var selectedItem;                                                               // ссылка на текущий выбранный элемент
    var dataHendler;                                                                // обработчик обмена данными с экранной формой
    const subItemTypeCount = 9;                                                     // количество типов внутренних элементов
    var editMode = false;                                                           // флагн режима редактирования

    // настройки отображения, по умолчанию normalView
    settings = normalView;

    // Настраиваем размер и разрешение <canvas>
    canvas.style.width = settings.canvasWx + 'px';
    canvas.style.height = settings.canvasWy + 'px';
    canvas.width = settings.canvasWx * 2;
    canvas.height = settings.canvasWy * 2;

    // Делает все инпуты недоступными для редактирования
    htmlDom.setEnabled('.disabled, .mainInput, .subInput, .archeTypeSelectInput, #btnTurn, #btnApply, #btnCopy, #btnEdit');


    // выпадающий список для выбора текущего элемента из базы данных
    var packList = new SearchList(htmlDom.element("#packList"));
    packList.item0 = 'Новый';
    packList.listFormat = listFormat;
    packList.selectedFormat = selectedFormat;

    // если в списке выбран нулевой пункт, то создаем новый элемент
    packList.onItem0 = (event) => newItem(event);

    // если в списке выбран не нулевой пункт
    packList.onChange = (id) => setSelectedItem(id);


    // выпадающий список для выбора прототипа текущего элемента из базы данных
    var patternPackList = new SearchList(htmlDom.element("#patternPackList"));
    patternPackList.item0 = 'Тип';
    patternPackList.listFormat = listFormat;
    patternPackList.selectedFormat = selectedFormat;

    // если в списке выбран нулевой пункт, то создаем новый элемент
    // patternPackList.onItem0 = (event) => packNew(event);

    // если в списке базовых элеменотов выбран не нулевой
    patternPackList.onItem0 = (id) => setArchetypeId(id);
    patternPackList.onChange = (id) => setArchetypeId(id);


    // Блоки редактирования внутренних элементов,
    // структура хранящая количество блоков в count
    // и блоки в item с количеством горизонтальных рядов
    // и количеством элементов в каждом ряде
    var subBlock = new SubBlockContainer('subBlock_');


    // загружаем данные из БД в массив dataSet
    var url = '../src/place_pattern/getPlacePattern.php';
    loadData(url, {searchQuery: '%'}, dataSet, dataModel,
        function() {
            packList.dataSet = dataSet;
            patternPackList.dataSet = dataSet;
            subBlock.item.forEach( (item, index) => {
                item.dh = dataHendler;
                item.packList.dataSet = dataSet;
                dataHendler.setDataBind(item.packList, 'sub' + (index + 1)+ '_id', 'list', 'change');
                dataHendler.setDataBind('#' + item._inpNx.id, 'x' + (index + 1), 'int', 'input');
                dataHendler.setDataBind('#' + item._inpNy.id, 'y' + (index + 1), 'int', 'input');
                dataHendler.setDataBind('#' + item._checkBox.id, 'inrow' + (index + 1), 'bool', 'change');
                dataHendler.setDataBind('', 'position' + (index + 1), 'int', '');
            });
            console.log('dataSet: %o', dataSet)
        },
        function() {},
    )


    // создаем dataHendler
    dataHendler = new DataHendler(dataModel);

    // добавляем связи в dataHendler
    dataHendler.setDataBind(patternPackList, 'archetype_id', 'list', 'cange');
    // dataHendler.setDataBind('#inpCode', 'code', 'text', 'input');
    dataHendler.setDataBind('#inpName', 'name', 'text', 'input');
    dataHendler.setDataBind('#inpPayload', 'payload', 'int', 'input');
    dataHendler.setDataBind('#inpSizeWx', 'wx', 'int', 'input');
    dataHendler.setDataBind('#inpSizeWy', 'wy', 'int', 'input');
    dataHendler.setDataBind('#inpSizeWz', 'wz', 'int', 'input');
    dataHendler.setDataBind('#inpInternalSizeWx', 'iwx', 'int', 'input');
    dataHendler.setDataBind('#inpInternalSizeWy', 'iwy', 'int', 'input');
    dataHendler.setDataBind('#inpInternalSizeWz', 'iwz', 'int', 'input');
    dataHendler.setDataBind('#inpColor', 'color', 'color', 'input');
    dataHendler.setDataBind('', 'view', 'int', '');
    dataHendler.setDataBind('#checkBoxByCoordinares', 'bycoordinates', 'bool', 'change');
    dataHendler.setDataBind('#lblStatusChanged', 'changed', 'text', '');
    dataHendler.setDataBind('#lblStatusInfo', 'exceeded', 'text', '');

    inpCode.addEventListener('input', () => {
        store.dispatch(codeChanged())
    })

    store.subscribe()

    store.dispatch({type: INIT_APPLICATION})

    // создаем placePattern
    // Это обработчик выбранного элемента
    selectedItem = new PlacePattern(canvas, dataHendler);
    selectedItem.iTypeCount = subItemTypeCount;
    selectedItem.showText = true;



    // -------------------------------------------------------
    // Функция | Создание нового элемента
    //
    function newItem(id) {
        console.group('main.packNew');

        selectedItem.createNew();                                                   // создаем новый элемент

        setEditMode(true);                                                          // включаем режим редактирования

        inpCode.focus();

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | Копирует элемент pack и добавляет копию в конец массива packs
    //           Добавляет его в список <select>
    //           Отображает скопированный элемент
    //           И включает режим редактирования
    //
    function packCopy() {
        console.group('packCopy');

        selectedItem.createNew(selectedItem.dh.data);                               // создаем новый элемент

        selectedItem.dh.data.code += ' copy'                                        // меняем обозначение скопированного элемента
        
        setEditMode(true);                                                          // включаем режим редактирования

        inpCode.focus();

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | Сохраняет элемент pack в базу данных
    //           если объект новый то выполняет INSERT
    //           Затем добавляет новый элемент в массив packs и в список <select>
    //           иначе оновляет объект в базе
    //
    function packSave(pack) {
        console.group('main.packSave');
        console.log('pack: %o', pack);

        setStatus('Сохранение данных', 0, 3000);

        // если выделенный элемент существует
        let exists = dataSet.find( function(item) {
            return item ? (item.code == selectedItem.dh.data.code) : false;
        });

        if (!exists || !selectedItem.new) {

            htmlDom.setEnabled('#btnApply, #btnBack', false);

            // сохраняем его в базу данных
            saveData(selectedItem.dh.data, dataSet, saveDataModel,

                // если успешно
                function(result) {

                    console.log('pack: %o', pack);

                    if (!(parseInt(result.errCount) > 0)) {

                        if (selectedItem.new && result.data && (parseInt(result.data.id) > 0)) {

                            selectedItem.new = false;

                            selectedItem.dh.data.id = String(result.data.id);           // присваиваем новый id после сохранения

                            dataSet[result.data.id] = selectedItem.dh.data;             // добавляем новый элемент в набор dataSet

                            packList.selectedId = result.data.id;
                            setSelectedItem(result.data.id)
                        }
                        // показываем сообщение в statusbar
                        setStatus('Сохранено', 300, 5000);
                        selectedItem.dh.changed = false;
                    } else {
                        setStatus('Ошибка', 300, 5000);
                    }
                    htmlDom.setEnabled('#btnApply, #btnBack', true);
                },

                // если сервер вернулошибку
                function(XMLHttpRequest, textStatus) {

                    setStatus('Ошибка', 300, 5000);
                    htmlDom.setEnabled('#btnApply, #btnBack', true);
                }
            );
        } else {
            alert('Элемент с таким обозначением уже существует.');
            htmlDom.setEnabled('#btnApply, #btnBack', true);
        }
        console.groupEnd();
    }




    // -------------------------------------------------------
    // СИГНАЛЫ | Привязываем события
    //


    // Привязываем события
    btnEdit.addEventListener('click', eventBtnEditClicked);
    btnBack.addEventListener('click', eventBtnBackClicked);
    btnTurn.addEventListener('click', eventbtnTurnClicked);
    btnCopy.addEventListener('click', eventBtnCopyClicked);
    btnApply.addEventListener('click', eventBtnSaveClicked);
    checkBoxHasContent.addEventListener('change', eventCheckBoxHasContentChanged);
    checkBoxByCoordinares.addEventListener('change', checkBoxByCoordinaresChanged);

    // Привязываем события клика на элементе
    canvas.addEventListener("click", eventClick);



    // -------------------------------------------------------
    // Слот | Масштабирование элемента на canvas
    //
    canvas.addEventListener('wheel', function(evt) {
        return false;
        console.group('canvas.addEventListener wheel {');

        evt.preventDefault();

        var mousePos = getMousePos(canvas, evt);

        // получаем выделленый элемент
        var pack = selectedItem;

        // если выделенный элемент есть
        if (pack) {

            var scale = pack.scale;

            // то меняем выбранному элементу масштам
            if (evt.deltaY < 0) {
                console.log('canvas zoom out: ' + evt.deltaY);
                scale = scale * 1.05;
            }
            if (evt.deltaY > 0) {
                console.log('canvas zoom in: ' + evt.deltaY);
                scale = scale * 0.95;
            }
            pack.scale = scale;
        }

        // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        // lblStatusInfo.innerText = message;

        console.groupEnd('canvas.addEventListener wheel }');
    }, false);



    // -------------------------------------------------------
    // СЛОТЫ | Обработка событий
    //


    // -------------------------------------------------------
    // Слот | Перемещение мыши
    //        Вывод сообщения о текущей позиции курсора мыши
    //
    canvas.addEventListener('mousemove', function(evt) {
        return false;
        // console.group('eventMouseMove { ');

        var pos = getMousePos(canvas, evt);

        // получаем выделленый элемент
        var pack = selectedItem;

        // если выбранный элемент существует
        if (pack) {

            // var message = 'Mouse pos: ' + pos.x + ',' + pos.y + ' | Scaled pos: ' + pos.x * selectedItem.scale + ',' + pos.y * selectedItem.scale;
            // lblStatusInfo.innerText = message;

            // то передаем элементу координаты курсора
            // console.log('item mouse move: %o', pack);
            // var pos = getMousePos(canvas, evt)
            var mouseOver = pack.onMouseOver(pos.x, pos.y);
            if (mouseOver) {canvas.style.cursor = 'pointer'} else {canvas.style.cursor = 'auto'}
        }
        // console.groupEnd();
    }, false);



    // -------------------------------------------------------
    // Слот | Привязываем события клика на элементе
    //
    function eventClick(evt) {
        console.group('eventClick');

        // получаем выделленый элемент
        var pack = selectedItem;

        // если выделенный элемент есть
        if (pack) {

            // меняем глубину отображения
            pack.dh.data.depth = (pack.dh.data.depth == 2) ? 0 : pack.dh.data.depth + 1;
            console.log('selectedItem: %o', pack);

            setStatus("Вложенных уровней: " + pack.dh.data.depth, 0, 5000);

            // то передаем клик элементу
            // console.log('item mouse down: %o', pack);
            // var pos = getMousePos(canvas, evt)
            // var selected = pack.onClick(pos.x, pos.y);

            pack.update();
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | - Переключает форму и все необходимые элементы
    //           в режим редактирования и обратно
    //           - Сохраняем эелемент если он был изменен
    //
    function setEditMode(value) {
        console.group('main.setEditMode');
        console.log('selectedItem: %o', selectedItem);

        editMode = value;

        if (selectedItem.dh.data) {
            console.log('set editMode to: %o', editMode);

            if (editMode) {
                // включаем режим редактирования [ РЕДАКТИРОВАТЬ ]

                editPanel.classList.remove('hidden');                       // показываем поле для воода типа

                selectPanel.classList.add('hidden');                        // прячем список для выбора типа

                lblStatusEdit.value = 'Редактирование';

            } else {
                // отключаем режим редактирования [ НАЗАД ]

                // console.log('selectedItem.dh.data.changed: %o', selectedItem.dh.changed);
                // если элемент был изменен
                if (selectedItem.dh.changed) {

                    // Предлагаем пользователю сохранить изменения
                    var reply = messageBox('Тип "' + selectedItem.code + '" был изменен, хотите сохранить?');

                    // Если пользователь хочет сохранить изменения
                    if (reply == btn.Yes) {

                        console.log('выполнить: Сохранение элемента');

                        packSave(selectedItem);                             // сохраняем элемент в БД
                    } else {

                        // возвращаемся к ранее выбранному элементу
                        if (packList.prevouseId == 0) {

                            selectedItem.dh.changed = false;
                            packList.selectedId = null;
                        } else {

                            setSelectedItem(packList.prevouseId);
                            packList.selectedId = packList.prevouseId;
                        }
                    }
                }
                editPanel.classList.add('hidden');                          // прячем поле для воода типа

                selectPanel.classList.remove('hidden');                     // показываем список для выбора типа

                lblStatusEdit.value = '';
            }
            // делаем инпуты доступными / блокируем
            htmlDom.setEnabled('#btnApply', editMode);
            htmlDom.setEnabled('#btnTurn', editMode);
            htmlDom.setEnabled('#btnCopy', !editMode);
            htmlDom.setEnabled('.mainInput', editMode && !(selectedItem.dh.data.archetype_id > 0));
            htmlDom.setEnabled('#inpCode, #inpName', editMode);
            htmlDom.setEnabled('#inpColor, #checkBoxHasContent', editMode);
            htmlDom.setEnabled('.archeTypeSelectInput', editMode);
            htmlDom.setEnabled('.subInput', editMode && checkBoxHasContent.checked);
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Обработка события нажатия кнопки "Редактировать"
    //
    function eventBtnEditClicked() {
        console.group('eventBtnEditClicked');

        // переходим в режим редактирования
        setEditMode(true);

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Обработка события нажатия кнопки "Назад"
    //
    function eventBtnBackClicked() {
        console.group('eventBtnBackClicked');

        // выходим из режима 'редактирования
        setEditMode(false);

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Обработка события нажатия кнопки "Повернуть отображение по оси X"
    //
    function eventbtnTurnClicked() {
        console.group('eventbtnTurnClicked');

        // текущее значение view
        let viewIndex = selectedItem.dh.data['view'];

        // вращаем view выбранного элемента по кругу от 0 до 5
        selectedItem.dh.data['view'] = ((viewIndex + 1) < position.length) ? (viewIndex + 1) : 0;

        console.log("view: %i", selectedItem.dh.data['view']);

        selectedItem.dh.changed = true;

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Обработка события нажатия кнопки SAVE
    //
    function eventBtnSaveClicked() {
        console.group('eventBtnSaveClicked');

        packSave(selectedItem);                                                     // сохраняем выбранный элемент

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Обработка событие нажатия кнопки "КОПИРОВАТЬ"
    //
    function eventBtnCopyClicked() {
        console.group('main.eventBtnCopyClicked {');

        packCopy();                                                                 // копируем выбранный элемент

        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | Вычисляет объем элемента
    //
    // function packVolume(pack) {
    //     console.group('main.packVolume {');

    //     var volume = pack.iwx * pack.iwy * pack.iwz;
    //     var volumeString = "";
    //     if (volume > 9999999) {
    //         volume = volume / 1000000000;      // переводим в кубические метры
    //         volumeString = volume + ' м' + '3'.sup();
    //     } else if ((volume > 9999) && (volume <= 9999999)) {
    //         volume = volume / 1000;        // переводим в кубические сантиметры
    //         volumeString = volume + ' см' + '3'.sup();
    //     } else {
    //         volumeString = volume + ' мм' + '3'.sup();
    //     }
    //     console.groupEnd();
    //     return volumeString;
    // }



    // -------------------------------------------------------
    // Слот | Событие изменение checkbox "объект имеет содержимое"
    //
    function eventCheckBoxHasContentChanged(e) {
        console.group('main.eventCheckBoxHasContentChanged');

        // если установлена галка Внутренние элементы
        if (e.target.checked) {

            htmlDom.setEnabled('.subInput', true);                               // делаем поля внутренних элементов доступными
        } else {

            htmlDom.setEnabled('.subInput', false);                              // блокируем делаем инпуты
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Изменение текстов полей ввода количества по горизонтали
    //        и вертикали или ввода координат
    //
    function byCoordinaresInputsDisplayText(byCoordinares) {
        console.group('main.checkBoxByCoordinaresChanged');

        let itemsX = document.getElementsByClassName('subInputLabelX');
        let itemsY = document.getElementsByClassName('subInputLabelY');

        // если установлена галка по координатам
        if (byCoordinares) {

            // меняем тексты полей внутренних элементов
            for (let i  = 0; i < itemsX.length; i++) {
                itemsX[i].innerHTML = "Координата<br>X";
                itemsY[i].innerHTML = "Координата<br>Y";
            }
        } else {

            // меняем тексты полей внутренних элементов
            for (let i  = 0; i < itemsX.length; i++) {
                itemsX[i].innerHTML = "Количество<br>по горизонтали";
                itemsY[i].innerHTML = "Количество<br>по вертикали";
            }
        }
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Слот | Событие изменение checkbox "по координатам"
    //
    function checkBoxByCoordinaresChanged(e) {
        console.group('main.checkBoxByCoordinaresChanged');

        byCoordinaresInputsDisplayText(e.target.checked);
        
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | Изменение выбранного элемента
    //           если в списке выбран новый
    //           то создает новый pack
    //           и переключает в режим редактирования
    //
    function setSelectedItem(id) {
        console.group('main.setSelectedItem');
        console.log('id: %o', id);

        selectedItem.id = id;

        let hasContent = (parseInt(selectedItem.dh.data.sub1_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub2_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub3_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub4_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub5_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub6_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub7_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub8_id, 10) > 0)
            || (parseInt(selectedItem.dh.data.sub9_id, 10) > 0);

        checkBoxHasContent.checked = hasContent ? true : false;

        byCoordinaresInputsDisplayText(checkBoxByCoordinares.checked);

        htmlDom.setEnabled('#btnCopy, #btnEdit', true);

        // console.log('pack = %o', selectedItem);
        console.groupEnd();
    }



    // -------------------------------------------------------
    // Функция | Изменение прототипа выбранного элемента
    //           Если в списке выбран нулевой (id = 0)
    //           то создается базовый элемент и можно задать размеры
    //           Если выбран ненулевой элемент, то выбранному
    //           элементу dataHendker сообщает id его прототипа
    //           и обновляем выбранный элемент
    //
    function setArchetypeId(id) {
        console.group('main.setArchetypeId');
        console.log('id: %o', id);

        if (id > 0) {
            selectedItem.archetype_id = id;
        }

        htmlDom.setEnabled('.mainInput', editMode && !(id > 0));
        htmlDom.setEnabled('#inpCode, #inpName, #inpColor, #checkBoxHasContent', editMode);

        console.groupEnd();
    }
});