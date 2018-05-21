routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/about/',
    url: './pages/about.html',
  },
  {
    path: '/profile/',
    url: './pages/profile.html',
  },

  {
    path: '/coa/',
    url: './pages/coa.html',
  },

  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/form/',
    url: './pages/form.html',
  },
  // Left View Pages
  {
    path: '/left-page-1/',
    url: './pages/left-page-1.html',
  },
  {
    path: '/left-page-2/',
    url: './pages/left-page-2.html',
  },
  // Page Loaders & Router
  {
    path: '/page-loader-template7/:user/:userId/:posts/:postId/',
    templateUrl: './pages/page-loader-template7.html',
  },
  {
    path: '/level2/:kode/',
    //componentUrl: './pages/level2.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var kode = routeTo.params.kode;
      // app.dialog.alert('Kode: '+ kode);
      
      //var rek = 
      if (!app.data.db) {
        app.dialog.alert('db not initialized!');
      } else {
        var db = app.data.db;
        db.transaction(function(tx) {
          tx.executeSql('SELECT count(*) AS recordCount FROM subrek2 where kdkel = ?', [kode], function(ignored, resultSet) {
            app.dialog.alert('RECORD COUNT: ' + resultSet.rows.item(0).recordCount);
          });
        }, function(error) {
          app.dialog.alert('SELECT count error: ' + error.message);
        });      
      }

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var rek = {
          data: [{kode: "01.01", nama: "Aktiva Lancar", dk: "D"},
                {kode:"01.02", nama:"Aktiva Tetap", dk:"D"},
                {kode:"01.03", nama:"Akm Penyusutan", dk:"K"},
                {kode:"01.04", nama:"Akm Pembebanan", dk:"K"}
                ]
                  };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/level2.html',
          },
          {
            context: {
              rek: rek,
            }
          }
        );
      }, 1000);
    },
  },
  {
    path: '/page-loader-component/:user/:userId/:posts/:postId/',
    componentUrl: './pages/page-loader-component.html',
  },
  {
    path: '/request-and-load/user/:userId/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function () {
        // We got user data from request
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            {
              title: 'Framework7 Website',
              url: 'http://framework7.io',
            },
            {
              title: 'Framework7 Forum',
              url: 'http://forum.framework7.io',
            },
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/request-and-load.html',
          },
          {
            context: {
              user: user,
            }
          }
        );
      }, 1000);
    },
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
