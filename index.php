<?php
use App\Kernel;
use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\ErrorHandler\Debug as ErrorHandler;

require dirname(__DIR__).'/vendor/autoload.php';
session_start();

// Check if the user is not logged in
if(!isset($_SESSION['user'])) {
    // Redirect to the login page
    header('Location: login.php');
    exit();
}

if ($_SERVER['APP_DEBUG']) {
    umask(0000);
    ErrorHandler::register();
}

// Load environment variables
(new Dotenv())->loadEnv(dirname(__DIR__).'/.env');

// Initialize Symphony kernel and handle request
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);

// Define recipe data
$recipes = array(
    array(
        "title" => "Spaghetti Carbonara",
        "description" => "A classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
        "ingredients" => array(
            "Spaghetti",
            "Eggs",
            "Pancetta or guanciale",
            "Grated Pecorino Romano cheese",
            "Freshly ground black pepper"
        ),
        "instructions" => "Cook spaghetti, fry pancetta, mix eggs and cheese, combine everything, add pepper, and serve."
    ),
    // Add more recipes similarly
);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Recipe Book</title>
    <!-- Add your CSS and other meta tags here -->
</head>
<body>
    <header>
        <h1>Recipe Book</h1>
    </header>

    <main>
    <a href="php_manual_en.php" target="_blank">Open PHP Manual</a>
        <?php foreach ($recipes as $recipe): ?>
            <article>
                <h2><?= $recipe['title'] ?></h2>
                <p><?= $recipe['description'] ?></p>

                <h3>Ingredients:</h3>
                <ul>
                    <?php foreach ($recipe['ingredients'] as $ingredient): ?>
                        <li><?= $ingredient ?></li>
                    <?php endforeach; ?>
                </ul>

                <h3>Instructions:</h3>
                <p><?= $recipe['instructions'] ?></p>
            </article>
        <?php endforeach; ?>
    </main>

    <footer>
        <p>&copy; 2023 Recipe Book</p>
    </footer>
</body>
</html>