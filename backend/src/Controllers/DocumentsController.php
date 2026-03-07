<?php

namespace App\Controllers;

use App\AuthContext;
use App\Database;
use App\Response;
use App\Services\DocumentService;
use PDO;

final class DocumentsController
{
    public static function createContract(string $rentalId): void
    {
        self::createDoc($rentalId, 'contract', 'CON');
    }

    public static function createInvoice(string $rentalId): void
    {
        self::createDoc($rentalId, 'invoice', 'INV');
    }

    private static function createDoc(string $rentalId, string $type, string $prefix): void
    {
        $pdo = Database::connect();
        $stmt = $pdo->prepare(
            "SELECT r.*, c.brand, c.model, c.plate_number, u.first_name, u.last_name, u.email
             FROM rentals r
             JOIN cars c ON c.id = r.car_id
             JOIN users u ON u.id = r.user_id
             WHERE r.id = ?"
        );
        $stmt->execute([$rentalId]);
        $rental = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$rental) {
            Response::json(false, null, 'NOT_FOUND', 'Rental not found', 404);
        }

        if ($rental['status'] !== 'confirmed') {
            Response::json(false, null, 'INVALID_STATE', 'Documents can only be generated for confirmed rentals', 409);
        }

        $docNumber = DocumentService::createNumber($prefix);
        $fileName = $docNumber . '.pdf';
        $storagePath = dirname(__DIR__, 2) . '/storage/documents/' . $fileName;

        $payload = [
            'Document Number' => $docNumber,
            'Rental ID' => $rental['id'],
            'Customer' => $rental['first_name'] . ' ' . $rental['last_name'],
            'Email' => $rental['email'],
            'Car' => $rental['brand'] . ' ' . $rental['model'] . ' (' . $rental['plate_number'] . ')',
            'Start Date' => $rental['start_date'],
            'End Date' => $rental['end_date'],
            'Daily Price' => $rental['daily_price'],
            'Total Price' => $rental['total_price'],
        ];

        DocumentService::generatePdf(strtoupper($type) . ' DOCUMENT', $payload, $storagePath);

        $stmt = $pdo->prepare(
            'INSERT INTO documents (rental_id, doc_type, doc_number, file_url, signature_status)
             VALUES (?, ?, ?, ?, \'blank\')'
        );
        $stmt->execute([
            $rental['id'],
            $type,
            $docNumber,
            '/storage/documents/' . $fileName,
        ]);

        Response::json(true, ['id' => (int) $pdo->lastInsertId(), 'doc_number' => $docNumber]);
    }

    public static function download(string $id): void
    {
        $user = AuthContext::user();
        if (!$user) {
            Response::json(false, null, 'UNAUTHORIZED', 'Authentication required', 401);
        }

        $pdo = Database::connect();
        $stmt = $pdo->prepare(
            "SELECT d.*, r.user_id
             FROM documents d
             JOIN rentals r ON r.id = d.rental_id
             WHERE d.id = ?"
        );
        $stmt->execute([$id]);
        $doc = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$doc) {
            Response::json(false, null, 'NOT_FOUND', 'Document not found', 404);
        }

        if ($user['role'] !== 'admin' && (int) $doc['user_id'] !== (int) $user['id']) {
            Response::json(false, null, 'FORBIDDEN', 'Access denied', 403);
        }

        $path = dirname(__DIR__, 2) . $doc['file_url'];
        if (!file_exists($path)) {
            Response::json(false, null, 'NOT_FOUND', 'File missing', 404);
        }

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="' . basename($path) . '"');
        readfile($path);
        exit;
    }
}
