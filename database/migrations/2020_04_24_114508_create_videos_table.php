<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVideosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner');
            $table->string('title', 255);
            $table->text('description');
            $table->bigInteger('watch_count')
                ->default(0);
            $table->string('location', 200);
            $table->string('thumbnail', 200)
                ->nullable(true); // TODO Change this so it's not nullable after finished implementing
            $table->integer('duration')
                ->nullable(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('videos');
    }
}
