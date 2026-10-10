<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Country extends Model { protected $fillable = ['iso2','iso3','name','phone_code','currency_code','is_active']; protected function casts(): array { return ['is_active'=>'boolean']; } }
