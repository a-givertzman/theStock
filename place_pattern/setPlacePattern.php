<?php

// -------------------------------------------------------
// Логгер | Подключаем и настраиваем логгироавние
// 

// Инициализируем переменные для хранения ошибок
$errCount = 0;
$errDump = " | ";

// Добавлять в отчет все ошибки PHP
// error_reporting(E_ALL & ~E_NOTICE);

require_once '../libPHP/plog.php';



plog_clear();
plog("-> setPlacePatternt.php");

// загружаем настройки и
// подключаемся к серверу mysql
require_once '../libPHP/mysql_utils.php';



$data = $_POST['data'];
$data_id = insertOdkuData('place_pattern', $data);

// проверяем были ли ошибки и передаем данные вызвавшей форме
if ($errCount == 0) {

    // возвращаем id сохраненного элемента
    $jsonText = (object)array(
        'data' => (object) array(
            'id' => $data_id
        )
    );

    echo json_encode($jsonText);
} else {

    plog("Server reply error: $errDump");

    // сообщаем информацию о технической проблеме
    $jsonText = array(
        'errCount' => $errCount,
        'errDump' => $errDump
    );

    echo json_encode($jsonText);
}


plog("setPlacePattern.php ->");