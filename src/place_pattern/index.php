<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="../src/img/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="../src/css/style.css" />
    <link rel="stylesheet" type="text/css" href="../src/place_pattern/css/style.css" />
    <!-- icons -->
    <svg style="display:none;">
        <defs>
            <symbol id="down" viewBox="0 0 16 16">
                <polygon points="3.81 4.38 8 8.57 12.19 4.38 13.71 5.91 8 11.62 2.29 5.91 3.81 4.38" />
            </symbol>
            <symbol id="users" viewBox="0 0 16 16">
                <path
                    d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM8,15a7,7,0,0,1-5.19-2.32,2.71,2.71,0,0,1,1.7-1,13.11,13.11,0,0,0,1.29-.28,2.32,2.32,0,0,0,.94-.34,1.17,1.17,0,0,0-.27-.7h0A3.61,3.61,0,0,1,5.15,7.49,3.18,3.18,0,0,1,8,4.07a3.18,3.18,0,0,1,2.86,3.42,3.6,3.6,0,0,1-1.32,2.88h0a1.13,1.13,0,0,0-.27.69,2.68,2.68,0,0,0,.93.31,10.81,10.81,0,0,0,1.28.23,2.63,2.63,0,0,1,1.78,1A7,7,0,0,1,8,15Z" />
            </symbol>
            <symbol id="x-but" viewBox="0 0 24 24">
                <path
                    d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"
                    stroke="black" stroke-width="1" stroke-dasharray="0" />
            </symbol>
            <symbol id="user-out" viewBox="0 0 224 260">
                <path id="arrow.svg" data-parent="" class="arrow" fill-rule="evenodd" d="M104.56 53.65H85.21l58.17 58.48H0v13h143.38L85.21 183.6h19.35l64.84-64.97-64.84-64.98z" data-name="arrow.svg"/>
                <path id="door.svg" class="door" d="M49.24 0v83.96h12.44V13h149.34v234H61.68v-92.62H49.24V260H224V0H49.24z" data-name="door.svg"/>
            </symbol> 
        </defs>
    </svg>  
    <title> Прототипы </title>
</head>

<body class="">

