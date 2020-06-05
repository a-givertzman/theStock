<?php

// -------------------------------------------------------
// Подключение | Загружаем настройки и
//               подключаемся к серверу mysql
//
@require_once '../connection.php';


plog("");
plog("|----------------------------------------------------------------|");
plog("|                     getPackage.php                             |");



// сохраняем запрос SELECT в строку
$query = " 
    SELECT
        package.id,
        package.code,
        package.name,
        # package.material_id,
        # package.photo_id,
        # package.payload,
        package.wx,
        package.wy,
        package.wz,
        package.iwx,
        package.iwy,
        package.iwz
        # package.color,
        # package.created,
        # package.updated,
        # package.deleted,
        # material.name as material_name
    FROM
        package
    # LEFT JOIN
    #     material 
    # ON (
    #     package.material_id = material.id OR
    #     package.material_id = null
    # )
    # LEFT JOIN
    #     package_photo
    # ON (
    #     package.photo_id = package_photo.id OR
    #     package.photo_id = NULL
    # )
    ORDER BY package.code;
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

        // получаем id текущего элемента
        $id = $row['id'];

        // Формируем запрос SELECT для получения внутренних элементов
        $query = " 
            SELECT
                place_prototype.sub_package_id,
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
                place_prototype.y * 1,
                place_prototype.x * 1;
        ";

        // если внутренние элементы есть
        if ($subRows = $mySqli->query($query)) {

            $subItem = array();

            // перебираем их поштучно
            while($subRow = $subRows->fetch_array(MYSQLI_ASSOC)){

                // и каждый кладем в массив
                $subItem[] = $subRow;
            }

            // добавляем массив внутренних элементов к текущей записи
            // их количество больше 0 
            if (count($subItem) > 0) {

                $row["item"] = $subItem;
            }
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

?>