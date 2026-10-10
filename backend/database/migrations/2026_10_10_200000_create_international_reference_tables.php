<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('countries')) Schema::create('countries', function (Blueprint $table) {
            $table->id(); $table->char('iso2', 2)->unique(); $table->string('iso3', 3)->nullable()->unique();
            $table->string('name'); $table->string('phone_code', 12)->nullable(); $table->string('currency_code', 3)->nullable();
            $table->boolean('is_active')->default(true); $table->timestamps();
        });
        if (!Schema::hasTable('languages')) Schema::create('languages', function (Blueprint $table) {
            $table->id(); $table->string('code', 10)->unique(); $table->string('name'); $table->boolean('is_active')->default(true); $table->timestamps();
        });
        if (!Schema::hasTable('professional_categories')) Schema::create('professional_categories', function (Blueprint $table) {
            $table->id(); $table->string('slug')->unique(); $table->string('name'); $table->text('description')->nullable();
            $table->boolean('is_active')->default(true); $table->timestamps();
        });
        if (!Schema::hasTable('skills')) Schema::create('skills', function (Blueprint $table) {
            $table->id(); $table->string('name')->unique(); $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('skills'); Schema::dropIfExists('professional_categories');
        Schema::dropIfExists('languages'); Schema::dropIfExists('countries');
    }
};
