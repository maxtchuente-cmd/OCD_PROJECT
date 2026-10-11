<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CatalogImage extends Model { protected $fillable=['profile_id','opportunity_id','uploaded_by','image_path','caption','is_public']; protected function casts(): array { return ['is_public'=>'boolean']; } protected $appends=['url']; public function getUrlAttribute(): string { return url('storage/'.$this->image_path); } }
