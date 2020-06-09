<?php

// -------------------------------------------------------
// Подключение | Загружаем настройки и
//               подключаемся к серверу mysql
//
@require_once '../connection.php';



plog("");
plog("|----------------------------------------------------------------|");
plog("|                     getPlace.php                               |");



// -------------------------------------------------------
// Данные | Получаем данные от фронтэнда
//
$data_id = $_POST["data_id"];     // id запрошенного элемента
$data_depth = $_POST["data_depth"];               // глубина чтения внутренних элементов



// -------------------------------------------------------
// Функция | Загружает внутренние элементы
//
function loadItems($mySqli, $id, $data_depth) {

    if ($data_depth <= 0) {
        return false;
    }

    plog("");
    plog("|----------------------------------------------------------------|");
    plog("|                     getPlace.php > loadItems                   |");

    // Формируем запрос SELECT для получения внутренних элементов текущего
        $query = " 
            SELECT
                place.id,
                place.package_id as refId,
                place.addr,
                if(place.package_id is null, '', package.code) as code,
                if(place.package_id is null, place.name, package.name) as name,
                if(place.package_id is null, place.payload, package.payload) as payload,
                place.x,
                place.y,
                if(place.package_id is null, place.wx, package.wx) as wx,
                if(place.package_id is null, place.wy, package.wy) as wy,
                if(place.package_id is null, place.wz, package.wz) as wz,
                if(place.package_id is null, place.iwx, package.iwx) as iwx,
                if(place.package_id is null, place.iwy, package.iwy) as iwy,
                if(place.package_id is null, place.iwz, package.iwz) as iwz,
                if(place.package_id is null, place.color, package.color) as color,
                place.created,
                place.updated,
                place.deleted,
                place.place_type_id,
                place.place_status_id,
                place.place_purpose_id,
                place_picture.picture
            FROM place_relation
            LEFT JOIN place ON (place.id = place_relation.sub_place_id)
            LEFT JOIN package ON (place.package_id = package.id)
			LEFT JOIN place_picture ON (place.picture_id = place_picture.id)
            WHERE place_relation.place_id = $id
            ORDER BY place_relation.sub_place_id;
        ";

        // если внутренние элементы есть
        if ($subRows = $mySqli->query($query)) {

            plog("Sub rows:");
            plog($subRows);

            $subItem = array();

            // перебираем их поштучно
            while($subRow = $subRows->fetch_array(MYSQLI_ASSOC)){

                // загружаем внутренние элементы текущего
                if($item = loadItems($mySqli, $subRow['id'], ($data_depth - 1))) {
                    
                    // добавляем внутренние элементы в текущий элемент если они есть
                    $subRow["item"] = $item;
                }
                
                // и каждый кладем в массив
                $subItem[] = $subRow;
            }
            plog("Sub items:");
            plog($subItem);
            
            // возвращаем массив внутренних элементов
            return $subItem;
        } else {
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");

            return false;
        }
}



// -------------------------------------------------------
// Main | Загружаем запрошенный элемент
//

// сохраняем запрос SELECT в строку
$query = " 
    SELECT
        place.id,
        place.package_id as refId,
        place.addr,
        if(place.package_id is null, '', package.code) as code,
        if(place.package_id is null, place.name, package.name) as name,
        if(place.package_id is null, place.payload, package.payload) as payload,
        place.x,
        place.y,
        if(place.package_id is null, place.wx, package.wx) as wx,
        if(place.package_id is null, place.wy, package.wy) as wy,
        if(place.package_id is null, place.wz, package.wz) as wz,
        if(place.package_id is null, place.iwx, package.iwx) as iwx,
        if(place.package_id is null, place.iwy, package.iwy) as iwy,
        if(place.package_id is null, place.iwz, package.iwz) as iwz,
        if(place.package_id is null, place.color, package.color) as color,
        place.created,
        place.updated,
        place.deleted,
        place.place_type_id,
        place.place_status_id,
        place.place_purpose_id,
        place_picture.picture
    FROM place
    LEFT JOIN package
    ON (package.id = place.package_id)
    LEFT JOIN place_picture
    ON (place.picture_id = place_picture.id)
    WHERE place.id = $data_id;
";

plog("UPDATE:");
plog($query);

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

        plog("Item:");
        plog($row);

        // глубина чтения внутренних элементов
        // если не заданна, то берем из сохраненного значения 
        $depth = (!$row["depth"]) ? $row["depth"] : $data_depth;
        plog("depth: $depth");

        // загружаем внутренние элементы
        if($item = loadItems($mySqli, $row['id'], ($data_depth - 1))) {

            // добавляем внутренние элементы в текущий элемент если они есть
            $row["item"] = $item;
        }

        // добавляем текщую запись к результирующему массиву
        $json[] = $row;
    }

    // отправляем массив строк из БД в формате json в JS
    echo json_encode($json);
        
    // освобождаем ресурсы
    $result->free();

// а если запрос неудачный 
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


plog("|                     getPlace.php                               |");
plog("|----------------------------------------------------------------|");

?>