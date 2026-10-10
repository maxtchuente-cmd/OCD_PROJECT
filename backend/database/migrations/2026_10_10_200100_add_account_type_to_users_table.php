<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void { if (Schema::hasTable('users') && !Schema::hasColumn('users', 'account_type')) Schema::table('users', function (Blueprint $table) { $table->string('account_type', 40)->default('candidate')->index(); }); }
    public function down(): void { if (Schema::hasTable('users') && Schema::hasColumn('users', 'account_type')) Schema::table('users', function (Blueprint $table) { $table->dropColumn('account_type'); }); }
};
