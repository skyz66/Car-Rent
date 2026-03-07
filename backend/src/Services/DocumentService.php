<?php

namespace App\Services;

use Dompdf\Dompdf;

final class DocumentService
{
    public static function generatePdf(string $title, array $payload, string $path): void
    {
        $dompdf = new Dompdf();
        $html = self::template($title, $payload);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        file_put_contents($path, $dompdf->output());
    }

    public static function createNumber(string $prefix): string
    {
        $date = date('Ymd');
        $rand = strtoupper(bin2hex(random_bytes(3)));
        return $prefix . '-' . $date . '-' . $rand;
    }

    private static function template(string $title, array $payload): string
    {
        $rows = '';
        foreach ($payload as $label => $value) {
            $rows .= "<tr><td style='padding:6px 0;'><strong>{$label}</strong></td><td style='padding:6px 0;'>{$value}</td></tr>";
        }

        return "
        <html>
        <head>
          <style>
            body { font-family: DejaVu Sans, sans-serif; color: #0a0e1a; }
            .header { display:flex; justify-content:space-between; align-items:center; }
            .title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
            .box { border: 1px solid #d0d6e4; padding: 16px; border-radius: 8px; }
            .signature { margin-top: 32px; border: 2px dashed #c4c8d4; height: 90px; border-radius: 8px; }
            table { width: 100%; }
          </style>
        </head>
        <body>
          <div class='header'>
            <div>
              <div class='title'>{$title}</div>
              <div>Generated at: " . date('Y-m-d H:i') . "</div>
            </div>
            <div>Car Rental Agency</div>
          </div>
          <div class='box' style='margin-top:16px;'>
            <table>{$rows}</table>
          </div>
          <div style='margin-top:24px;'>Signature</div>
          <div class='signature'></div>
        </body>
        </html>
        ";
    }
}
