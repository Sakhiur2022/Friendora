<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> <?=$title ?? "Untitled"?> </title>
</head>
<body>
    <header>Welcome to MVC guy</header>
    <hr>
    <main>
        <?= $content ?? "Default content" ?>
    </main>
    <hr>
    <footer>All rights reserved by Sakhiur</footer>
</body>
</html>