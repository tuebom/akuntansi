// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.redagro', // App bundle ID
  name: 'RedAgro', // App name
  theme: 'auto', // Automatic theme detection
  init: true,
  initOnDeviceReady: true,
  // App root data
  data: function () {
    return {
      db: null,
      mbrid: null,
      nohp: '',
      pin: '',
      saldo: 0,
      poin: 0,
      bonus: 0,
      currentDate: null,
      token: null,
      push: null
    };
  },
  // App root methods
  methods: {
    // helloWorld: function () {
      // app.dialog.alert('Hello World!');
    // },
  },
  on: {
    init: function () {

      /*function copyDatabaseFile(dbName) {

        var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
        var targetDirName = cordova.file.dataDirectory;

        return Promise.all([
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
          }),
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(targetDirName, resolve, reject);
          })
        ]).then(function (files) {
          var sourceFile = files[0];
          var targetDir = files[1];
          return new Promise(function (resolve, reject) {
            targetDir.getFile(dbName, {}, resolve, reject);
          }).then(function () {
            console.log("file already copied");
          }).catch(function () {
            console.log("file doesn't exist, copying it");
            return new Promise(function (resolve, reject) {
              sourceFile.copyTo(targetDir, dbName, resolve, reject);
            }).then(function () {
              console.log("database file copied");
            });
          });
        });
      }*/

      // copyDatabaseFile('acc.db').then(function () {
        // // success! :)
        // app.data.db = window.sqlitePlugin.openDatabase({name: 'acc.db'});
/*         var currentDate = new Date();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        
        var db = app.data.db;
        
        db.transaction(function(tx) {
          tx.executeSql('insert into setup (nama, bulan, tahun) values (?, ?, ?);', ['Nama Usaha Anda',month,year]);
        }, function(error) {
          app.dialog.alert('insert error: ' + error.message);
        });      
 */        
      // }).catch(function (err) {
        // // error! :(
        // console.log(err);
      // });
      
      $$('#my-login-screen [name="mbrid"]').val(localStorage.getItem('mbrid'));
      $$('#my-login-screen [name="nohp"]').val(localStorage.getItem('nohp'));
      
      app.data.push = PushNotification.init({
        "android": {
            "senderID": "857182253756" //"597497239727"
        },
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
      });

      var push = app.data.push;

      push.on('registration', function(data) {

        var oldRegId = localStorage.getItem('RegId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('RegId', data.registrationId);
            // Post registrationId to your app server as the value has changed
        }

      });

      push.on('notification', function(data) {
          
          app.dialog.alert(data.message, data.title);
      });
    },     
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});

