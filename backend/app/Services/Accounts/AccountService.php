<?php
namespace App\Services\Accounts;
use App\Models\User;
use Illuminate\Support\Facades\DB;
class AccountService {
 public function register(array $data): User { return DB::transaction(function () use ($data) { $user = User::create(['name'=>$data['name'],'email'=>mb_strtolower($data['email']),'password'=>$data['password'],'account_type'=>$data['account_type'] ?? 'candidate','email_notifications'=>$data['email_notifications'] ?? true,'opportunity_alerts'=>$data['opportunity_alerts'] ?? true]); $user->profile()->create(['public_name'=>$data['name']]); return $user->load('profile'); }); }
}
