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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://kit.fontawesome.com/df57820da4.js" crossorigin="anonymous"></script>
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
    </style>
</head>

<body>
    <div class="container mt-3 mt-md-5">
        <h1>Congresses and Hackathons</h1>

        <h3>Interactive Map</h3>

        <div class="row">
            <div class="col-md-6 col-12">
                <h4>Hackathons Organized</h4>
                <div class="row">
                    <?php
                    $organized = retrieve("./data/organized_hackathons.json", TRUE);
                    foreach ($organized as $hackathon) :

                    ?>

                        <div class='col-md-11 col-12 mt-3'>
                            <div class="row mb-4 border rounded shadow p-3">
                                <div class="col-4">
                                    <img src="https://fakeimg.pl/250x250/" class="portait rounded">
                                </div>
                                <div class="col-8">
                                    <div class="row">
                                        <div class="col-12">
                                            <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?>
                                                <div style="float:right;">
                                                    <?php if ($hackathon['main_url'] != "" || $hackathon['devpost_url'] != "") : ?>

                                                        <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                                                            <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                                        </a>
                                                        <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['devpost_url']); ?>'>
                                                            <img class="icon" src="./static/img/devpost.png" alt="devpost logo">
                                                        </a>
                                                    <?php endif; ?>
                                                </div>
                                            </h6>
                                        </div>
                                        <div class="col-12">
                                            <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?></p>
                                            <p class='text-muted card-text text-justify'><?php
                                                                                            $d = $hackathon['start_date'];
                                                                                            $e = $hackathon['end_date'];
                                                                                            $sd = date_parse($d);
                                                                                            $ed = date_parse($e);

                                                                                            if ($sd['month'] == $ed['month']) {
                                                                                                $parsedMonth = monthToString($ed['month']);
                                                                                            } else {
                                                                                                $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                                                                                            }
                                                                                            echo (htmlentities($parsedMonth . " " . $ed['year'])); ?></p>
                                            <!-- TODO: do a bs5 tooltip to show date -->
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div> <?php endforeach;
                                ?>
                </div>
                <div class="col-12">
                    <h4 style="margin-top:60px;">Hackathons Attended</h4>
                    <div class="row">
                        <?php
                        $organized = retrieve("./data/organized_hackathons.json", TRUE);
                        foreach ($organized as $hackathon) :

                        ?>

                            <div class='col-md-11 col-12 mt-3'>
                                <div class="row mb-4 border rounded shadow p-3">
                                    <div class="col-4">
                                        <img src="https://fakeimg.pl/250x250/" class="portait rounded">
                                    </div>
                                    <div class="col-8">
                                        <div class="row">
                                            <div class="col-12">
                                                <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?>
                                                    <div style="float:right;">
                                                        <?php if ($hackathon['main_url'] != "" || $hackathon['devpost_url'] != "") : ?>

                                                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                                                                <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                                            </a>
                                                            <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['devpost_url']); ?>'>
                                                                <img class="icon" src="./static/img/devpost.png" alt="devpost logo">
                                                            </a>
                                                        <?php endif; ?>
                                                    </div>
                                                </h6>
                                            </div>
                                            <div class="col-12">
                                                <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?></p>
                                                <p class='text-muted card-text text-justify'><?php
                                                                                                $d = $hackathon['start_date'];
                                                                                                $e = $hackathon['end_date'];
                                                                                                $sd = date_parse($d);
                                                                                                $ed = date_parse($e);

                                                                                                if ($sd['month'] == $ed['month']) {
                                                                                                    $parsedMonth = monthToString($ed['month']);
                                                                                                } else {
                                                                                                    $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                                                                                                }
                                                                                                echo (htmlentities($parsedMonth . " " . $ed['year'])); ?></p>
                                                <!-- TODO: do a bs5 tooltip to show date -->
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div> <?php endforeach;
                                    ?>
                    </div>
                </div>
            </div>

            <div class=" col-md-6 col-12">
                <h4>Congresses Attended</h4>
                <div class="row">
                    <?php
                    $organized = retrieve("./data/attended_congresses.json", TRUE);
                    foreach ($organized as $hackathon) :

                    ?>

                        <div class='col-md-11 col-12 mt-3'>
                            <div class="row mb-4 border rounded shadow p-3">
                                <div class="col-4">
                                    <img src="<?php echo(htmlentities($hackathon['photo_url'])); ?>" class="portait rounded">
                                </div>
                                <div class="col-8">
                                    <div class="row">
                                        <div class="col-12">
                                            <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?>
                                                <div style="float:right;">
                                                    <?php if ($hackathon['main_url'] != "") : ?>

                                                        <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                                                            <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                                        </a>



                                                    <?php endif; ?>
                                                </div>
                                            </h6>
                                        </div>
                                        <div class="col-12">
                                            <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?></p>
                                            <p class='text-muted card-text text-justify'><?php
                                                                                            $d = $hackathon['start_date'];
                                                                                            $e = $hackathon['end_date'];
                                                                                            $sd = date_parse($d);
                                                                                            $ed = date_parse($e);

                                                                                            if ($sd['month'] == $ed['month']) {
                                                                                                $parsedMonth = monthToString($ed['month']);
                                                                                            } else {
                                                                                                $parsedMonth = monthToString($sd['month']) . "-" . monthToString($ed['month']);
                                                                                            }
                                                                                            echo (htmlentities($parsedMonth . " " . $ed['year'])); ?></p>
                                            <!-- TODO: do a bs5 tooltip to show date -->
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    <?php endforeach; ?>
                </div>

            </div>


            <hr class="d-sm-none">

        </div>
</body>

</html>