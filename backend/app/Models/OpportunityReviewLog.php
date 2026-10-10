<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo;
class OpportunityReviewLog extends Model { protected $fillable=['opportunity_id','reviewer_id','action','note','metadata']; protected function casts(): array { return ['metadata'=>'array']; } public function opportunity(): BelongsTo { return $this->belongsTo(Opportunity::class); } public function reviewer(): BelongsTo { return $this->belongsTo(User::class,'reviewer_id'); } }