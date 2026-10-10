<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ProfessionalCategory extends Model { protected $fillable = ['slug','name','description','is_active']; protected function casts(): array { return ['is_active'=>'boolean']; } }
