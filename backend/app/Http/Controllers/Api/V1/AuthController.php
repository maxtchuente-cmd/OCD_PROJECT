<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Resources\Api\V1\ProfileResource;
use App\Services\Accounts\AccountService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class AuthController extends Controller {
 public function register(RegisterRequest $request, AccountService $accounts): JsonResponse { $user=$accounts->register($request->validated()); $token=$user->createToken('ocd-web')->plainTextToken; return response()->json(['message'=>'Compte créé avec succès.','token'=>$token,'user'=>$user,'profile'=>(new ProfileResource($user->profile))->resolve()],201); }
 public function login(LoginRequest $request): JsonResponse { $data=$request->validated(); $user=\App\Models\User::where('email',mb_strtolower($data['email']))->first(); if (!$user || !Hash::check($data['password'],$user->password)) return response()->json(['message'=>'Identifiants incorrects.'],422); $token=$user->createToken('ocd-web')->plainTextToken; return response()->json(['token'=>$token,'user'=>$user,'profile'=>(new ProfileResource($user->load('profile')->profile))->resolve()]); }
 public function me(Request $request): JsonResponse { $user=$request->user()->load(['profile.country','profile.category','profile.skills','profile.languages','profile.experiences']); return response()->json(['user'=>$user,'profile'=>(new ProfileResource($user->profile))->resolve()]); }
 public function logout(Request $request): JsonResponse { $request->user()->currentAccessToken()?->delete(); return response()->json(['message'=>'Session fermée.']); }
}
