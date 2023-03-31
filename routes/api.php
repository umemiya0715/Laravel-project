<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['middleware' => 'api'], function(){
    Route::post('posts', 'App\Http\Controllers\Api\ScheduleController@scheduleIndex');
    Route::post('posts/create', 'App\Http\Controllers\Api\ScheduleController@create');
    Route::post('edit', 'App\Http\Controllers\Api\ScheduleController@edit');
    Route::post('update', 'App\Http\Controllers\Api\ScheduleController@update');
});
