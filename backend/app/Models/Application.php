<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model; use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Application extends Model { protected $fillable=['opportunity_id','user_id','cover_message','status','submitted_at']; protected function casts(): array { return ['submitted_at'=>'datetime']; } public function opportunity(): BelongsTo { return $this->belongsTo(Opportunity::class); } public function user(): BelongsTo { return $this->belongsTo(User::class); } }
