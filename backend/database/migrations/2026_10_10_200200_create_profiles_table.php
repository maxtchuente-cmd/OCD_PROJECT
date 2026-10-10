<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('profiles')) Schema::create('profiles', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('public_name')->nullable(); $table->string('phone', 32)->nullable(); $table->string('avatar_path')->nullable();
            $table->foreignId('country_id')->nullable()->constrained('countries')->nullOnDelete();
            $table->string('city', 120)->nullable(); $table->string('region', 120)->nullable();
            $table->string('nationality', 100)->nullable(); $table->string('professional_title', 160)->nullable();
            $table->foreignId('professional_category_id')->nullable()->constrained('professional_categories')->nullOnDelete();
            $table->text('bio')->nullable(); $table->string('education_level', 100)->nullable();
            $table->unsignedSmallInteger('years_experience')->nullable(); $table->boolean('available_for_work')->default(true);
            $table->boolean('is_public')->default(false); $table->timestamps();
        });
        if (!Schema::hasTable('profile_languages')) Schema::create('profile_languages', function (Blueprint $table) {
            $table->id(); $table->foreignId('profile_id')->constrained()->cascadeOnDelete(); $table->foreignId('language_id')->constrained()->cascadeOnDelete();
            $table->string('proficiency', 30)->default('intermediate'); $table->timestamps(); $table->unique(['profile_id','language_id']);
        });
        if (!Schema::hasTable('profile_skills')) Schema::create('profile_skills', function (Blueprint $table) {
            $table->id(); $table->foreignId('profile_id')->constrained()->cascadeOnDelete(); $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('level')->nullable(); $table->timestamps(); $table->unique(['profile_id','skill_id']);
        });
        if (!Schema::hasTable('professional_experiences')) Schema::create('professional_experiences', function (Blueprint $table) {
            $table->id(); $table->foreignId('profile_id')->constrained()->cascadeOnDelete(); $table->string('job_title', 160); $table->string('organization', 160)->nullable();
            $table->string('location', 160)->nullable(); $table->date('started_at')->nullable(); $table->date('ended_at')->nullable();
            $table->boolean('is_current')->default(false); $table->text('description')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('professional_experiences'); Schema::dropIfExists('profile_skills'); Schema::dropIfExists('profile_languages'); Schema::dropIfExists('profiles'); }
};
