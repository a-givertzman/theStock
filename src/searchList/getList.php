<?php
// -------------------------------------------------------
// Логгер | Подключаем и настраиваем логгироавние
//

// Инициализируем переменные для хранения ошибок
$errCount = 0;
$errDump = "";

// Добавлять в отчет все ошибки PHP
error_reporting(E_ALL);

require_once '../plog.php';

plog("");
plog("|----------------------------------------------------------------|");
plog("|                     getList.php                                |");



// -------------------------------------------------------
// Подключение | Загружаем настройки и
//               подключаемся к серверу mysql
//
require_once '../connection.php';



// -------------------------------------------------------
// Данные | Получаем данные от фронтэнда
//
$search_query = $_POST["search_query"];     // id запрошенного элемента

plog("search_query: $search_query");

// сохраняем запрос SELECT в строку
$query = "
    SELECT
        package.id,
        package.code,
        package.name,
        package.wx,
        package.wy,
        package.wz,
        package.iwx,
        package.iwy,
        package.iwz,
        (SELECT COUNT(*) FROM place_prototype WHERE package.id = place_prototype.package_id) AS item_count
    FROM
        package
    WHERE
        package.code LIKE '$search_query' OR
        package.name LIKE '$search_query'
    ORDER BY package.code, package.name;
";

plog("sql query: $query");

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

        // добавляем текщую запись к результирующему массиву
        $json[] = $row;
    }

    // plog("result:");
    // plog($json);

    // отправляем массив строк из БД в формате json в JS
    echo json_encode($json);

    // освобождаем ресурсы
    $result->close();

// а если запрос неудачный
} else {

    $errCount ++;
    $errDump .= $mySqli->error ."\n";
    plog("Server reply error: $errDump");

    // сообщаем информацию о технической проблеме
    echo json_encode(array(
        'status' => 'error',
        'message'=> $mySqli->error
    ));
}

// закрываем подключение
$mySqli->close();

plog("|                     getList.php                                |");
plog("|----------------------------------------------------------------|");
?>