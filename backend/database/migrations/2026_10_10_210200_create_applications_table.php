<?php
use Illuminate\Database\Migrations\Migration; use Illuminate\Database\Schema\Blueprint; use Illuminate\Support\Facades\Schema;
return new class extends Migration { public function up(): void { if (!Schema::hasTable('applications')) Schema::create('applications', function(Blueprint $table){ $table->id(); $table->foreignId('opportunity_id')->constrained()->cascadeOnDelete(); $table->foreignId('user_id')->constrained()->cascadeOnDelete(); $table->text('cover_message')->nullable(); $table->string('status',24)->default('submitted')->index(); $table->timestamp('submitted_at')->nullable(); $table->timestamps(); $table->unique(['opportunity_id','user_id']); }); }
 public function down(): void { Schema::dropIfExists('applications'); } };
