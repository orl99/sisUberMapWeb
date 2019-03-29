<!DOCTYPE html>
<html>
  <head>
    <title>HEB Map</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCtWmjUrvH70dsRl1oZFUUrOfvDKP2B9kY"></script>
    <link rel="stylesheet" href="views/styles/main.css">
  </head>
  <body>

    <div id="map"></div>

    <input type="hidden" id="serviceId" value="<?php echo $_GET['serviceId']?>">

    <input type="hidden" value="API/api.php" id="urlWS">

    <!-- Dependencies -->

    <!-- jquery library and jquery.easing plugin are needed -->
    <script src="libs/jquery.min.js"></script>
    <script src="libs/jquery.easing.1.3.js"></script>

    <!-- we use markerAnimate to actually animate marker -->
    <script src="libs/markerAnimate.js"></script>

    <!-- SlidingMarker hides details from you - your markers are just animated automagically -->
    <script src="libs/SlidingMarker.js"></script>



    <script src="controller/MainMap.js"></script>
  </body>
</html>