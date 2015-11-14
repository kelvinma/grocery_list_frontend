'use strict';
$(document).ready(function(){
  // Behavior JS

  $('#login').hide();
  $('#main-page').hide();

  $('#loginshow').click(function(e){
    e.preventDefault();
    $('#login').show(400);
    $('#register').hide(400);
  });

  $('#registershow').click(function(e){
    e.preventDefault();
    $('#register').show(400);
    $('#login').hide(400);
  });

  $('#recipe-create').hide();

  $('#create-recipe-prompt').click(function(){
    $('#recipe-create').show();
    $('#recipe-list').hide();
  });

  $('#singleMenuTable').hide();

});
