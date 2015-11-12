'use strict';
var glapi = {
  gl: 'http://localhost:3000',

  ajax: function(config, cb) {
      $.ajax(config).done(function(data, textStatus, jqxhr) {
        cb(null, data);
        }).fail(function(jqxhr, status, error) {
        cb({jqxher: jqxhr, status: status, error: error});
        });
    },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.gl + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
    },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.gl + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },
    //Authenticated WEEKLY MENU actions

  showWeeklyMenus: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.gl + '/weekly_menus',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

      }, callback);
    },
  showWeeklyMenu: function(token, weekly_menu_id, callback) {
    this.ajax({
      method: 'GET',
      url: this.gl + '/weekly_menus/' + weekly_menu_id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

      }, callback);
    },

  createWeeklyMenu: function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.gl + '/weekly_menus',
      data: { weekly_menu: {
        week_of: $('#week_of').val() }
      },
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

  createMeal: function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.gl + '/meals',
      data: { meal: {
        weekly_menu_id: $('#current-menu').val(),
        recipe_id: $('#allRecipes').val() }
      },
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },
  deleteMeal: function (token, meal_id, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.gl + '/meals/' + $('#singleMenu').val(),
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

  showRecipes: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.gl + '/recipes',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

  showRecipe: function (token, recipe_id, callback) {
    this.ajax({
      method: 'GET',
      url: this.gl + '/recipes/' + recipe_id,
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

  createRecipe: function (token, callback) {
    this.ajax({
      method: 'POST',
      url: this.gl + '/recipes',
      data: { recipe: {
        name: $('#recipe-name').val(),
        which_meal: $('#which_meal').val(),
        style: $('#recipe-style').val(),
        description: $('#recipe-description').val(),
        instructions: $('#recipe-instructions').val() }
      },
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

    updateRecipe: function (token, recipe_id, callback) {
    this.ajax({
      method: 'PATCH',
      url: this.gl + '/recipes' + recipe_id,
      data: { recipe: {
        name: $('#recipe-name').val(),
        which_meal: $('#which_meal').val(),
        style: $('#recipe-style').val(),
        description: $('#recipe-description').val(),
        instructions: $('#recipe-instructions').val() }
      },
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

    //Authenticated Grocery List Actions

  showGroceries: function (token, callback) {
    this.ajax({
      method: 'GET',
      url: this.gl + '/groceries',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'

    }, callback);
  },

  logout: function (token, callback) {
    this.ajax({
    method: 'DELETE',
    url: this.gl + '/users/',
    headers: {
      Authorization: 'Token token=' + token
    },
    dataType: 'json'
    }, callback);
  }
};

$(function() {
  var form2object = function(form) {
    var data = {};
    $(form).find('input').each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };
  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    glapi.register(credentials, function(error, data){
        if (error) {
          alert('Registration Failed');
        return;
      }
        alert('Success!');
        $('#login').show(400);
        $('#register').hide(400);
    });
    e.preventDefault();
  });

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        alert('Login Failed');
        return;
      }
      $('#login-header').hide(500);
      $('#main-page').show();
      window.scrollTo(0, 0);
      $('.token').val(data.user.token);
      var token = $('.token').val();
      glapi.showRecipes(token, listRecipes);
      glapi.showWeeklyMenus(token, indexMenus);
    };
    e.preventDefault();
    glapi.login(credentials, cb);

  });

  // Weekly Menu JS

  var menuTemplate = Handlebars.compile($('#menus-index').html());

  var indexMenus = function(error, data) {
    if (error) {
      console.error(error);
      return;
    }
      var menuHTML = menuTemplate({weekly_menus: data.weekly_menus});
      $('#allMenus').html(menuHTML);
  };

  $('#show-menus').on('submit', function(e) {
    var token = $('.token').val();
    e.preventDefault();
    glapi.showWeeklyMenus(token, indexMenus);
      $('#singleMenuTable').hide();
      $('#allMenus').show();
  });

  $('#create-menu').on('submit',function(e){
    var token = $('.token').val();
    e.preventDefault();
    glapi.createWeeklyMenu(token, indexMenus);
  });

  // Meals JS

  var singleMenuTemplate = Handlebars.compile($('#single-menu-template').html());

  var singleMenu = function(error, data) {
    if (error) {
      console.error(error);
      return;
    }
      console.log(data.weekly_menu.meals);
      var singleMenuHTML = singleMenuTemplate({meals: data.weekly_menu.meals});
      $('#singleMenu').html(singleMenuHTML);
  };

  $('#allMenus').on('click', '.show-single-menu', function(e){
    var menu_id = this.dataset.menu;
    $('#current-menu').html(this.dataset.week);
    $('#current-menu').val(this.dataset.menu);
    var token = $('.token').val();
    e.preventDefault();
    glapi.showWeeklyMenu(token, menu_id, singleMenu);
    $('#singleMenuTable').show();
    $('#allMenus').hide();
    });

  // Recipes JS

  // Create Meals - Adds Recipes to Weekly Menu in the form of Meals


  $('#allRecipes').on('click','.add-recipe', function(){
    var token = $('.token').val();
    $('#allRecipes').val(this.dataset.recipe);
    glapi.createMeal(token, function(error){
      if (error) {
        console.error(error);
        return;
      }
    });
      var menu_id = $('#current-menu').val();
      glapi.showWeeklyMenu(token, menu_id, singleMenu);
    });

    // Delete Meals

    $('#singleMenuTable').on('click', '.delete-meal', function(e){
    var meal_id = this.dataset.meal;
    $('#singleMenu').val(meal_id);
    var token = $('.token').val();
    e.preventDefault();
    glapi.deleteMeal(token, meal_id, function(error){
      if (error) {
        console.error(error);
        return;
      }
    });
      var menu_id = $('#current-menu').val();
      glapi.showWeeklyMenu(token, menu_id, singleMenu);
    });

  // HandleBars

  Handlebars.registerHelper('ifAvailable', function (conditionalVariable, options){
     if (conditionalVariable === options.hash.value) {
       return options.fn(this);
     } else {
       return options.inverse(this);
     }
   });

  var recipesTemplate = Handlebars.compile($('#recipes-index').html());

  var listRecipes = function(error, data) {
    if (error) {
      console.error(error);
      return;
    }
    var recipeHTML = recipesTemplate({recipes: data.recipes});
      $('#allRecipes').html(recipeHTML);
      $('#recipe-create').hide();
      $('#recipe-list').show();
  };

  $('#view-recipes').click(function(e){
    var token = $('.token').val();
    e.preventDefault();
    glapi.showRecipes(token, listRecipes);
  });

  $('#singleMenuTable, #allRecipes').on('click', '.single-recipe', function(e){
    var recipe_id = this.dataset.recipe;
    var token = $('.token').val();
    e.preventDefault();
    glapi.showRecipe(token, recipe_id, showSingleRecipe);
    // $('#singleMenuTable').show();
    // $('#allMenus').hide();
    });

  var singleRecipeTemplate = Handlebars.compile($('#single-recipe-template').html());

  var showSingleRecipe = function(error,data) {
    if (error){
      console.error(error);
      return;
    }
    console.log(data.recipe);
    var recipeHTML = singleRecipeTemplate(data.recipe);
      $('#single-recipe').html(recipeHTML);
  };

Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<li>');
    return new Handlebars.SafeString(text);
});


  $('#create-recipe').on('submit',function(e){
    var token = $('.token').val();
    e.preventDefault();
    glapi.createRecipe(token, listRecipes);
  });

  //Grocery List JS

  $('#show-groceries').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    var showGroceries = function(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#grocerylist').html('<p>' + JSON.stringify(data, null, 4));
  };
    glapi.showGroceries(token, showGroceries);
  });

  $('#logout').on('submit', function(e) {
    // var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    glapi.logout(token, callback);
  });

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
