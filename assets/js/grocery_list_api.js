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
      // url: 'http://httpbin.org/post',
      url: this.gl + '/users',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      // url: 'http://httpbin.org/post',
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
    $(form).find("input").each(function(index, element) {
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

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    glapi.register(credentials, callback);
    e.preventDefault();
  });

  var token;

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
      $('#login-header').hide(400);
      callback(null, data);
      token = data.user.token;
    };
    e.preventDefault();
    glapi.login(credentials, cb);
  });

// Weekly Menu JS

  var showMenus = function(error, data) {
  if (error) {
    console.error(error);
    $('#result').val('status: ' + error.status + ', error: ' +error.error);
    return;
  }
    $('#weeklymenus').html('<p>'+ JSON.stringify(data, null, 4));
  };

  $('#show-menus').on('submit', function(e) {
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    glapi.showWeeklyMenus(token, showMenus);
  });

  $('#create-menu').on('submit',function(e){
    var token = $(this).children('[name="token"]').val();
    e.preventDefault();
    glapi.createWeeklyMenu(token, showMenus);
  });

// Recipes JS

  var listRecipes = function(error, data) {
  if (error) {
    console.error(error);
    $('#result').val('status: ' + error.status + ', error: ' +error.error);
    return;
  }
    $('#recipe-list').html('<div class="clearfix"></div><h3 class="section-heading">Recipe Selection</h3>' + '<p>' + JSON.stringify(data, null, 4) + '</p>');
    $('#recipe-create').hide();
    $('#recipe-list').show();
  };

  $('#view-recipes').click(function(e){
    e.preventDefault();
    glapi.showRecipes(token, listRecipes);
  });

  $('#create-recipe').on('submit',function(e){
    // var token = $(this).children('[name="token"]').val();
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

});
