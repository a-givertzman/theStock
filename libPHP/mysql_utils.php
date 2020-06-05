<?php


// plog("|----------------------------------------------------------------|");
// plog("|                     mysql_utils.php                            |");



// загружаем настройки и
require_once 'mysql_settings.php';



// -------------------------------------------------------
// Функция | Подключается к серверу mysql, используя глобальные настройки
//
function connect() {
    plog("-> connect");
    
    $timerStart = microtime(true);
    
    // используем глобальные настройки для подключения к БД
    global $db_host, $db_user, $db_pass, $db_name;
    
    plog("connecting to the mySql server on $db_host");

    // линк к серверу mysql
    $mySqli = new mysqli();

    // настройки подключения
    // $mysqli->options();

    // подключаемся к серверу
    $mySqli->real_connect($db_host, $db_user, $db_pass, $db_name);
    
    // проверяем ошибки подключения
    if ($mySqli->connect_errno) {
        $errCount++;
        $errDump .= "Ошибка подключения" .preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
        plog("Server reply error: $errDump");
        // exit();
    }

    // изменение набора символов на utf8
    if (!$mySqli->set_charset("utf8")) {
        $errCount++;
        $errDump .= "Ошибка подключения" .preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
        plog("Server reply error: $errDump");
        // exit();
    } else {
        $charset = $mySqli->character_set_name();
        plog("Текущий набор символов: $charset");
    }

    $timerEnd = microtime(true);
    plog('time elapsed: ' . ($timerEnd - $timerStart));

    plog("connect ->");
    return $mySqli;
}



// -------------------------------------------------------
// Функция | Делает один запрос SELECT в таблицу tabeName
//
function selectData($tableName, $field = [], $orderField, $searchField = [], $searchQuery = "%") {
    plog("-> selectData");
    
    global $errCount;
    global $errDump;
    
    // подключаемся к БД
    $mySqli = connect();
    
    // если подключение успешно
    if ($mySqli->connect_errno == 0) {
        $timerStart = microtime(true);

        $query = "SELECT";

        // добавляем поля
        foreach($field as $index => $fieldName) {
            if ($index < count($field) - 1) {
    
                $query .= "\n   $fieldName,";
            } else {
                
                $query .= "\n   $fieldName";
            }
        }
    
        // добавляем таблицу
        $query .= "\nFROM $tableName";

        // добавляем фильтацию к запросу
        $searchQuery = $searchQuery == '' ? "%" : $searchQuery;
        foreach($searchField as $index => $field) {
            if ($index == 0) {
    
                $query .= "\nWHERE $field LIKE '$searchQuery'";
            } else {
                
                $query .= "\nOR $field LIKE '$searchQuery'";
            }
        }
    
        // добавляем сортировку к запросу
        $query .= "\nORDER BY $orderField;";


        plog("ЗАПРОС:");
        plog($query);

        $data = [];

        // делаем запрос в БД
        // и запрос выполнен если успешно
        if ($rows = $mySqli->query($query)) {

            while($row = $rows->fetch_array(MYSQLI_ASSOC)){

                // и каждый кладем в массив
                $data[$row['id']] = $row;
            }
            $rows->close();

            plog(count($data) ."records successfully selected");

        } else {
            // если были ошибки
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }

        // закрываем подключение
        $mySqli->close();

        $timerEnd = microtime(true);
        plog('time elapsed: ' . ($timerEnd - $timerStart));
    } else {
        
        $data = false;
    }
    plog("selectData ->");
    return $data;
}



// -------------------------------------------------------
// Функция | Возвращает ковычку если тип дпнных string
//
function quoteByDataType($value) {
    switch (gettype($value)) {
        case 'string':
            if ((strcasecmp($value, "null") == 0) || ($value == null)) {
                $quote = "";
            } else {
                $quote = "'";
            }
            break;

        default:
            $quote = "";
    }
    return $quote;
}



// -------------------------------------------------------
// Функция | Делает один запрос SELECT JOIN в таблицу tabeName
//
function selectJoinData($tableName, $field = [], $joinTableName, $joinField = [], $orderField, $searchField = [], $searchQuery = "%") {
    plog("-> selectJoinData");

    global $errCount;
    global $errDump;

    // подключаемся к БД
    $mySqli = connect();

    // если подключение успешно
    if ($mySqli->connect_errno == 0) {
        $timerStart = microtime(true);

        $query = "SELECT";

        // добавляем поля таблицы $tableName
        foreach($field as $index => $fieldName) {
            if ($index < count($field) - 1) {
    
                $query .= "\n   $tableName.$fieldName,";
            } else {
                
                $query .= "\n   $tableName.$fieldName,";
            }
        }
    
        // добавляем поля таблицы $joinTableName
        foreach($joinField as $index => $fieldName) {
            if ($index < count($joinField) - 1) {
    
                $query .= "\n   $joinTableName.$fieldName,";
            } else {
                
                $query .= "\n   $joinTableName.$fieldName";
            }
        }
    
        // добавляем таблицу
        $query .= "\nFROM $tableName";

        // добавляем таблицу связанную таблицу
        $query .= "\nLEFT JOIN  $joinTableName ON $tableName.$joinTableName" ."_id = $joinTableName.id";

        // добавляем фильтацию к запросу
        $searchQuery = $searchQuery == '' ? "%" : $searchQuery;
        foreach($searchField as $index => $field) {
            if ($index == 0) {
    
                $query .= "\nWHERE $field LIKE '$searchQuery'";
            } else {
                
                $query .= "\nOR $field LIKE '$searchQuery'";
            }
        }
    
        // добавляем сортировку к запросу
        $query .= "\nORDER BY $orderField;";


        plog("ЗАПРОС:");
        plog($query);

        $data = [];

        // делаем запрос в БД
        // и запрос выполнен если успешно
        if ($rows = $mySqli->query($query)) {

            while($row = $rows->fetch_array(MYSQLI_ASSOC)){

                // и каждый кладем в массив
                $data[$row['id']] = $row;
            }
            $rows->close();

            plog(count($data) ."records successfully selected");

        } else {
            // если были ошибки
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }

        // закрываем подключение
        $mySqli->close();

        $timerEnd = microtime(true);
        plog('time elapsed: ' . ($timerEnd - $timerStart));
    } else {
        
        $data = false;
    }
    plog("selectData ->");
    return $data;
}



