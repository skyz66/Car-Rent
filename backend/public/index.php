<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Config;
use App\Router;
use App\Response;
use App\Controllers\AuthController;
use App\Controllers\CarsController;
use App\Controllers\RentalsController;
use App\Controllers\ReclamationsController;
use App\Controllers\AdminController;
use App\Middleware\AuthMiddleware;
Config::load(__DIR__ . '/../.env');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

$router = new Router();

// Auth
$router->post('/api/auth/register', [AuthController::class, 'register']);
$router->post('/api/auth/login', [AuthController::class, 'login']);
$router->post('/api/auth/google', [AuthController::class, 'googleLogin']);
$router->patch('/api/profile/password', [AuthController::class, 'changePassword'], [AuthMiddleware::class . '::requireAuth']);

// Cars
$router->get('/api/cars', [CarsController::class, 'index']);
$router->get('/api/cars/{id}', [CarsController::class, 'show']);
$router->get('/api/cars/{id}/availability', [CarsController::class, 'availability']);
$router->post('/api/cars', [CarsController::class, 'create'], [AuthMiddleware::class . '::requireAdmin']);
$router->put('/api/cars/{id}', [CarsController::class, 'update'], [AuthMiddleware::class . '::requireAdmin']);
$router->delete('/api/cars/{id}', [CarsController::class, 'delete'], [AuthMiddleware::class . '::requireAdmin']);

// Rentals
$router->post('/api/rentals', [RentalsController::class, 'create'], [AuthMiddleware::class . '::requireAuth']);
$router->get('/api/rentals/my', [RentalsController::class, 'my'], [AuthMiddleware::class . '::requireAuth']);
$router->patch('/api/rentals/{id}/cancel', [RentalsController::class, 'cancel'], [AuthMiddleware::class . '::requireAuth']);
$router->get('/api/rentals', [RentalsController::class, 'all'], [AuthMiddleware::class . '::requireAdmin']);
$router->patch('/api/rentals/{id}/status', [RentalsController::class, 'updateStatus'], [AuthMiddleware::class . '::requireAdmin']);

// Reclamations
$router->post('/api/reclamations', [ReclamationsController::class, 'create'], [AuthMiddleware::class . '::requireAuth']);
$router->get('/api/reclamations/my', [ReclamationsController::class, 'my'], [AuthMiddleware::class . '::requireAuth']);
$router->get('/api/reclamations', [ReclamationsController::class, 'all'], [AuthMiddleware::class . '::requireAdmin']);
$router->patch('/api/reclamations/{id}/status', [ReclamationsController::class, 'updateStatus'], [AuthMiddleware::class . '::requireAdmin']);


// Admin dashboard
$router->get('/api/admin/dashboard/top-rented', [AdminController::class, 'topRented'], [AuthMiddleware::class . '::requireAdmin']);
$router->get('/api/admin/dashboard/summary', [AdminController::class, 'summary'], [AuthMiddleware::class . '::requireAdmin']);
$router->get('/api/admin/dashboard/rentals-by-day', [AdminController::class, 'rentalsByDay'], [AuthMiddleware::class . '::requireAdmin']);

// Admin users
$router->get('/api/admin/users', [AdminController::class, 'users'], [AuthMiddleware::class . '::requireAdmin']);
$router->post('/api/admin/users', [AdminController::class, 'createUser'], [AuthMiddleware::class . '::requireAdmin']);
$router->put('/api/admin/users/{id}', [AdminController::class, 'updateUser'], [AuthMiddleware::class . '::requireAdmin']);
$router->delete('/api/admin/users/{id}', [AdminController::class, 'deleteUser'], [AuthMiddleware::class . '::requireAdmin']);


try {
    $router->dispatch($method, $uri);
} catch (Throwable $ex) {
    Response::json(false, null, 'SERVER_ERROR', 'Unexpected server error', 500, ['message' => $ex->getMessage()]);
}
