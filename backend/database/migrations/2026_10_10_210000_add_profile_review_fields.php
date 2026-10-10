<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void { if (Schema::hasTable('profiles')) Schema::table('profiles', function(Blueprint $table) {
  if (!Schema::hasColumn('profiles','review_status')) $table->string('review_status',24)->default('draft')->index();
  if (!Schema::hasColumn('profiles','submitted_at')) $table->timestamp('submitted_at')->nullable();
  if (!Schema::hasColumn('profiles','reviewed_at')) $table->timestamp('reviewed_at')->nullable();
  if (!Schema::hasColumn('profiles','reviewed_by')) $table->unsignedBigInteger('reviewed_by')->nullable()->index();
  if (!Schema::hasColumn('profiles','review_note')) $table->text('review_note')->nullable();
 }); }
 public function down(): void { if (Schema::hasTable('profiles')) Schema::table('profiles', function(Blueprint $table) { foreach(['review_status','submitted_at','reviewed_at','reviewed_by','review_note'] as $column) if(Schema::hasColumn('profiles',$column)) $table->dropColumn($column); }); }
};