// Init/Create left panel view
var mainView = app.views.create('.view-left', {
  url: '/'
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

var swiper = app.swiper.create('.swiper-container', {
    speed: 400,
    //slidesPerView: auto,
    loop: true,
    //autoHeight: true,
    shortSwipes: false,
    longSwipes: false,
    //effect:'fade'
    //spaceBetween: 100
});

swiper.autoplay.start();


// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  
  var mbrid = $$('#my-login-screen [name="mbrid"]').val();
  var nohp = $$('#my-login-screen [name="nohp"]').val();
  var pin = $$('#my-login-screen [name="pin"]').val();
  
  if (mbrid == '') {
      app.dialog.alert('Masukkan ID member anda.', 'Login Member');
      return;
  } else
  if (nohp == '') {
      app.dialog.alert('Masukkan nomor handphone anda.', 'Login Member');
      return;
  } else
  if (pin == '') {
      app.dialog.alert('Masukkan nomor PIN anda.', 'Login Member');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.login-form');

  var regId = localStorage.getItem('RegId');
  formData.gcmid = regId;

  // app.request.setup({
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'origin, content-type, accept',
  //     'content-type': 'application/x-www-form-urlencoded',
  //     'server': 'Apache/2.4.7 (Win32) OpenSSL/1.0.1e PHP/5.6.12'
  //   }
  // })
  
  // http://212.24.111.23/
  app.request.post('http://212.24.111.23/redagro/auth/login', formData, function (res) {
    
    app.preloader.hide();
    var data = JSON.parse(res);

    if (data.status) {
    
      localStorage.setItem('mbrid', mbrid);
      localStorage.setItem('nohp', nohp);
      // console.log('localStorage.setItem')

      app.loginScreen.close('#my-login-screen');
      
      app.data.mbrid = mbrid;
      app.data.nohp = nohp;
      app.data.pin = pin;
      app.data.token = data.token;
      
      // kosongkan isian nomor pin
      $$('#my-login-screen [name="pin"]').val('');
      
      //console.log('Token: ' + app.data.token);
      //localStorage.setItem('token', data.token);

      app.request.get('http://212.24.111.23/redagro/member/saldo/'+mbrid, function (res) {
          
        var data = JSON.parse(res);
    
        if (data.status) {
          $$('.saldo').text(data.saldo);
          app.data.saldo = data.saldo;
        } else {
          app.dialog.alert(data.message, 'Akun Saya');
        }
      });

    } else {
      app.dialog.alert(data.message, 'Login Member');
    }
  });
});

$$('a.label-register').on('click', function () {
  // Close login screen
  app.loginScreen.close('#my-login-screen');
  app.loginScreen.open('#my-reg-screen');
});


// Registrasi member
$$('#my-reg-screen .register-button').on('click', function () {
  
  var nama = $$('#my-reg-screen [name="nama"]').val();
  if (nama == '') {
      app.dialog.alert('Masukkan nama lengkap anda.', 'Registrasi Member');
      return;
  }
  
  var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
  var namax = nama.trim().match(rgx_nama);
  if (!namax) {
    app.dialog.alert('Input data nama belum benar.', 'Registrasi Member');
    return;
  }

  var nohp = $$('#my-reg-screen [name="nohp"]').val();
  if (nohp == '') {
      app.dialog.alert('Masukkan nomor handphone.', 'Registrasi Member');
      return;
  }

  var rgx_nohp = /[08][0-9]{9,}/;
  var nohpx = nohp.trim().match(rgx_nohp);
  if (!nohpx) {
    app.dialog.alert('Input data nomor hp belum benar.', 'Registrasi Member');
    return;
  }

  app.preloader.show();
  
  var regId = localStorage.getItem('RegId');
  var formData = app.form.convertToData('.register-form');

  formData.mbrid = 1;
  formData.gcmid = regId;
  
  app.request.post('http://212.24.111.23/redagro/member', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {
      
      // simpan data nomor handphone
      localStorage.setItem('mbrid', data.mbrid);
      localStorage.setItem('nohp', nohp);

      app.data.mbrid = data.mbrid;
      app.data.nohp = data.nohp;

      // set data ke form login
      $$('#my-login-screen [name="mbrid"]').val(data.mbrid);
      $$('#my-login-screen [name="nohp"]').val(nohp);

      app.loginScreen.close('#my-reg-screen');
      app.loginScreen.open('#my-login-screen');
    
      setTimeout(function () {
        app.dialog.alert(data.message, 'Registrasi Member');
      }, 2000);

      // post to server      
      // var formData = { nohp: nohp, gcmid: regId}
      // app.request.post('http://212.24.111.23/redagro/member/regcmid', formData, function (res) {
        
      //   var data = JSON.parse(res);

      //   if (!data.status) {
      //     app.dialog.alert(data.message, 'Registrasi ID');
      //   }
      // });
    } else {
      app.dialog.alert(data.message, 'Registrasi Member');
    }
  });
});

$$('a.label-login').on('click', function () {
  // Close register screen
  app.loginScreen.close('#my-reg-screen');
  app.loginScreen.open('#my-login-screen');
});

$$('#my-login-screen').on('loginscreen:opened', function (e, loginScreen) {
  // set data ke form login
      // app.data.mbrid = localStorage.getItem('mbrid');
      // app.data.nohp = localStorage.getItem('nohp');
  $$('#my-login-screen [name="mbrid"]').val(localStorage.getItem('mbrid'));
  $$('#my-login-screen [name="nohp"]').val(localStorage.getItem('nohp'));
  // $$('#my-login-screen [name="mbrid"]').val(app.data.mbrid);
  // $$('#my-login-screen [name="nohp"]').val(app.data.nohp);
});

$$('#tukar-poin .btnTukar').on('click', function(e){
  //e.preventDefault();

  var poin = $$('#tukar-poin [name="poin"]').val();
  // var pin = $$('#tukar-poin [name="pin"]').val();

  if (poin == '' || poin == '0') {
    app.dialog.alert('Masukkan jumlah poin yang akan ditukar.', 'Tukar Poin');
    return;
  } else
  if (app.data.poin == 0) {
    app.dialog.alert('Jumlah poin anda masih kosong.', 'Tukar Poin');
    return;
  } else
  if (poin > app.data.poin) {
    app.dialog.alert('Jumlah maksimal poin yang bisa ditukar adalah ' + app.data.poin +'.', 'Tukar Poin');
    $$('#tukar-poin [name="poin"]').val(app.data.poin);
    return;
  }
  // if (pin == '') {
  //   app.dialog.alert('Masukkan nomor pin anda.', 'Tukar Poin');
  //   return;
  // }

  var formData = app.form.convertToData('.tkrpoin');
  formData.Authorization = app.data.token;
  
  app.request.post('http://212.24.111.23/redagro/member/tukarpoin', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {
      app.popup.close($$('.page[data-name="tukar-poin"]').parents(".popup"));

      app.request.get('http://212.24.111.23/redagro/member/saldo/' + app.data.mbrid, function (res) {
          
        var data = JSON.parse(res);
    
        if (data.status) {
          $$('.saldo').text(data.saldo);
          app.data.saldo = data.saldo;

          $$('.poin').text(data.poin);
          app.data.poin = data.poin;
        } else {
          app.dialog.alert(data.message, 'Akun Saya');
        }
      });
      
    } else {
      app.dialog.alert(data.message, 'Tukar Poin');
    }
  });
});  

