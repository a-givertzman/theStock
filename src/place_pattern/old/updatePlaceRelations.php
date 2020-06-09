<?php

function updatePlaceRelations($mySqli, $subItems, $place_id) {
plog("");
plog("|----------------------------------------------------------------|");
plog("|                     updatePlaceRelations.php                   |");

plog("place_id: " .$place_id);
// получаем place_id - родительский контейнер, его содержимое будем обновлять
// это делается в вызывающем коде
// $place_id = $_POST['place_id'];

// получаем массив элементов внутри place_id в формате:
//      [
//          0: {sub_place_id: value},
//          1: {sub_place_id: value},
//          ...
//          N: {sub_place_id: value}.
//      ]
// if (array_key_exists('item', $item)) {

    plog("item: " .$item);
    plog("find subItem in " .$item['code']);

    
    if (is_array($subItems)) {
        $subItemCount = count($subItems);
        plog("subItem count $subItemCount:");
        plog($subItems);
        // читаем из БД все записи для заданного place_id из таблицы place_relation
        //
        // Формируем запрос SELECT для получения внутренних элементов
        $query = " 
            SELECT
                place_relation.sub_place_id
            FROM
                place_relation
            WHERE 
                place_relation.place_id = $place_id
            ORDER BY
                place_relation.sub_place_id;
        ";    
        plog("SELECT:");
        plog($query);
        
        // делаем запрос SELECT в БД
        // результат сохраняем в $result
        // если результат запросы не пуст
        // то заполняем массив recSet
        if ($result = $mySqli->query($query)) {
            plog("place_id: $place_id  record count id DB: $result->num_rows");
            plog("|----------------------------------------------------------------|");
    
            $recSet = [];   // массив всех записей (внутренних элементов) для заданного id
            $index = 0;
            $result->data_seek(0);
            while ($item = $result->fetch_array(MYSQLI_ASSOC)) {
                $recSet[$index]['sub_place_id'] = $item['sub_place_id'];
                $index++;
            }
            $result->close();
            unset($result);
            unset($item);
    
            // перебираем все элементы в массиве сохраняемых элементов subItem
            for ($index = 0; $index < count($subItems); $index++) {
                $subItem = $subItems[$index];
    
                // ищем очередной элемент массива subItem в записях БД
                // (если найдена то сразу будет удалена из массива записей)
                $itemExists = findItem($recSet, $subItem);
    
                // готовим данные для запроса
                $sub_place_id = $subItem['id'];
    
                // если запись с заданными id существует
                if ( $itemExists ) {
                    
                    // обновляем ее sub_place_id
                    // сохраняем запрос UPDATE в строку
                        plog("record $sub_place_id exists - updating");
    
                        $query = " 
                            UPDATE
                                place_relation
                            SET
                                place_relation.sub_place_id = $sub_place_id
                            WHERE
                                place_relation.place_id = $place_id
                            ;
                        ";
                        plog("query: $query");
    
                // если такой записи нет
                } else {
    
                    // добавляем в базу новую запись
                        // сохраняем запрос INSERT в строку
                        $query = " 
                            INSERT INTO
                                place_relation (
                                    place_relation.place_id,
                                    place_relation.sub_place_id
                                )
                            VALUES (
                                    $place_id,
                                    $sub_place_id
                            );
                        ";
                        plog("query: $query");
                }
    
                // делаем запрос в БД
                if ($mySqli->query($query)) {
                    plog("Record inserted successfully, id: $mySqli->insert_id");
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
    
                    // удаляем из базы оставшиеся записи
                        $sub_place_id = $rec['sub_place_id'];
                        plog("sub_place_id: $sub_place_id");
                        if ($sub_place_id > 0) {
    
                            // сохраняем запрос DELETE в строку
                            $query = " 
                                DELETE FROM
                                    place_relation 
                                WHERE
                                    place_relation.place_id = $place_id AND
                                    place_relation.sub_place_id = $sub_place_id
                                ;
                            ";
                            plog("query: $query");
    
                            // делаем запрос в БД
                            if ($mySqli->query($query)) {
                                plog("Record deleted successfully");
                            } else {
                                $errCount++;
                                $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
                                plog("Server reply error: $errDump");
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

    // у данного элемента нет внутренних, удалаем из place_relation все записи с этим id
    } else {
        $query = " 
            DELETE FROM
                place_relation 
            WHERE
                place_relation.place_id = $place_id
            ;
        ";
        plog("query: $query");

        // делаем запрос в БД
        if ($mySqli->query($query)) {
            plog("Records deleted successfully: $mySqli->affected_rows");
        } else {
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }    

    }
// }


plog("|                     updatePlaceRelations.php                   |");
plog("|----------------------------------------------------------------|");
}

function findItem(&$itemSet, $item) {
    plog("findItem {");

    // перебираем все записи из place_relation где place_id
    // с параметром MYSQLI_ASSOC (значения вернутся в ассоциативном массиве)
    for ($index = 0; $index < count($itemSet); $index++) {

        $rec = $itemSet[$index];

        $item_sub_place_id = $item['id'];
        $rec_sub_place_id = $rec['sub_place_id'];

        // если совпадают sub_place_id
        if ($item_sub_place_id == $rec_sub_place_id) {

            // то запись найдена удаляем ее и возвращаем true
            $itemSet[$index]['sub_place_id'] = 0;
            // $rec_sub_place_id = $rec['sub_place_id'];
            // plog("rec_sub_place_id: $rec_sub_place_id");
            // unset($itemSet[$index]);

            // plog("record set after serch and deleting has count: $itemSet->num_rows");
            return true;
        }
    }
    // если ничего не найдено возвращаем false
    return false;
}

?>