<?php

// глубина трассировки стэка вызова функций
$debug_backtrace_depth = 2;

$logFile = 'php.log';
$logFilePath = __DIR__ ."/../logs/" .$logFile;
error_log("\t [plog.php]\tphp log file:\t" .$logFilePath, 0);
// error_log(date("[Y-m-d H:i:s]") ."\t [plog.php]\tphp log file:\t" .$logFilePath, 0);



// настройки логирования ошибок php
error_reporting(E_ALL); // Error engine - always E_ALL!
ini_set('ignore_repeated_errors', TRUE); // always TRUE
ini_set('display_errors', FALSE); // Error display - FALSE only in production environment or real server. TRUE in development environment
ini_set('log_errors', TRUE); // Error logging engine
ini_set('error_log', '../logs/php_errors.log'); // Logging file path
ini_set('log_errors_max_len', 16384); // Logging file size



// -------------------------------------------------------
// Функция | Дописывает в конец файла лога данные из $data
//
function plog( $data = null ){
    // ob_start();                    // start buffer capture
    // var_dump( $object );           // dump the values
    // $contents = ob_get_contents(); // put the buffer into a variable
    // ob_end_clean();                // end capture
    // error_log( $contents );        // log contents of the result of var_dump( $object )
    global $logFile;
    global $logFilePath;
    global $debug_backtrace_depth;

    // if (!is_writable($logFilePath)) {

        try {

            for($index = $debug_backtrace_depth - 1; $index >= 0; $index--) {
                
                $function = debug_backtrace()[$index]['function'];
                
                if ($index == $debug_backtrace_depth - 1) {

                    $caller = basename(debug_backtrace()[$index]['file']);

                    $caller .= isset($function) ? " -> " .$function : '';
                } elseif ($index == 0) {
                    
                    // $caller .= " -> " .basename(debug_backtrace()[$index]['file']);
                } else {
                    
                    $caller .= " -> " .basename(debug_backtrace()[$index]['file']);
                    
                    $caller .= isset($function) ? " -> " .$function : '';
                }
            }

            file_put_contents($logFilePath, "\n", FILE_APPEND);
            file_put_contents($logFilePath, date("[Y-m-d H:i:s]") ."\t[" .$caller ."]\t" .print_r($data, true), FILE_APPEND);

        } catch(Exception $e) {
            
            error_log(date("[Y-m-d H:i:s]") ."\t[" .basename(__FILE__) ."]\t" .$e->getMessage(), 0);
        }
    // }

}



// -------------------------------------------------------
// Функция | очищает файл лога
//
function plog_clear(){
    // ob_start();                    // start buffer capture
    // var_dump( $object );           // dump the values
    // $contents = ob_get_contents(); // put the buffer into a variable
    // ob_end_clean();                // end capture
    // error_log( $contents );        // log contents of the result of var_dump( $object )
    global $logFile;
    global $logFilePath;

    // if (!is_writable($logFilePath)) {

        try {

            file_put_contents($logFilePath, "");

            // установка временной зоны по умолчанию. Доступно с PHP 5.1
            // date_default_timezone_set('UTC');

            // выведет примерно следующее: Monday 8th of August 2005 03:12:46 PM
            plog( ' Файл очищен' );
            plog( date('l jS \of F Y h:i:s A') );
            plog( '' );

        } catch(Exception $e) {
                
            error_log(date("[Y-m-d H:i:s]") ."\t" .$e->getMessage(), 0);
        }
    // }

}