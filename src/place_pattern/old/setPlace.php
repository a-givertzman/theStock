<?php

// подключаем логгер
@require_once '../plog.php';

plog("");
plog("|----------------------------------------------------------------|");
plog("|                     setPlace.php                               |");
plog("post_max_size: " .ini_get('post_max_size'));
plog("upload_max_filesize: " .ini_get('upload_max_filesize'));

// загружаем настройки и
// подключаемся к серверу mysql
@include '../connection.php';

// делаем обновление связей внутренних элементов
require_once 'updatePlaceRelations.php';

// получаем название таблицы
// $tableName = $_POST["tableName"];    

$place_id = 0;

// -------------------------------------------------------
// Функция | Делает один запрос INSERT/UPDATE в таблицу place
//
function updatePlace($mySqli, &$item) {
    plog("|----------------------------------------------------------------|");
    plog("|                     setPlace.php -> updatePlace                |");

    global $errCount;
    global $errDump;

    // если package_refid не null, то
    // данный элемент соответствует элементу из package
    if (isset($place_refid) && ($place_refid > 0)) {
        // в place сохраняем только x, y, type, statuse, purpouse, item
        
    // если package_refid = null, то
    // данный элемент не имеет прототипа в package
    } else {
        // сохраняем все его данные в place

        $query = " 
        INSERT INTO
            place (
                place.id,
                place.package_id,
                place.addr,
                place.name,
                place.payload,
                place.x,
                place.y,
                place.wx,
                place.wy,
                place.wz,
                place.iwx,
                place.iwy,
                place.iwz,
                place.color,
                place.place_type_id,
                place.place_status_id,
                place.place_purpose_id
            )
            VALUES (
                ".$item["id"].",
                ".($item["refId"] > 0 ? $item["refId"] : 'NULL').",
                '".$item["addr"]."',
                '".$item["name"]."',
                ".$item["payload"].",
                ".$item["x"].",
                ".$item["y"].",
                ".$item["wx"].",
                ".$item["wy"].",
                ".$item["wz"].",
                ".$item["iwx"].",
                ".$item["iwy"].",
                ".$item["iwz"].",
                '".$item["color"]."',
                ".$item["type"].",
                ".$item["status"].",
                ".$item["purpose"]."
            )
            ON DUPLICATE KEY UPDATE
                place.id               =  ".$item["id"].",
                place.package_id       =  ".($item["refId"] > 0 ? $item["refId"] : 'NULL').",
                place.addr             = '".$item["addr"]."',
                place.name             = '".$item["name"]."',
                place.payload          =  ".$item["payload"].",
                place.x                =  ".$item["x"].",
                place.y                =  ".$item["y"].",
                place.wx               =  ".$item["wx"].",
                place.wy               =  ".$item["wy"].",
                place.wz               =  ".$item["wz"].",
                place.iwx              =  ".$item["iwx"].",
                place.iwy              =  ".$item["iwy"].",
                place.iwz              =  ".$item["iwz"].",
                place.color            = '".$item["color"]."',
                place.place_type_id    =  ".$item["type"].",
                place.place_status_id  =  ".$item["status"].",
                place.place_purpose_id =  ".$item["purpose"]."
            ;";
    }

    plog("INSERT:");
    plog($query);
    
    // делаем запрос в БД
    // и запрос выполнен если успешно
    if ($mySqli->query($query)) {
        
        // id текущего элемента, если был INSERT
        $item['id'] = $mySqli->insert_id > 0 ? $mySqli->insert_id : $item['id'];
    
        plog("Record inserted/updated successfully, id: " .$item['id']);
    
        // если есть внутренние элементы, сохраняем их сначала в place
        if (is_array($item['item'])) {

            for($index = 0; $index < count($item['item']); $index++) {

                plog("sub item found, id: ". $item['item'][$index]['id']);
                // рекурисивный вызов для сохранения внутренних элементов
                updatePlace($mySqli, $item['item'][$index]);
            }
            // в place_relation сохраняем связь внутренних элементов с данным элементом, их контейнером
            updatePlaceRelations($mySqli, $item['item'], $item['id']);
        }
    } else {
        // если были ошибки
        $errCount++;
        $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
        plog("Server reply error: $errDump");
    }   

    return $place_id;
}



// -------------------------------------------------------
// Main | Перебор всех элементов и сохранение их в таблицу place
//
if (array_key_exists('item', $_POST)) {

    $item = $_POST['item'];
    
    plog('Count of item: ' .count($item));
    plog('Count of item[item]: ' .count($item['item']));
    plog("item:");
    plog($item);

    // Сохраняем элемент со всем содержимым в place,
    // связи внутренних элементов в place_relation 
    $place_id = updatePlace($mySqli, $item);
} else {

    plog("item is NULL");
    plog($item);
}



// проверяем были ли ошибки и передаем данные вызвавшей форме
if ($errCount == 0) {

    // возвращаем id сохраненного элемента
    $jsonText = array('data_id' => $place_id);

    echo json_encode($jsonText);
} else {

    // если были ошибки
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

plog("|                     setPlace.php                               |");
plog("|----------------------------------------------------------------|");

?>