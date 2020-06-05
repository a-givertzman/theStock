<?php

// загружаем настройки и
// подключаемся к серверу mysql
@require_once '../connection.php';



plog("");
plog("|----------------------------------------------------------------|");
plog("|                     setPackage.php                             |");



// получаем id элемента
$package_id = $_POST["package_id"];

// получаем все характеристики элемента
$package_code = $_POST["package_code"];
$package_name = $_POST["package_name"];
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
    UPDATE
        package
    SET
        package.code = '$package_code',
        package.name = '$package_name',
        package.payload = $package_payload,
        package.wx = $package_wx,
        package.wy = $package_wy,
        package.wz = $package_wz,
        package.iwx = $package_iwx,
        package.iwy = $package_iwy,
        package.iwz = $package_iwz,
        package.color = '$package_color',
        package.depth = $package_depth,
        package.turned = $package_turned
    WHERE
        package.id = $package_id;
";

plog("UPDATE:");
plog($query);



// делаем запрос в БД
// и запрос выполнен если успешно
if ($mySqli->query($query)) {
    // echo "Record updated successfully";

    // делаем обновление внутренних элементов
    require_once 'updatePlacePrototype.php';
} else {
    $errCount ++;
    $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
    plog("Server reply error: $errDump");
}    

// количество и массив ошибок передаем вызвавшей форме

$jsonText = array(
    'errCount' => $errCount,
    'errDump' => $errDump
);

echo json_encode($jsonText);

// закрываем подключение
$mySqli->close();

plog("|                     setPackage.php                             |");
plog("|----------------------------------------------------------------|");

?>