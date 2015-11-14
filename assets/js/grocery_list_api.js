'use strict';
var glapi = {
  gl: 'https://salty-depths-5457.herokuapp.com/',

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

    logout: function (token, user_id, callback) {
      this.ajax({
        method: 'DELETE',
        url: this.gl + '/logout/' + user_id,
        headers: {
          Authorization: 'Token token=' + token
        },
        dataType: 'json'
      }, callback);
    }
  };
