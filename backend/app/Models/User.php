<?php
namespace App\Models;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne; use Illuminate\Database\Eloquent\Relations\HasMany;
#[Fillable(['name', 'email', 'password', 'account_type', 'email_notifications', 'opportunity_alerts'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable { use HasApiTokens, HasFactory, Notifiable; protected function casts(): array { return ['email_verified_at'=>'datetime','password'=>'hashed','email_notifications'=>'boolean','opportunity_alerts'=>'boolean']; } public function profile(): HasOne { return $this->hasOne(Profile::class); } public function applications(): HasMany { return $this->hasMany(Application::class); } public function opportunities(): HasMany { return $this->hasMany(Opportunity::class); } public function savedOpportunities(): HasMany { return $this->hasMany(SavedOpportunity::class); } public function ocdNotifications(): HasMany { return $this->hasMany(OcdNotification::class); } public function reports(): HasMany { return $this->hasMany(Report::class, 'reporter_id'); } }
