@component('mail::message')

Hello {{$username}},

Thank you for signing up for VideoTube

Please verify your email here:
@component('mail::button', ['url' => $link])
Verify email
@endcomponent

Sincerely,
VideoTube team
@endcomponent