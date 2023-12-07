use App\Kernel;
use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\ErrorHandler\Debug as ErrorHandler;

require dirname(__DIR__).'/vendor/autoload.php';

if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    // Debug::enable();
    ErrorHandler::register();
}

// Load environment variables
(new Dotenv())->loadEnv(dirname(__DIR__).'/.env');

// Initialize Symphony kernel and handle request
$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);

// Handle the incoming request
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();

// Terminates the request/response cycle
$kernel->terminate($request, $response);