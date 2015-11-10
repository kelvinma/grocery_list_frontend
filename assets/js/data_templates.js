'use strict';
var recipeTemplate = function(recipe){
  return '<h3>' + recipe.name + '</h3>' + '<p>' + recipe.description + '</p>' + '<p>' + recipe.instructions + '</p>';
};


var recipeBrief;
var recipeIndex;
$(document).ready(function(){

  recipeBrief = Handlebars.compile($('#recipe-brief').html());

  // showMovieTemplate = Handlebars.compile($('#movie-show').html());
  recipesIndex = Handlebars.compile($('#recipes-index').html());
});

$("#load-movies").on('click', function(event){
  $.ajax({
    // DO NOT CHANGE THIS URL
    url: 'https://localhost:3000'
  }).done(function(data){
      var recipeHTML = recipesIndex({recipes: data});
    $('#recipe-list').html(recipeHTML);
  }).fail(function(data){
    console.error(data);
  });
});
