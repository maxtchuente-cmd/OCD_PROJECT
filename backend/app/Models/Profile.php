<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Profile extends Model {
 protected $appends = ['avatar_url'];
 public function getAvatarUrlAttribute(): ?string { return $this->avatar_path ? url('storage/'.$this->avatar_path) : null; }
 protected $fillable = ['user_id','public_name','phone','avatar_path','country_id','city','region','nationality','professional_title','professional_category_id','bio','education_level','years_experience','available_for_work','is_public','review_status','submitted_at','reviewed_at','reviewed_by','review_note'];
 protected function casts(): array { return ['available_for_work'=>'boolean','is_public'=>'boolean','submitted_at'=>'datetime','reviewed_at'=>'datetime']; }
 public function user(): BelongsTo { return $this->belongsTo(User::class); }
 public function country(): BelongsTo { return $this->belongsTo(Country::class); }
 public function category(): BelongsTo { return $this->belongsTo(ProfessionalCategory::class,'professional_category_id'); }
 public function skills(): BelongsToMany { return $this->belongsToMany(Skill::class,'profile_skills')->withPivot('level')->withTimestamps(); }
 public function languages(): BelongsToMany { return $this->belongsToMany(Language::class,'profile_languages')->withPivot('proficiency')->withTimestamps(); }
 public function experiences(): HasMany { return $this->hasMany(ProfessionalExperience::class); }
 public function catalogImages(): HasMany { return $this->hasMany(CatalogImage::class); }
}
