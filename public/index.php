<?php header('Content-Type: text/html; charset=utf-8');?>
<!doctype html>
<html>
  <head>

    <title>ExoPlanetSystems - A Visualization of Exoplanet Systems</title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

    <meta name="description" content="ExoPlanetSystems - a Visualization for Exoplanet Systems" />
    <meta name="keywords" content="ExoPlanetSystems, visualization of exoplanets, exoplanets, planet systems, 3d visualization, solar system, WebGL, three.js" />
    <meta name="author" content="Tommy Krüger" />
    <meta name="robots" content="all" />
    <meta name="google-site-verification" content="RtzyxwlSL4KZFPywhDvPtSzF00poBVw-lQ3fvHRtPu8" />

    <link rel="shortcut icon" href="img/favicon.png" />
    <link rel="alternate" href="http://exoplanetsystems.org" hreflang="en-us" />

    <link rel="stylesheet" href="css/app.css">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">

    <link href="http://fonts.googleapis.com/css?family=Roboto:400,500,300,700" rel="stylesheet" type="text/css">
    <link href='https://fonts.googleapis.com/css?family=Passion+One:400,700,900|Noto+Sans:400,400italic,700,700italic' rel='stylesheet' type='text/css'>

  </head>
<body>

  <div id="loader">
    <span>Loading Data</span>
    <span class="fa fa-spin fa-spinner"></span>
  </div>


  <div id="scene"></div>

  <div id="footer">

    <ul id="distances">
      <li>Distance to Center:</li>
      <!-- <li><span id="distance-km"></span> KM</li> -->
      <!-- <li><span id="distance-au"></span> AU</li> -->
      <li><span id="distance-ly"></span> Light Years</li>
      <li><span id="distance-pc"></span> Parsec</li>
    </ul>

    <span id="copyright"> &copy; 2013-<?php echo date('Y')?> by Tommy Krüger</span>

  </div>

  <div id="labels"></div>

  <script src="../jspm_packages/system.js"></script>
  <script src="../config.js"></script>
  
  <script>
    System.import('../src/js/app.js');
  </script>

  <!-- <script type="text/javascript" src="../build.js"></script> -->

</body>
</html>
