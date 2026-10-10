<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { if (Schema::hasTable('users')) Schema::table('users', function(Blueprint $table) { if (!Schema::hasColumn('users','email_notifications')) $table->boolean('email_notifications')->default(true); if (!Schema::hasColumn('users','opportunity_alerts')) $table->boolean('opportunity_alerts')->default(true); }); }
 public function down(): void { if (Schema::hasTable('users')) Schema::table('users', function(Blueprint $table) { if (Schema::hasColumn('users','email_notifications')) $table->dropColumn('email_notifications'); if (Schema::hasColumn('users','opportunity_alerts')) $table->dropColumn('opportunity_alerts'); }); }
};