<!-- корневой контейнер формы -->
    <div class="gridContainer">
        <div class="local-grid">
            <header class="header-top">
                <!-- TOP - Панель с заголовком -->
                <div class=""> </div>
            </header>

            <!--  Sub-TOP - панель выбора элемента - FIRST VAR -->
            <section class="section__search " id="selectPanel">

                <div class="wide-100">
                <label class="" for="packList"> Тип </label>
                    <div class="dropdown input-flex">
                        <input class="input-flex" type="text" placeholder="Поиск..">
                        <ul id="packList" class="dropdown-content hidden" tabindex="0">
                        </ul>
                        <button class="dropbtn">
                            <svg width="16px" height="16px" aria-hidden="true"><use xlink:href="#down"></use>
                            </svg>
                        </button>
                    </div>

                    <div>
                        <button class="" id="btnEdit"> Редактировать </button>
                    </div>
                </div>
            </section>
            <!-- END FIRST VAR  -->

            <!-- Sub-TOP - панель редактирования элемента - SECOND VAR -->
            <section class="section__search hidden" id="editPanel">
                <div class="wide-100">

                        <label class="" for="inpCode"> Обозначение </label>
                        <input class="mainInput" size="4" type="text" id="inpCode" name="package_code">

                    <div class="input-flex">
                        <label class="" for="inpName"> Наименование </label>
                        <input class="mainInput" type="text" id="inpName" name="package_name">
                    </div>

                    <div>
                        <button class="" id="btnBack"> Назад </button>
                    </div>
                </div>
            </section>
            <!-- END SECOND VAR -->


            <!-- Информация об упаковке -->
            <!-- Изображение и характеристики -->
            <!-- Центральная главная область с двумя блоками: Left и Right -->

            <main role="main">

                <!-- Left item -->

                <input type="hidden" name="package_id">
                <div class="item-1">
                    <div class="canvas-wrap">

                        <!-- Изображение -->
                        <canvas class="" id="canvas">
                            success: {
                            }
                            error: Browser does not support canvas element.
                        </canvas>
                    </div>
                </div>
                <!-- характеристики -->
                <!-- Right item -->
                <div class="item-2">
                    <!-- кнопки -->
                    <section class="right-block__buttons">
                        <button class="button-right" id="btnTurn"> Повернуть отображение </button>
                        <button class="button-right" id="btnCopy"> Копировать </button>
                        <!-- <button class="" id="btnDelete"> Удалить </button> -->
                        <!-- <button class="" id="btnAdd"> Добавить </button> -->
                        <button class="button-right" id="btnApply"> Сохранить </button>
                    </section>

                    <section class="section-general">

                        <!-- Выбор Базового Типа -->
                        <!-- Выпадающий список элементов -->
                        <div class="wide-100">
                            <!-- Поисковая строка с выпадающим списком -->
                            <label class="" for="patternPackList"> Базовый </label>
                            <div class="dropdown input-flex">
                                <input class="archeTypeSelectInput" type="text" placeholder="Поиск..">
                                <ul id="patternPackList" class="dropdown-content drop-right hidden" tabindex="0">
                                </ul>
                                <button class="archeTypeSelectInput dropbtn"><svg width="16px" height="16px"
                                        aria-hidden="true">
                                        <use xlink:href="#down"></use>
                                    </svg></button>
                            </div>
                            <!-- END Выпадающий список элементов -->
                        </div>

                        <div class="title">Наружные размеры</div>
                        <!-- Flex 3х1 для отображения inputs для ввода Размеров прямоугольника -->
                        <div class="section-general__flex">
                            <div class="">
                                <label class="" for="inpSizeWx"> Ширина </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpSizeWx" name="package_wx"
                                    pattern=“[0-9]+” required>
                                <label class="" for="sizeWx"> мм </label>
                            </div>

                            <div class="">
                                <label class="" for="inpSizeWy"> Высота </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpSizeWy" name="package_wy"
                                    pattern=“[0-9]+” required>
                                <label class="" for="sizeWy"> мм </label>
                            </div>

                            <div class="">
                                <label class="" for="inpSizeWz"> Глубина </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpSizeWz" name="package_wz"
                                    pattern=“[0-9]+” required>
                                <label class="" for="inpSizeWz"> мм </label>
                            </div>
                        </div>

                        <div class="title">Внутренние размеры</div>

                        <div class="section-general__flex">
                            <div class="">
                                <label class="" for="inpInternalSizeWx"> Ширина </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpInternalSizeWx"
                                    name="package_iwx" pattern=“[0-9]+” required>
                                <label class="" for="sizeWx"> мм </label>
                            </div>

                            <div class="">
                                <label class="" for="inpInternalSizeWy"> Высота </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpInternalSizeWy"
                                    name="package_iwy" pattern=“[0-9]+” required>
                                <label class="" for="sizeWy"> мм </label>
                            </div>

                            <div class="">
                                <label class="" for="inpInternalSizeWz"> Глубина </label>
                                <input class="h-11 mainInput" size="5" type="text" id="inpInternalSizeWz"
                                    name="package_iwz" pattern=“[0-9]+” required>
                                <label class="" for="inpInternalSizeWz"> мм </label>
                            </div>
                        </div>

                        <div class="section-general__flex">
                            <div class="">
                                <label class="left" for="color"> Цвет: </label>
                                <input class="mainInput" type="color" id="inpColor" name="package_color">
                            </div>

                            <div class="">
                                <label class="hidden" for="inpPayload"> Грузоподьемность, гр </label>
                                <input class="hidden mainInput" size="6" type="text" id="inpPayload"
                                    name="package_payload">
                            </div>

                            <div class="">
                                <label class="" for="inpVolume"> Объем = </label>
                                <label class="" type="text" id="inpVolume" name="package_value"> 0 </label>
                                <label class="" for="inpVolume" id="inpVolumeUnit"> </label>
                            </div>
                        </div>


                    </section>
                    <section class="section-subs">
                        <!-- элемент имеет внутреннее содержимое -->
                        <header class="header__sub">
                            <div class="">
                                <div class="inputBlock">
                                    <input class="mainInput custom" type="checkbox" id="checkBoxHasContent">
                                    <label class="label-heading" for="checkBoxHasContent"> Внутренние
                                        прямоугольники:&nbsp;</label>
                                    <label class="label-heading" type="text" id="inpTotal"> 0 </label>
                                    <label class="label-heading" for="inpTotal"> шт </label>

                                    <!-- чекбокс - внутренние элементы заданы по координатам -->
                                    <input class="subInput custom" type="checkbox" id="checkBoxByCoordinares">
                                    <label class="label-heading" for="checkBoxByCoordinares"> По координатам</label>
                                </div>
                            </div>
                        </header>

                        <section id="subBlock_" class="section-sub hidden">
                            <!-- внутреннее содержимое -->
                            <!-- блок внутренних прямоугольников -->

                            <div class="section-sub__grid--7x2">
                                <div class="div1"><label class="" id="subLabel_"> 1. </label></div>
                                <div class="div2">
                                    <label class="left" for="inpSizeWx_">Ширина</label>
                                    <input class="disabled" size="5" type="text" id="inpSizeWx_">
                                    <label class="right" for="inpSizeWx_">мм</label>
                                </div>

                                <div class="div3">
                                    <label class="left" for="inpSizewY_">Высота</label>
                                    <input class="disabled" size="5" type="text" id="inpSizeWy_">
                                    <label class="right" for="inpSizewY_">мм</label>
                                </div>

                                <div class="div4 subInput" tabindex="0">
                                    <div class="dropdown input-flex">
                                        <input size="6" class="subInput dropdown-input" type="text" placeholder="Тип">
                                        <ul id="packList_" class="dropdown-content hidden" tabindex="0">
                                        </ul>
                                        <button class="subInput dropbtn"><svg width="16px" height="16px"
                                                aria-hidden="true">
                                                <use xlink:href="#down"></use>
                                            </svg></button>
                                    </div>
                                </div>

                                <div class="div5">
                                    <input class="subInput custom" type="checkbox" id="checkBoxInRow_">
                                    <label class="right" for="checkBoxInRow_"> В ряд</label>
                                </div>

                                <!-- Second grid Line -->
                                <div class="div6">
                                    <button class="subInput" id="btnTurn_"> Повернуть </button>
                                </div>
                                <div class="div7">
                                    <label class="left subInputLabelY" for="inpNy_"> Количество<br>по вертикали </label>
                                    <input class="subInput" size="5" type="text" id="inpNy_">
                                    <label class="right" for="inpNy_"> шт </label>
                                </div>

                                <div class="div8">
                                    <label class="left subInputLabelX" for="inpNx_"> Количество<br>по горизонтали
                                    </label>
                                    <input class="subInput" size="5" type="text" id="inpNx_" name="package_wx_">
                                    <label class="right" for="inpNx_"> шт </label>
                                </div>

                                <div class="div9">
                                    <label class="summ" for="inpTotal_"> Всего = </label>
                                    <label class="summ" type="text" id="inpTotal_" name="package_total_"> 0 </label>
                                    <!-- <label class="my-1 mx-1" for="inpTotal4"> шт </label> -->
                                </div>
                            </div>


                        </section>


                    </section>

                </div>
                <!--right item-->


            </main>
            <!-- Строка статуса -->
            <footer>
                <section class="status-bar">
                <div class="">
                    <input class="label-twin" disabled="" id="lblStatusEdit" value="">
                    <label class="status-label"> | </label>
                    <input class="label-twin" disabled="" id="lblStatusChanged" value="">
                    <label class="status-label"> | </label>
                    <input class="label-twin" disabled="" id="lblStatus" value="">
                    <label class="status-label"> | </label>
                    <input class="label-twin label-width-200" disabled="" id="lblStatusInfo" value="">
                    <label hidden class="status-label"> | </label>
                </div>
                </section>
            </footer>



        </div>
    </div>

    <!--скрипты для стилей -->
    <!-- <script src="../dist/main.bundle.js"></script> -->
</body>
</html>