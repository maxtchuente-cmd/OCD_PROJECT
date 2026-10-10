<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ProfessionalExperience extends Model { protected $fillable = ['profile_id','job_title','organization','location','started_at','ended_at','is_current','description']; protected function casts(): array { return ['started_at'=>'date','ended_at'=>'date','is_current'=>'boolean']; } public function profile(): BelongsTo { return $this->belongsTo(Profile::class); } }
