<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Testimonial extends Model { protected $fillable=['person_name','role_or_location','quote','opportunity_type','rating','is_published','sort_order']; protected function casts(): array {return ['is_published'=>'boolean','rating'=>'integer'];} }
