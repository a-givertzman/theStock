<?php

// подключаем логгер
@require_once '../plog.php';

plog("");
plog("|----------------------------------------------------------------|");
plog("|                     setPlace.php                               |");

// загружаем настройки и
// подключаемся к серверу mysql
@include '../connection.php';

// получаем название таблицы
// $tableName = $_POST["tableName"];    

$data_id = 0;

// -------------------------------------------------------
// Функция | Делает один запрос INSERT/UPDATE в таблицу place
//
function updatePlace($mySqli, &$data) {
    plog("|----------------------------------------------------------------|");
    plog("|                     setPlace.php -> updatePlace                |");

    global $errCount;
    global $errDump;

    if (true) {
        
        $query = " 
        INSERT INTO
            place_pattern (
                place_pattern.id,
                place_pattern.name,
                place_pattern.code,
                place_pattern.iwx,
                place_pattern.iwy,
                place_pattern.iwz,
                place_pattern.payload,
                place_pattern.nature_id,
                place_pattern.wx,
                place_pattern.wy,
                place_pattern.wz,
                place_pattern.archetype_id,
                place_pattern.bycoordinates,
                place_pattern.color,
                place_pattern.depth,
                place_pattern.turned,
                place_pattern.deleted,
                place_pattern.sub1_id,
                place_pattern.inrow1,
                place_pattern.x1,
                place_pattern.y1,
                place_pattern.sub2_id,
                place_pattern.inrow2,
                place_pattern.x2,
                place_pattern.y2,
                place_pattern.sub3_id,
                place_pattern.inrow3,
                place_pattern.x3,
                place_pattern.y3,
                place_pattern.sub4_id,
                place_pattern.inrow4,
                place_pattern.x4,
                place_pattern.y4,
                place_pattern.sub5_id,
                place_pattern.inrow5,
                place_pattern.x5,
                place_pattern.y5,
                place_pattern.sub6_id,
                place_pattern.inrow6,
                place_pattern.x6,
                place_pattern.y6,
                place_pattern.sub7_id,
                place_pattern.inrow7,
                place_pattern.x7,
                place_pattern.y7,
                place_pattern.sub8_id,
                place_pattern.inrow8,
                place_pattern.x8,
                place_pattern.y8,
                place_pattern.sub9_id,
                place_pattern.inrow9,
                place_pattern.x9,
                place_pattern.y9
            )
            VALUES (
                ".$data['id'].",
               '".$data['name']."',
               '".$data['code']."',
                ".$data['iwx'].",
                ".$data['iwy'].",
                ".$data['iwz'].",
                ".$data['payload'].",
                ".$data['nature_id'].",
                ".$data['wx'].",
                ".$data['wy'].",
                ".$data['wz'].",
                ".$data['archetype_id'].",
                ".$data['bycoordinates'].",
               '".$data['color']."',
                ".$data['depth'].",
                ".$data['turned'].",
                ".$data['deleted'].",
                ".$data['sub1_id'].",
                ".$data['inrow1'].",
                ".$data['x1'].",
                ".$data['y1'].",
                ".$data['sub2_id'].",
                ".$data['inrow2'].",
                ".$data['x2'].",
                ".$data['y2'].",
                ".$data['sub3_id'].",
                ".$data['inrow3'].",
                ".$data['x3'].",
                ".$data['y3'].",
                ".$data['sub4_id'].",
                ".$data['inrow4'].",
                ".$data['x4'].",
                ".$data['y4'].",
                ".$data['sub5_id'].",
                ".$data['inrow5'].",
                ".$data['x5'].",
                ".$data['y5'].",
                ".$data['sub6_id'].",
                ".$data['inrow6'].",
                ".$data['x6'].",
                ".$data['y6'].",
                ".$data['sub7_id'].",
                ".$data['inrow7'].",
                ".$data['x7'].",
                ".$data['y7'].",
                ".$data['sub8_id'].",
                ".$data['inrow8'].",
                ".$data['x8'].",
                ".$data['y8'].",
                ".$data['sub9_id'].",
                ".$data['inrow9'].",
                ".$data['x9'].",
                ".$data['y9']."
            )
            ON DUPLICATE KEY UPDATE
                place_pattern.id            =  ".$data["id"].",
                place_pattern.name          = '".$data["name"]."',
                place_pattern.code          = '".$data["code"]."',
                place_pattern.iwx           =  ".$data["iwx"].",
                place_pattern.iwy           =  ".$data["iwy"].",
                place_pattern.iwz           =  ".$data["iwz"].",
                place_pattern.payload       =  ".$data["payload"].",
                place_pattern.nature_id     =  ".$data["nature_id"].",
                place_pattern.wx            =  ".$data["wx"].",
                place_pattern.wy            =  ".$data["wy"].",
                place_pattern.wz            =  ".$data["wz"].",
                place_pattern.archetype_id  =  ".$data["archetype_id"].",
                place_pattern.bycoordinates =  ".$data["bycoordinates"].",
                place_pattern.color         = '".$data["color"]."',
                place_pattern.depth         =  ".$data["depth"].",
                place_pattern.turned        =  ".$data["turned"].",
                place_pattern.deleted       =  ".$data["deleted"].",
                place_pattern.sub1_id       =  ".$data["sub1_id"].",
                place_pattern.inrow1        =  ".$data["inrow1"].",
                place_pattern.x1            =  ".$data["x1"].",
                place_pattern.y1            =  ".$data["y1"].",
                place_pattern.sub2_id       =  ".$data["sub2_id"].",
                place_pattern.inrow2        =  ".$data["inrow2"].",
                place_pattern.x2            =  ".$data["x2"].",
                place_pattern.y2            =  ".$data["y2"].",
                place_pattern.sub3_id       =  ".$data["sub3_id"].",
                place_pattern.inrow3        =  ".$data["inrow3"].",
                place_pattern.x3            =  ".$data["x3"].",
                place_pattern.y3            =  ".$data["y3"].",
                place_pattern.sub4_id       =  ".$data["sub4_id"].",
                place_pattern.inrow4        =  ".$data["inrow4"].",
                place_pattern.x4            =  ".$data["x4"].",
                place_pattern.y4            =  ".$data["y4"].",
                place_pattern.sub5_id       =  ".$data["sub5_id"].",
                place_pattern.inrow5        =  ".$data["inrow5"].",
                place_pattern.x5            =  ".$data["x5"].",
                place_pattern.y5            =  ".$data["y5"].",
                place_pattern.sub6_id       =  ".$data["sub6_id"].",
                place_pattern.inrow6        =  ".$data["inrow6"].",
                place_pattern.x6            =  ".$data["x6"].",
                place_pattern.y6            =  ".$data["y6"].",
                place_pattern.sub7_id       =  ".$data["sub7_id"].",
                place_pattern.inrow7        =  ".$data["inrow7"].",
                place_pattern.x7            =  ".$data["x7"].",
                place_pattern.y7            =  ".$data["y7"].",
                place_pattern.sub8_id       =  ".$data["sub8_id"].",
                place_pattern.inrow8        =  ".$data["inrow8"].",
                place_pattern.x8            =  ".$data["x8"].",
                place_pattern.y8            =  ".$data["y8"].",
                place_pattern.sub9_id       =  ".$data["sub9_id"].",
                place_pattern.inrow9        =  ".$data["inrow9"].",
                place_pattern.x9            =  ".$data["x9"].",
                place_pattern.y9            =  ".$data["y9"]."
            ;";
    }

    plog("INSERT/UPDATE:");
    plog($query);
    
    // делаем запрос в БД
    // и запрос выполнен если успешно
    if ($mySqli->query($query)) {
        
        // id текущего элемента, если был INSERT
        $data_id = $mySqli->insert_id;
    
        plog("Record inserted/updated successfully, id: " .$data_id);
    
    } else {
        // если были ошибки
        $errCount++;
        $errDump .= preg_replace("/[\r\n\']/m", "", $mySqli->error) . " | ";
        plog("Server reply error: $errDump");
    }   

    return $data_id;
}

$data = $_POST['data'];
$data_id = updatePlace($mySqli, $data);

// проверяем были ли ошибки и передаем данные вызвавшей форме
if ($errCount == 0) {

    // возвращаем id сохраненного элемента
    $jsonText = array('data_id' => $data_id);

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