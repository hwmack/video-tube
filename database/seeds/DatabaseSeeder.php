<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        /* Never allow running in production */
        $env = env('APP_ENV', 'local');
        if ($env == 'prod') {
            return;
        }

        // Seed a verified default user for testing purposes
        $this->call(UserSeeder::class);
    }
}
