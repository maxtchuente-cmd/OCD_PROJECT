<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\Language;
use App\Models\ProfessionalCategory;
use App\Models\Skill;
use Illuminate\Http\Request;
class ReferenceController extends Controller { public function countries(){return response()->json(['data'=>Country::where('is_active',true)->orderBy('name')->get(['id','iso2','name','phone_code','currency_code'])]);} public function languages(){return response()->json(['data'=>Language::where('is_active',true)->orderBy('name')->get(['id','code','name'])]);} public function categories(){return response()->json(['data'=>ProfessionalCategory::where('is_active',true)->orderBy('name')->get(['id','slug','name','description'])]);} public function skills(Request $request){$q=trim((string)$request->query('q',''));return response()->json(['data'=>Skill::query()->when($q,fn($query)=>$query->where('name','like','%'.$q.'%'))->orderBy('name')->limit(100)->get(['id','name'])]);} }
