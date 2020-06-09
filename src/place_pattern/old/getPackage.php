<?php

// -------------------------------------------------------
// Подключение | Загружаем настройки и
//               подключаемся к серверу mysql
//
@require_once '../connection.php';



plog("");
plog("|----------------------------------------------------------------|");
plog("|                     getPackage.php                             |");



// -------------------------------------------------------
// Данные | Получаем данные от фронтэнда
//
$package_id = $_POST["package_id"];     // id запрошенного элемента
$package_depth = $_POST["package_depth"];               // глубина чтения внутренних элементов



// -------------------------------------------------------
// Функция | Загружает внутренние элементы
//
function loadItems($mySqli, $id, $package_depth) {

    if ($package_depth <= 0) {
        return false;
    }

    plog("");
    plog("|----------------------------------------------------------------|");
    plog("|                     getPackage.php > loadItems                 |");

    // Формируем запрос SELECT для получения внутренних элементов текущего
        $query = " 
            SELECT
                place_prototype.sub_package_id,
                place_prototype.inrow,
                place_prototype.x,
                place_prototype.y,
                package.id,
                package.code,
                package.name,
                package.material_id,
                package.photo_id,
                package.payload,
                package.wx,
                package.wy,
                package.wz,
                package.iwx,
                package.iwy,
                package.iwz,
                package.color,
                package.created,
                package.updated,
                package.deleted,
                material.name as material_name
            FROM
                place_prototype
            LEFT JOIN
                package 
            ON (
                package.id = place_prototype.sub_package_id OR
                package.id = null
            )
            LEFT JOIN
                material 
            ON (
                package.material_id = material.id OR
                package.material_id = null
            )
            WHERE place_prototype.package_id = $id
            ORDER BY
                place_prototype.y,
                place_prototype.x;
        ";

        // если внутренние элементы есть
        if ($subRows = $mySqli->query($query)) {

            plog("Sub rows:");
            plog($subRows);

            $subItem = array();

            // перебираем их поштучно
            while($subRow = $subRows->fetch_array(MYSQLI_ASSOC)){

                // загружаем внутренние элементы текущего
                if($item = loadItems($mySqli, $subRow['id'], ($package_depth - 1))) {
                    
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
        package.id,
        package.code,
        package.name,
        package.material_id,
        package.photo_id,
        package.payload,
        package.wx,
        package.wy,
        package.wz,
        package.iwx,
        package.iwy,
        package.iwz,
        package.color,
        package.created,
        package.updated,
        package.deleted,
        package.depth,
        package.turned,
        material.name as material_name
    FROM
        package
    LEFT JOIN
        material 
    ON (
        package.material_id = material.id OR
        package.material_id = null
    )
    LEFT JOIN
        package_photo
    ON (
        package.photo_id = package_photo.id OR
        package.photo_id = NULL
    )
    WHERE package.id = $package_id
    ORDER BY package.code;
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
        $depth = (!$row["depth"]) ? $row["depth"] : $package_depth;
        plog("depth: $depth");

        // загружаем внутренние элементы
        if($item = loadItems($mySqli, $row['id'], ($package_depth - 1))) {

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


plog("|                     getPackage.php                             |");
plog("|----------------------------------------------------------------|");

?>