// -------------------------------------------------------
// Функция | Делает один запрос INSERT в таблицу tableName
//
function insertData($tableName, &$data) {
    plog("-> insertData");

    global $errCount;
    global $errDump;

    // подключаемся к БД
    $mySqli = connect();

    // если подключение успешно
    if ($mySqli->connect_errno == 0) {
        $timerStart = microtime(true);

        // готовим запрос
        $query = "INSERT INTO $tableName (";
        
        // добавляем поля
        $index = 0;
        foreach($data as $fieldName => $value) {
            if ($index < count($data) - 1) {
    
                $query .= "\n   `$fieldName`,";
            } else {
                
                $query .= "\n   `$fieldName`";
            }
            $index++;
        }

        $query .= ")\nVALUES (";

        // добавляем значения
        $index = 0;
        foreach($data as $fieldName => $value) {

            $quote = quoteByDataType($value);

            $query .= "\n   $quote$value$quote,";

            $index++;
        }

        $query = substr_replace($query, '', - 1, 1);                        // удаляем запятую после последнего value

        $query .= "\n);";
        
        plog("ЗАПРОС:");
        plog($query);
        
        // делаем запрос в БД
        // и если запрос выполнен успешно
        if ($mySqli->query($query)) {
            
            // id текущего элемента, если был INSERT
            $data_id = $mySqli->insert_id;
            
            plog("Record inserted successfully, id: " .$data_id);
            
        } else {
            // если были ошибки
            $data_id = false;
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }
        
        // закрываем подключение
        $mySqli->close();


        $timerEnd = microtime(true);
        plog('time elapsed: ' . ($timerEnd - $timerStart));
    } else {
        
        $data_id = false;
    }
    plog("insertData ->");
    return $data_id;
}



// -------------------------------------------------------
// Функция | Делает один запрос UPDATE в таблицу tableName
//
function updateData($tableName, &$data) {
    plog("-> updateData");

    global $errCount;
    global $errDump;

    // подключаемся к БД
    $mySqli = connect();

    // если подключение успешно
    if ($mySqli->connect_errno == 0) {
        $timerStart = microtime(true);

        // готовим запрос
        $query = "UPDATE $tableName ";
        
        $query .= "\nSET ";

        // добавляем поле = значение
        $index = 0;
        foreach($data as $fieldName => $value) {

            $quote = quoteByDataType($value);

            if (strcasecmp($fieldName, "id") != 0) {                        // пропускаем поле id (PK)

                $query .= "\n   `$fieldName` = $quote$value$quote,";
            }
            
            $index++;
        }

        $query = substr_replace($query, '', - 1, 1);                        // удаляем запятую после последнего value
        
        $query .= "\nWHERE id = " .$data['id'] .";";

        // $query .= "\n;";
        
        plog("ЗАПРОС:");
        plog($query);
        
        // делаем запрос в БД
        // и если запрос выполнен успешно
        if ($mySqli->query($query)) {
            
            // id текущего элемента, если был INSERT
            $data_id = $mySqli->insert_id;
            
            plog("Record inserted/updated successfully, id: " .$data_id);
            
        } else {
            // если были ошибки
            $data_id = false;
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }
        
        // закрываем подключение
        $mySqli->close();

        $timerEnd = microtime(true);
        plog('time elapsed: ' . ($timerEnd - $timerStart));
    } else {
        
        $data_id = false;
    }
    plog("updateData ->");
    return $data_id;
}



// -------------------------------------------------------
// Функция | Делает один запрос INSERT ON DUBLIKATE KEY UPDATE в таблицу tableName
//
function insertOdkuData($tableName, &$data) {
    plog(" -> insertOdkuData");

    global $errCount;
    global $errDump;

    // подключаемся к БД
    $mySqli = connect();

    // если подключение успешно
    if ($mySqli->connect_errno == 0) {
        $timerStart = microtime(true);

        $id = $data['id'];

        // делаем запрос для проверки существует ли запись с таким же id
        $query = "SELECT EXISTS(SELECT 1 FROM $tableName WHERE id = $id LIMIT 1)";

        if ($result = $mySqli->query($query)) {
            
            $exists = $result->fetch_row()[0];                              // признак существования записи

            $result->close();

            if ($exists == 0) {         // если такой записи нет

                // делаем INSERT
                $data_id = insertData($tableName, $data);                   // делаем INSERT
            } else {                    // если такая запись есть
                
                $data_id = updateData($tableName, $data);                   // делаем UPDATE
            }
        } else {
            // если были ошибки
            $data_id = false;
            $errCount++;
            $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
            plog("Server reply error: $errDump");
        }
        
        // закрываем подключение
        $mySqli->close();

        $timerEnd = microtime(true);
        plog('time elapsed: ' . ($timerEnd - $timerStart));
    } else { 

        $data_id = false;
    }
    plog("insertOdkuData ->");
    return $data_id;
}



// plog("|                     mysql_utils.php                            |");
// plog("|----------------------------------------------------------------|");

?>