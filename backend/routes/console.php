<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Promotion explicite d'un compte existant en administrateur OCD.
// Usage : php artisan ocd:make-admin adresse@example.com
\Illuminate\Support\Facades\Artisan::command('ocd:make-admin {email}', function (string $email) {
    $user = \App\Models\User::where('email', mb_strtolower($email))->first();
    if (! $user) {
        $this->error('Aucun compte ne correspond à cet e-mail. Créez d’abord le compte depuis l’interface publique.');
        return self::FAILURE;
    }
    if ($user->account_type === 'admin') {
        $this->info('Ce compte est déjà administrateur OCD.');
        return self::SUCCESS;
    }
    if (! $this->confirm("Promouvoir {$user->email} en administrateur OCD ?", false)) {
        $this->warn('Opération annulée.');
        return self::FAILURE;
    }
    $user->forceFill(['account_type' => 'admin'])->save();
    $this->info('Compte promu administrateur. Déconnectez-vous puis reconnectez-vous dans l’interface OCD.');
    return self::SUCCESS;
})->purpose('Promouvoir explicitement un compte existant en administrateur OCD');
