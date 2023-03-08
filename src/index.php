<?php
session_start();

function retrieve($filename)
{
    $data = json_decode(file_get_contents($filename), true);
    return $data;
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
    <div class="container mt-5">
        <h1>Congresses and Hackathons</h1>

        <h3>Interactive Map</h3>

        <div class="row">
            <div class="col-xl-5 col-md-6 col-12">
                <h4>Hackathons Organized</h4>
                <div class="row">
                    <?php
                    $organized = retrieve("./data/organized_hackathons.json");
                    foreach ($organized as $hackathon) :

                    ?>

                        <div class='col-12 mt-3'>
                            <div class="row mt-4 border rounded shadow p-3">
                                <div class="col-4">
                                    <img src="https://fakeimg.pl/250x250/" class="portait rounded">
                                </div>
                                <div class="col-8">
                                    <div class="row">
                                        <div class="col-8">
                                            <h6 style='font-size: 120%; font-weight:bold;'><?php echo htmlentities($hackathon['name']); ?></h6>
                                        </div><?php if ($hackathon['devpost_url'] != "" || $hackathon['devpost_url'] != "") : ?>
                                            <div class="col-4">
                                                <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['main_url']); ?>'>
                                                    <img class="icon" src="./static/img/earth-americas-solid.svg" alt="earth logo">
                                                </a>
                                                <a class="text-decoration-none" href='<?php echo htmlentities($hackathon['devpost_url']); ?>'>
                                                    <img class="icon" src="./static/img/devpost.png" alt="devpost logo">
                                                </a>
                                            </div><?php endif; ?>
                                        <div class="col-12">
                                            <p class='text-muted card-text text-justify'><?php echo htmlentities($hackathon['description']); ?></p>
                                            <p class='text-muted card-text text-justify'><?php echo (htmlentities($hackathon['start_date'] . " | " . $hackathon['end_date'])); ?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                                        </div> <?php endforeach;
                                ?>
                </div>
                <h4>Hackathons Attended</h4>

            </div>
            <div class="col-md-6 col-12">
                <h4>Congresses Attended</h4>
            </div>
        </div>
        <hr class="d-sm-none">

    </div>
</body>

</html>