<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    private $address;
    private $username;
    /**
     * @var string
     */
    public $link;

    /**
     * Create a new message instance.
     *
     * @param $user
     */
    public function __construct($user)
    {
        $this->address = $user->email;
        $this->username = $user->username;
        $this->link = URL::signedRoute('verify', [
            'id' => $user->id,
            'hash' => sha1($user->getEmailForVerification())
        ]);
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = 'VideoTube: Verify Email';

        return $this
            ->to($this->address)
            ->subject($subject)
            ->markdown('emails.verifyemail')
            ->with([
                'username' => $this->username,
                'link' => $this->link
            ]);
    }
}
