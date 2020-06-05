<?php

// загружаем настройки и
// подключаемся к серверу mysql
@include '../connection.php';

plog("");
plog("|----------------------------------------------------------------|");
plog("|                     addPackage.php                             |");

// получаем название таблицы
// $tableName = $_POST["tableName"];

// получаем все характеристики элемента от фронтенда
$package_code = $_POST["package_code"];
$package_name = $_POST["package_name"];
$package_material_id = NULL;
$package_photo_id = NULL;
$package_payload = $_POST["package_payload"];
$package_wx = $_POST["package_wx"];
$package_wy = $_POST["package_wy"];
$package_wz = $_POST["package_wz"];
$package_iwx = $_POST["package_iwx"];
$package_iwy = $_POST["package_iwy"];
$package_iwz = $_POST["package_iwz"];
$package_color = $_POST["package_color"];
$package_depth = $_POST["package_depth"];
$package_turned = $_POST["package_turned"];

// сохраняем запрос UPDATE в строку
$query = " 
INSERT INTO
    package (
        package.code,
        package.name,
        package.payload,
        package.wx,
        package.wy,
        package.wz,
        package.iwx,
        package.iwy,
        package.iwz,
        package.color,
        package.depth,
        package.turned
    )
    VALUES (
        '$package_code',
        '$package_name',
        $package_payload,
        $package_wx,
        $package_wy,
        $package_wz,
        $package_iwx,
        $package_iwy,
        $package_iwz,
        '$package_color',
        $package_depth,
        $package_turned
    );
";

plog("INSERT:");
plog($query);

// делаем запрос в БД
// и запрос выполнен если успешно
if ($mySqli->query($query)) {
    // echo "Record updated successfully";
    $package_id = $mySqli->insert_id;

    // делаем обновление внутренних элементов
    require_once 'updatePlacePrototype.php';
} else {
    $errCount++;
    $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
    plog("Server reply error: $errDump");
}    

// проверяем были ли ошибки и передаем данные вызвавшей форме
if ($errCount == 0) {

    // $jsonText = array('package_id' => $package_id);
    $jsonText = "{\"package_id\": $package_id}";

    echo json_encode($jsonText);
} else {
    $errCount++;
    $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
    plog("Server reply error: $errDump");

    // сообщаем информацию о технической проблеме
    $jsonText = array(
        'errCount' => $errCount,
        'errDump' => $errDump
    );
        
    echo json_encode($jsonText);
}    

// закрываем подключение
$mySqli->close();

plog("|                     addPackage.php                             |");
plog("|----------------------------------------------------------------|");

?>