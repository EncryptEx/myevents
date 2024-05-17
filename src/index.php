<?php
session_start();

function retrieve($filename, $wantsDescending = FALSE)
{
  $data = json_decode(file_get_contents($filename), true);
  if ($wantsDescending) {
    $data = array_reverse($data);
  }
  return $data;
}

function monthToString($monthNum)
{
  $months = [
    1 => "Jan",
    2 => "Feb",
    3 => "Mar",
    4 => "Apr",
    5 => "May",
    6 => "June",
    7 => "Jul",
    8 => "Aug",
    9 => "Sep",
    10 => "Oct",
    11 => "Nov",
    12 => "Dec"
  ];
  return $months[$monthNum];
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />
  <script src="https://kit.fontawesome.com/df57820da4.js" crossorigin="anonymous"></script>
  <script src='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js'></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.css' rel='stylesheet' />
  <title>MyEvents - Jaume López Molina</title>
  <style>
    .icon {
      width: 25px;
      height: auto;
    }

    .portait {
      width: 100%;
      height: auto;
    }

    #lightSwitch {
      transform: scale(1.8);
    }
  </style>
  <script src="./static/js/toggler.js" defer></script>
</head>

<body>
  <div class="container mt-3 mt-md-5">
    <h1>Congresses and Hackathons</h1>
    <!-- switch starts -->
    <!-- <div class="d-flex">
            <div class="form-check form-switch ms-auto mt-3 me-3">
                <label class="form-check-label ms-3" for="lightSwitch">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-brightness-high" viewBox="0 0 16 16">
                        <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                    </svg>
                </label>
                <input class="form-check-input" type="checkbox" id="lightSwitch" />
            </div>
        </div> -->
    <!-- switch ends -->
    <h3>Interactive Map</h3>
    <div id='map' style='width: 100%; height: auto; min-height:500px;'></div>
    <hr class="mb-4">
    <style>
      .marker {
        /* default icon */
        background-image: url('https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png');
        background-size: cover;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
      }

      .mapboxgl-popup {
        max-width: 200px;
      }

      .mapboxgl-popup-content {
        text-align: center;
        font-family: 'Open Sans', sans-serif;
      }
    </style>
    <script>
      mapboxgl.accessToken = 'pk.eyJ1IjoiZW5jcnlwdGV4IiwiYSI6ImNsZjVuMm54NzBtbHYzd3FoZ3h6czh1MWIifQ.a-ffpy_yiO84rbT774vpaw';
      var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        // Europe / Spain  Zoom
        center: [0.6, 41],
        zoom: 3
      });



      function generateMarkers(jsonFile, photourls) {
        var identifier = 0;
        fetch(jsonFile)
          .then((response) => response.json())
          .then((json) => {

            for (const event of json) {
              // create a HTML element for each event
              const el = document.createElement("div");
              el.className = "marker";
              el.id = "markerId" + identifier;
              if (event.geometry == undefined) {
                continue
              };

              // check for special case: extra_url
              extraUrl = "";
              if (event.extra_url != undefined) {
                // htmlentities in javascript (prevent xss)
                toAdd = event.extra_url.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
                  return '&#' + i.charCodeAt(0) + ';';
                });
                // generate addition text
                extraUrl = ` For more info see <a href='${toAdd}'>here</a>.`;
              }

              // Add marker to map
              var coords = [event.geometry.coordinates.lng, event.geometry.coordinates.lat];
              new mapboxgl.Marker(el)

                .setLngLat(coords)
                .setPopup(
                  new mapboxgl.Popup({
                    offset: 25
                  }) // add popups
                    .setHTML(
                      `<h3>${event.name}</h3><p>${event.description + extraUrl}</p>`
                    )
                )
                .addTo(map);

              // set pin icon
              el.style.backgroundImage = 'url(' + event.photo_url + ')';
            }
          });
      }
      generateMarkers("./data/attended_hackathons.json");
      generateMarkers("./data/attended_congresses.json");
      generateMarkers("./data/organized_hackathons.json");
      generateMarkers("./data/attended_competitions.json");
    </script>
    <div class="row">
      <div class="col-md-6 col-12">
        <h4>Hackathons Organized</h4>
        <div class="row">
          <?php
          $organized = retrieve("./data/organized_hackathons.json", TRUE);
          $iteratorCounter = 0;
          foreach ($organized as $hackathon):

            ?>

            <div class='col-md-11 col-12 mt-3' id='organized_hackathons_<?php echo $iteratorCounter; ?>'>
              <div class="row mb-4 border rounded shadow p-3">
                <div class="col-4">
                  <img src="<?php echo (htmlentities($hackathon['photo_url'])); ?>" class="portait rounded">
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col-12">
                      <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?>
                        <div style="float:right;">
                          <?php if (isset($hackathon['main_url']) && $hackathon['main_url'] != ""): ?>

                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                              <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                            </a>
                          <?php endif;
                          if (isset($hackathon['devpost_url']) && $hackathon['devpost_url'] != ""): ?>
                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['devpost_url']); ?>'>
                              <img class="icon" src="./static/img/devpost.png" alt="devpost logo">
                            </a>
                          <?php endif; ?>
                        </div>
                      </h6>
                    </div>
                    <div class="col-12">
                      <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?>
                      </p>
                      <p class='text-muted card-text text-justify'>
                        <?php
                        $d = $hackathon['start_date'];
                        $e = $hackathon['end_date'];
                        $sd = date_parse($d);
                        $ed = date_parse($e);

                        if ($sd['month'] == $ed['month']) {
                          $parsedMonth = monthToString($ed['month']);
                        } else {
                          $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                        }
                        echo (htmlentities($parsedMonth . " " . $ed['year'])); ?>
                      </p>
                      <!-- TODO: do a bs5 tooltip to show date -->
                    </div>
                  </div>
                </div>
              </div>


            </div> <?php
            $iteratorCounter++;
          endforeach;
          ?>
        </div>
      </div>



      <div class="col-md-6 col-12">
        <h4>Hackathons Attended</h4>
        <div class="row">
          <?php
          $iteratorCounter = 0;
          $organized = retrieve("./data/attended_hackathons.json", TRUE);
          foreach ($organized as $hackathon):

            ?>

            <div class='col-md-11 col-12 mt-3' id='attended_hackathons_<?php echo $iteratorCounter; ?>'>
              <div class="row mb-4 border rounded shadow p-3">
                <div class="col-4">
                  <img src="<?php echo (htmlentities($hackathon['photo_url'])); ?>" class="portait rounded">
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col-12">
                      <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?>
                        <div style="float:right;">
                          <?php if (isset($hackathon['main_url']) && $hackathon['main_url'] != ""): ?>

                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                              <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                            </a>
                          <?php endif;
                          if (isset($hackathon['devpost_url']) && $hackathon['devpost_url'] != ""): ?>
                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['devpost_url']); ?>'>
                              <img class="icon" src="./static/img/devpost.png" alt="devpost logo">
                            </a>
                          <?php endif;
                          if (isset($hackathon['project_url']) && $hackathon['project_url'] != ""): ?>
                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['project_url']); ?>'>
                              <img class="icon" src="./static/img/github.svg" alt="github logo">
                            </a>
                          <?php endif; ?>
                        </div>
                      </h6>
                    </div>
                    <div class="col-12">
                      <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?>
                      </p>
                      <p class='text-muted card-text text-justify'>
                        <?php
                        $d = $hackathon['start_date'];
                        $e = $hackathon['end_date'];
                        $sd = date_parse($d);
                        $ed = date_parse($e);

                        if ($sd['month'] == $ed['month']) {
                          $parsedMonth = monthToString($ed['month']);
                        } else {
                          $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                        }
                        echo (htmlentities($parsedMonth . " " . $ed['year'])); ?>
                      </p>
                      <!-- TODO: do a bs5 tooltip to show date -->
                    </div>
                  </div>
                </div>
              </div>


            </div> <?php
            $iteratorCounter++;
          endforeach;
          ?>
        </div>

      </div>

      <div class="col-12">
        <h4 style="margin-top:60px;">Robotic Competitions Attended</h4>
        <div class="row">
          <?php
          $organized = retrieve("./data/attended_competitions.json", TRUE);
          $iteratorCounter = 0;
          foreach ($organized as $competition):
            ?>
            <div class="col-12 col-lg-6">
              <div class="row">
                <div class='col-12 col-md-11 mt-3 mr' id='attended_competitions_<?php echo $iteratorCounter; ?>'>
                  <div class="row mb-4 border rounded shadow p-3">
                    <div class="col-4">
                      <img src="<?php echo (htmlentities($competition['photo_url'])); ?>" class="portait rounded">
                    </div>
                    <div class="col-8">
                      <div class="row">
                        <div class="col-12">
                          <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($competition['name']); ?>
                            <div style="float:right;">
                              <?php if ($competition['main_url'] != ""): ?>

                                <a class="text-decoration-none"
                                  href='<?php echo htmlentities($competition['main_url']); ?>'>
                                  <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                </a>
                              <?php endif;
                              if (isset($competition['extra_url']) && $competition['extra_url'] != ""): ?>

                                <a class="text-decoration-none"
                                  href='<?php echo htmlentities($competition['extra_url']); ?>'>
                                  <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                </a>
                              <?php endif; ?>
                            </div>
                          </h6>
                        </div>
                        <div class="col-12">
                          <p class='text-muted card-text text-justify'>
                            <?php echo htmlentities($competition['description']); ?>
                          </p>
                          <p class='text-muted card-text text-justify'>
                            <?php
                            $d = $competition['start_date'];
                            $e = $competition['end_date'];
                            $sd = date_parse($d);
                            $ed = date_parse($e);

                            if ($sd['month'] == $ed['month']) {
                              $parsedMonth = monthToString($ed['month']);
                            } else {
                              $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                            }
                            echo (htmlentities($parsedMonth . " " . $ed['year'])); ?>
                          </p>
                          <!-- TODO: do a bs5 tooltip to show date -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <?php
            $iteratorCounter++;
          endforeach; ?>
        </div>
      </div>


      <div class="col-12">
        <h4 style="margin-top:60px;">Congresses Attended</h4>
        <div class="row">
          <?php
          $organized = retrieve("./data/attended_congresses.json", TRUE);
          $iteratorCounter = 0;
          foreach ($organized as $congress):
            ?>
            <div class="col-12 col-lg-6">
              <div class="row">
                <div class='col-12 col-md-11 mt-3 mr' id='attended_congresses_<?php echo $iteratorCounter; ?>'>
                  <div class="row mb-4 border rounded shadow p-3">
                    <div class="col-4">
                      <img src="<?php echo (htmlentities($congress['photo_url'])); ?>" class="portait rounded">
                    </div>
                    <div class="col-8">
                      <div class="row">
                        <div class="col-12">
                          <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($congress['name']); ?>
                            <div style="float:right;">
                              <?php if ($congress['main_url'] != ""): ?>

                                <a class="text-decoration-none" href='<?php echo htmlentities($congress['main_url']); ?>'>
                                  <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                </a>



                              <?php endif; ?>
                            </div>
                          </h6>
                        </div>
                        <div class="col-12">
                          <p class='text-muted card-text text-justify'>
                            <?php echo htmlentities($congress['description']); ?>
                          </p>
                          <p class='text-muted card-text text-justify'>
                            <?php
                            $d = $congress['start_date'];
                            $e = $congress['end_date'];
                            $sd = date_parse($d);
                            $ed = date_parse($e);

                            if ($sd['month'] == $ed['month']) {
                              $parsedMonth = monthToString($ed['month']);
                            } else {
                              $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                            }
                            echo (htmlentities($parsedMonth . " " . $ed['year'])); ?>
                          </p>
                          <!-- TODO: do a bs5 tooltip to show date -->
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <?php
            $iteratorCounter++;
          endforeach; ?>
        </div>
      </div>


      <hr class="d-sm-none">

    </div>
</body>

</html>