<?php

plog("");
plog("|----------------------------------------------------------------|");
plog("|                     updatePlacePrototype.php                   |");

// загружаем настройки и
// подключаемся к серверу mysql
// @include '../connection.php';

// получаем package_id - родительский контейнер, его содержимое будем обновлять
// это делается в вызывающем коде
// $package_id = $_POST['package_id'];

// получаем массив элементов внутри package_id в формате:
//      [
//          0: {sub_package_id: value, y: value, x: value},
//          1: {sub_package_id: value, y: value, x: value}.
//          ...
//          N: {sub_package_id: value, y: value, x: value}.
//      ]
if (array_key_exists('item', $_POST)) {

    $subItems = $_POST['item'];
    
    if ($subItems) {
        $subItemCount = count($subItems);
        plog("subItem count $subItemCount:");
        plog($subItems);
        // читаем из БД все записи для заданного package_id из таблицы place_prototype 
        //
        // Формируем запрос SELECT для получения внутренних элементов
        $query = " 
            SELECT
                place_prototype.sub_package_id,
                place_prototype.inrow,
                place_prototype.y,
                place_prototype.x
            FROM
                place_prototype
            WHERE package_id = $package_id
            ORDER BY
                place_prototype.y * 1,
                place_prototype.x * 1;
        ";
    
        // делаем запрос SELECT в БД
        // результат сохраняем в $result
        // если результат запросы не пуст
        // то заполняем таблицу
        if ($result = $mySqli->query($query)) {
            plog("package_id: $package_id  record count id DB: $result->num_rows");
            plog("|----------------------------------------------------------------|");
    
            $recSet = [];
            $index = 0;
            $result->data_seek(0);
            while ($item = $result->fetch_array(MYSQLI_ASSOC)) {
                $recSet[$index]['sub_package_id'] = $item['sub_package_id'];
                $recSet[$index]['y'] = $item['y'];
                $recSet[$index]['x'] = $item['x'];
                $index++;
            }
            $result->close();
            unset($result);
            unset($item);
    
            // перебираем все элементы в массиве сохраняемых элементов subItem
            for ($index = 0; $index < count($subItems); $index++) {
                $subItem = $subItems[$index];
    
                // ищем очередной элемент массива subItem в записях БД
                $itemExists = findItem($recSet, $subItem);
    
                // готовим данные для запроса
                $item_sub_package_id = $subItem['sub_package_id'];
                $item_inrow = $subItem['inrow'];
                $item_y = $subItem['y'];
                $item_x = $subItem['x'];
    
                // если запись с заданными row, col существует
                // (если найдена то сразу будет удалена из записей)
                if ( $itemExists ) {
                    
                    // обновляем ее sub_package_id
                    
                    // сохраняем запрос UPDATE в строку
    
                        plog("record $item_sub_package_id exists - updating");
    
                        $query = " 
                            UPDATE
                                place_prototype
                            SET
                                place_prototype.sub_package_id = $item_sub_package_id,
                                place_prototype.inrow = $item_inrow
                            WHERE
                                place_prototype.package_id = $package_id AND
                                place_prototype.y LIKE $item_y AND
                                place_prototype.x LIKE $item_x
                            ;
                        ";
                        plog("query: $query");
    
                // если такой записи нет
                } else {
    
                    // добавляем в базу новую запись
    
                        // сохраняем запрос INSERT в строку
                        $query = " 
                            INSERT INTO
                                place_prototype (
                                    place_prototype.package_id,
                                    place_prototype.sub_package_id,
                                    place_prototype.inrow,
                                    place_prototype.y,
                                    place_prototype.x
                                )
                            VALUES (
                                    $package_id,
                                    $item_sub_package_id,
                                    $item_inrow,
                                    $item_y,
                                    $item_x
                            );
                        ";
                        plog("query: $query");
                }
    
                // делаем запрос в БД
                if ($mySqli->query($query)) {
                    // echo "Record updated successfully";
                    // $package_id = $mySqli->insert_id;
                } else {
                    $errCount++;
                    $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
                    plog("Server reply error: $errDump");
                }    
                
            }
            unset($subItem);
            unset($subItems);
            
            // то что осталось в массиве записей удалим из БД
            $recCount = count($recSet);
            plog("deleting $recCount");
            foreach ($recSet as $rec) {
    
                    // удаляем из базы оставшиеся записи, они лишние
    
                        $item_sub_package_id = $rec['sub_package_id'];
                        plog("item_sub_package_id: $item_sub_package_id");
                        if ($item_sub_package_id > 0) {
    
                            // сохраняем запрос DELETE в строку
                            $item_y = $rec['y'];
                            $item_x = $rec['x'];
                            
                            $query = " 
                                DELETE FROM
                                    place_prototype 
                                WHERE
                                    place_prototype.package_id = $package_id AND
                                    place_prototype.sub_package_id = $item_sub_package_id AND
                                    place_prototype.y LIKE $item_y AND
                                    place_prototype.x LIKE $item_x
                                ;
                            ";
                            plog("query: $query");
    
                            // делаем запрос в БД
                            if ($mySqli->query($query)) {
                                // echo "Record updated successfully";
                                // $package_id = $mySqli->insert_id;
                            } else {
                                $errCount++;
                                $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
                                plog("Server reply error: $errDump");
                                //echo "Error updating record: " . $mysqli->error;
                            }    
                        }
            }
            unset($recSet);
    
        // если запрос вернул ошибку
        } else {
    
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }
    } else {
        $query = " 
            DELETE FROM
                place_prototype 
            WHERE
                place_prototype.package_id = $package_id
            ;
        ";
        plog("query: $query");

        // делаем запрос в БД
        if ($mySqli->query($query)) {
            // echo "Record updated successfully";
            // $package_id = $mySqli->insert_id;
        } else {
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
            //echo "Error updating record: " . $mysqli->error;
        }    

    }
}



function findItem(&$itemSet, $item) {
    plog("findItem {");

    // перебираем все записи из place_prototype где package_id
    // с параметром MYSQLI_ASSOC (значения вернутся в ассоциативном массиве)
    for ($index = 0; $index < count($itemSet); $index++) {

        $rec = $itemSet[$index];

        $item_y = $item['y'];
        $item_x = $item['x'];
        $rec_y = $rec['y'];
        $rec_x = $rec['x'];
        // plog("item['row']: $item_y; rec['row']: $rec_y");
        // plog("item['col']: $item_x; rec['col']: $rec_x");

        // если совпадают row и col 
        if (($item_y == $rec_y) && ($item_x == $rec_x)) {

            // то запись найдена удаляем ее и возвращаем true
            $itemSet[$index]['sub_package_id'] = 0;
            // $rec_sub_package_id = $rec['sub_package_id'];
            // plog("rec_sub_package_id: $rec_sub_package_id");
            // unset($itemSet[$index]);

            // plog("record set after serch and deleting has count: $itemSet->num_rows");
            return true;
        }
    }
    
    // если ничего не найдено возвращаем false
    return false;
}

plog("|                     updatePlacePrototype.php                   |");
plog("|----------------------------------------------------------------|");

?>