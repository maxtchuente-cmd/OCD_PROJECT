<?php
namespace App\Http\Requests\Api\V1\Auth;
use Illuminate\Foundation\Http\FormRequest;
class RegisterRequest extends FormRequest { public function authorize(): bool { return true; } public function rules(): array { return ['name'=>['required','string','max:120'],'email'=>['required','email:rfc','max:190','unique:users,email'],'password'=>['required','string','min:10','confirmed'],'account_type'=>['sometimes','in:candidate,professional,freelancer,entrepreneur,organization'],'email_notifications'=>['sometimes','boolean'],'opportunity_alerts'=>['sometimes','boolean']]; } }
