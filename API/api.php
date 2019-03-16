<?php session_start();

if($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST['serviceId']) {
    echo json_encode( [
        'status' => 400, 
        'data' => [
            'latitude' => 25.672263, 
            'longitude' => -100.34653
            ]
    ]);
}



?>