$$('#transfer-bonus .btnTransfer').on('click', function(e){
  //e.preventDefault();
  
  var bonus = $$('#nominal').val();
  // var pin = $$('#pin-bonus').val();

  if (bonus == '' || bonus == '0') {
    app.dialog.alert('Masukkan jumlah bonus yang akan ditransfer.', 'Transfer Bonus');
    return;
  } else
  if (app.data.bonus == 0) {
    app.dialog.alert('Jumlah bonus anda masih kosong.', 'Transfer Bonus');
    return;
  } else
  if (bonus < 500) {
    app.dialog.alert('Jumlah minimal transfer bonus sebesar 500.', 'Transfer Bonus');
    $$('#nominal').val(500);
    return;
  } else
  if (bonus > app.data.bonus) {
    app.dialog.alert('Jumlah maksimal bonus yang bisa ditransfer adalah ' + app.data.bonus +'.', 'Transfer Bonus');
    $$('#nominal').val(app.data.bonus);
    return;
  }
  // if (pin == '') {
  //   app.dialog.alert('Masukkan nomor pin anda.', 'Transfer Bonus');
  //   return;
  // }

  var formData = app.form.convertToData('.trfbonus');
  formData.Authorization = app.data.token;
  
  app.request.post('http://212.24.111.23/redagro/member/trfbonus', formData, function (res) {
    
    app.preloader.hide();

    var data = JSON.parse(res);

    if (data.status) {
      //app.router.back();
      app.popup.close($$('.page[data-name="transfer-bonus"]').parents(".popup"));

      app.request.get('http://212.24.111.23/redagro/member/saldo/' + app.data.mbrid, function (res) {
          
        var data = JSON.parse(res);
    
        if (data.status) {
          $$('.saldo').text(data.saldo);
          app.data.saldo = data.saldo;
          
          $$('.bonus').text(data.bonus);
          app.data.bonus = data.bonus;
        } else {
          app.dialog.alert(data.message, 'Akun Saya');
        }
      });
    } else {
      app.dialog.alert(data.message, 'Transfer Bonus');
    }
  });
});  

// ganti pin
$$('#ganti-pin .btnGanti').on('click', function () {
  
  var pinlama = $$('#ganti-pin [name="pinlama"]').val();
  var pinbaru = $$('#ganti-pin [name="pinbaru"]').val();
  
  if (pinlama == '') {
      app.dialog.alert('Masukkan nomor pin yang lama.', 'Ganti PIN');
      return;
  } else
  if (pinlama !== app.data.pin) {
    app.dialog.alert('Input nomor pin yang lama belum benar.', 'Ganti PIN');
    return;
  } else
  if (pinbaru == '') {
      app.dialog.alert('Masukkan nomor pin yang baru.', 'Ganti PIN');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.ganti-pin');
  formData.Authorization = app.data.token;
  
  app.request.post('http://212.24.111.23/redagro/member/gantipin', formData, function (res) {
    
    app.preloader.hide();
    var data = JSON.parse(res);

    if (data.status) {
      $$('#ganti-pin [name="pinlama"]').val('');
      $$('#ganti-pin [name="pinbaru"]').val('');
      app.popup.close($$('.page[data-name="ganti-pin"]').parents(".popup"));
    } else {
      app.dialog.alert(data.message, 'Ganti PIN');
    }
  });
});

$$(document).on('backbutton', function (e) {
  e.preventDefault();
  // for example, based on what and where view you have
  if (app.views.main.router.url == '/') {
    navigator.app.exitApp();
  } else {
    mainView.router.back();
  }
});

$$(document).on('click', '.input-remove-row', function(){ 
  var tr = $$(this).closest('tr');
  // tr.fadeOut(200, function(){
    tr.remove();
    app.methods.calcTotal()
  // });
});

    
app.on('pageInit', function (page) {

$$('input').on('focus', function () {
  
  $$('.kb').css('height', '280px');
  //var limit = $$(window).height() - 280;

  if ($$(this).offset().top > 280) {
    $$('.page-content').scrollTop($$(this).offset().top-168);
  }
});

$$('input').on('blur', function () {
  $$('.kb').css('height', '0px');
});
});
