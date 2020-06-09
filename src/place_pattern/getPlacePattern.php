<?php

// -------------------------------------------------------
// Логгер | Подключаем и настраиваем логгироавние
// 

// Инициализируем переменные для хранения ошибок
$errCount = 0;
$errDump = " | ";

// Добавлять в отчет все ошибки PHP
error_reporting(E_ALL & ~E_NOTICE);

require_once '../libPHP/plog.php';



plog("");
plog("-> getPlacePattern.php");

// загружаем настройки и
// подключаемся к серверу mysql
require_once '../libPHP/mysql_utils.php';

// получаем название таблицы
// $tableName = $_POST["tableName"];

$data_id = 0;

// делаем запрос SELECT в таблицу place_pattern
$data = selectData('place_pattern',
    [
        'id',
        'name',
        'code',
        'iwx',
        'iwy',
        'iwz',
        'payload',
        'nature_id',
        'wx',
        'wy',
        'wz',
        'archetype_id',
        'bycoordinates',
        'color',
        'depth',
        'view',
        'created',
        'updated',
        'deleted',
        'sub1_id',
        'inrow1',
        'position1',
        'x1',
        'y1',
        'sub2_id',
        'inrow2',
        'position2',
        'x2',
        'y2',
        'sub3_id',
        'inrow3',
        'position3',
        'x3',
        'y3',
        'sub4_id',
        'inrow4',
        'position4',
        'x4',
        'y4',
        'sub5_id',
        'inrow5',
        'position5',
        'x5',
        'y5',
        'sub6_id',
        'inrow6',
        'position6',
        'x6',
        'y6',
        'sub7_id',
        'inrow7',
        'position7',
        'x7',
        'y7',
        'sub8_id',
        'inrow8',
        'position8',
        'x8',
        'y8',
        'sub9_id',
        'inrow9',
        'position9',
        'x9',
        'y9'
    ], 
    'code', [], '%'
);

plog($data);



// проверяем были ли ошибки и передаем данные вызвывающей форме
$jsonText = [];                                                             // массив для передачи данных фронтенду
if ($errCount == 0) {
    // если все прошло без критичных ошибок
    
    $jsonText = array(                                                      // формируем набор данных и информацию об ошибках
        'data' => $data,
        'errCount' => $errCount,
        'errDump' => $errDump
    );

} else {
    // если были критичные ошибки

    plog("Server reply error: $errDump");

    $jsonText = array(                                                      // формируем набор данных и информацию об ошибках
        'errCount' => $errCount,
        'errDump' => $errDump
    );
}

echo json_encode($jsonText);                                                // передаем данные


plog("getPlacePattern.php ->");