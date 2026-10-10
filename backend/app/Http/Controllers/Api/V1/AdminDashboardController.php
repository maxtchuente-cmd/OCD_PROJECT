<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Opportunity;
use App\Models\Profile;
use App\Models\User;
use App\Models\Testimonial;
use App\Models\OcdNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class AdminDashboardController extends Controller {
 public function stats(Request $request) {
  $now=now(); $monthStart=$now->copy()->startOfMonth(); $weekStart=$now->copy()->startOfWeek();
  $recent=Application::with(['user:id,name,email','opportunity:id,title,category'])->latest('submitted_at')->limit(30)->get()->map(fn($a)=>['id'=>$a->id,'name'=>$a->user?->name ?? 'Compte supprimé','email'=>$a->user?->email,'opportunity'=>$a->opportunity?->title ?? 'Offre supprimée','category'=>$a->opportunity?->category,'status'=>$a->status,'submitted_at'=>$a->submitted_at]);
  return response()->json(['data'=>[
   'users_total'=>User::where('account_type','!=','admin')->count(),'opportunities_total'=>Opportunity::count(),'published_total'=>Opportunity::where('status','published')->count(),'pending_total'=>Opportunity::whereIn('status',['pending_review','changes_requested'])->count(),
   'applications_month'=>Application::where('submitted_at','>=',$monthStart)->count(),'applications_week'=>Application::where('submitted_at','>=',$weekStart)->count(),
   'applications_by_category'=>Application::query()->join('opportunities','applications.opportunity_id','=','opportunities.id')->where('applications.submitted_at','>=',$monthStart)->select('opportunities.category',DB::raw('COUNT(applications.id) as total'))->groupBy('opportunities.category')->orderByDesc('total')->get(),
   'applications_by_status'=>Application::query()->select('status',DB::raw('COUNT(*) as total'))->groupBy('status')->orderByDesc('total')->get(),
   'users_this_month'=>User::where('account_type','!=','admin')->where('created_at','>=',$monthStart)->count(),
   'users_this_week'=>User::where('account_type','!=','admin')->where('created_at','>=',$weekStart)->count(),
   'users_active_30d'=>Profile::where('review_status','approved')->whereHas('user',fn($q)=>$q->where('account_type','!=','admin'))->count(),
   'users_inactive_30d'=>max(0,User::where('account_type','!=','admin')->count()-Profile::where('review_status','approved')->whereHas('user',fn($q)=>$q->where('account_type','!=','admin'))->count()),
   'profiles_pending'=>Profile::where('review_status','pending')->count(),
   'testimonials_total'=>Testimonial::count(),
   'testimonials_published'=>Testimonial::where('is_published',true)->count(),
   'testimonials_pending'=>Testimonial::where('is_published',false)->count(),
   'notifications_total'=>OcdNotification::count(),
   'notifications_unread'=>OcdNotification::whereNull('read_at')->count(),
   'applications_last_7_days'=>collect(range(6,0))->map(function($days) { $date=now()->subDays($days); return ['date'=>$date->format('Y-m-d'),'label'=>$date->locale('fr')->isoFormat('ddd D'),'total'=>Application::whereDate('submitted_at',$date->toDateString())->count()]; }),
   'users_last_7_days'=>collect(range(6,0))->map(function($days) { $date=now()->subDays($days); return ['date'=>$date->format('Y-m-d'),'label'=>$date->locale('fr')->isoFormat('ddd D'),'total'=>User::where('account_type','!=','admin')->whereDate('created_at',$date->toDateString())->count()]; }),
   'recent_applications'=>$recent,
  ]]);
 }
 public function members(Request $request) {
  $q=User::query()->with(['profile.country:id,name','profile.category:id,name'])->where('account_type','!=','admin');
  if($request->filled('q')) { $term=trim((string)$request->query('q')); $q->where(fn($w)=>$w->where('name','like',"%$term%")->orWhere('email','like',"%$term%")); }
  if($request->filled('country')) { $country=trim((string)$request->query('country')); $q->whereHas('profile.country',fn($w)=>$w->where('name','like',"%$country%")); }
  if($request->filled('city')) { $city=trim((string)$request->query('city')); $q->whereHas('profile',fn($w)=>$w->where('city','like',"%$city%")); }
  if($request->filled('domain')) { $domain=trim((string)$request->query('domain')); $q->whereHas('profile.category',fn($w)=>$w->where('name','like',"%$domain%")); }
  if($request->filled('review_status')) { $status=(string)$request->query('review_status'); $q->whereHas('profile',fn($w)=>$w->where('review_status',$status)); }
  return response()->json($q->latest()->paginate(min(100,max(1,(int)$request->query('per_page',50)))));
 }

}
