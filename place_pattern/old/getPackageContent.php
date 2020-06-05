<?php

// error_reporting(E_ALL);
// ini_set("display_errors", 1);
// include("file_with_errors.php");

// загружаем настройки и
// подключаемся к серверу mysql
@include '../connection.php';

// получаем id элемента от фронтенда
$package_id = $_POST["package_id"];

// сохраняем запрос SELECT в строку
$query = " 
SELECT
    place_prototype.sub_package_id,
    place_prototype.row,
    place_prototype.col
FROM
    sobzav.place_prototype
WHERE package_id = $package_id
ORDER BY 
    place_prototype.row,
    place_prototype.col;
";

// print_r ($query);
// print_r ('<br/>');

// делаем запрос SELECT в БД
// результат сохраняем в $result
// если результат запросы не пуст
// то заполняем таблицу
if ($result = $mySqli->query($query)) {

    // читаем построчно результаты запроса
    // с параметром MYSQLI_NUM (значения вернутся в нумерованном массиве)
    // сохраняем строку в массив $row

    $json = array();
    while($row = $result->fetch_array(MYSQLI_ASSOC)){
        $json[] = $row;
    }

    // отправляем массив строк из БД в формате json в JS
    echo json_encode($json);
        
    // освобождаем ресурсы
    $result->free();

// а если запрос неудачный 
} else {

    // сообщаем информацию о технической проблеме
    echo json_encode(array(
        'status' => 'error',
        'message'=> $mySqli->error
    ));
}

// закрываем подключение
$mySqli->close();

?>