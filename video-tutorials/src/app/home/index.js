const express = require('express');
const camelCaseKeys = require('camelcase-keys')

function createHandlers({ queries }) {
  function home(req, res, next) {
    return queries
      .loadHomePage()
      .then((viewData) => res.render('home/templates/home', viewData.pageData))
      .catch(next);
  }
  return {
    home,
  };
}

function createQueries({ db }) {
  function loadHomePage() {
    return db.then(client =>
      client('pages')
        .where({ page_name: 'home' })
        .limit(1)
        .then(camelCaseKeys)
        .then(rows => rows[0])
    );
  }
  return {
    loadHomePage,
  };
}

function createHome({ db }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });

  const router = express.Router();

  router.route('/').get(handlers.home);

  return { handlers, queries, router };
}

module.exports = createHome;
