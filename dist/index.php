<?php include_once("../src/inc/header.php"); ?>
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
    <script src="../dist/bundle.js"></script>
    <!-- <script src="../jquery/jquery-3.4.1.min.js"></script> -->
    <!-- <script src="../jquery/jquery.validate.js"></script> -->
    <!-- <script src="../libJS/graphic.js?n=1"></script> -->
    <!-- <script src="../libJS/html_utils.js?n=1"></script> -->
    <!-- <script src="../libJS/data_handler.js?n=1"></script> -->
    <!-- <script src="../dialog/dialog.js?n=1"></script> -->
    <!-- <script src="settings.js?n=1"></script> -->
    <!-- <script src="place_pattern.js?n=1"></script> -->
    <!-- <script src="subblock.js?n=1"></script> -->
    <!-- <script src="../searchList/searchList.js?n=1"></script> -->
    <!-- <script src="main.js?n=1"></script> -->
</body>
</html>