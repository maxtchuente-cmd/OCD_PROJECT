<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up(): void { if (Schema::hasTable('testimonials') && !Schema::hasColumn('testimonials','rating')) Schema::table('testimonials', function(Blueprint $table) { $table->unsignedTinyInteger('rating')->default(5); }); } public function down(): void { if (Schema::hasTable('testimonials') && Schema::hasColumn('testimonials','rating')) Schema::table('testimonials', fn(Blueprint $table) => $table->dropColumn('rating')); } };
