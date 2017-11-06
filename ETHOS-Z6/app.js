'use strict';

(function (global) {
    var app = global.app = global.app || {};
    window.app = app;


    // using sql db for storing offline information 
    app.openDb = function () {
        if (window.sqlitePlugin !== undefined) {
            app.db = window.sqlitePlugin.openDatabase("Ethos_Z6_28");
        } else {
            // For debugging in simulator fallback to native SQL Lite
            app.db = window.openDatabase("Ethos_Z6_28", "1.0", "Cordova Demo", 200000);
            //app.db = window.sqlitePlugin.openDatabase("EthosINS");
        }
    };
    var checkpushnotification = function () {
        $(function () {

            if (localStorage.getItem("Ethosz6_pushnotify") != 1) {
                var pushSettings = {
                    android: {
                        senderID: '944328119073'
                    },
                    iOS: {
                        badge: 'true',
                        sound: 'true',
                        alert: 'true'
                    },
                    wp8: {
                        channelName: 'EverlivePushChannel'
                    },
                    customParameters: {
                        Age: 21
                    }
                };
                app.everlive.push.register(pushSettings)
                    .then(
                        function () {
                            localStorage.setItem("Ethosz6_pushnotify", "1");
                            console.log(app.constants.SUCCESS_TEXT);
                        },
                        function (err) {
                            // alert('REGISTER ERROR: ' + JSON.stringify(err));
                        }
                );
            }
        });
    };
    var bootstrap = function () {
        var os = kendo.support.mobileOS,
      statusBarStyle = os.ios && os.flatVersion >= 700 ? 'white-translucent' : 'white';
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                //transition: 'slide',
                //layout: "tabstrip-layout",
                skin: 'flat',
                initial: 'components/authenticationView/view.html',// DCRView approveleaveView
                statusBarStyle: statusBarStyle,
            });
        });
    };

    if (window.cordova) {
        document.addEventListener('deviceready', function () {
             if (navigator && navigator.splashscreen) {
                 navigator.splashscreen.hide();
                 //StatusBar.overlaysWebView(false); //Turns off web view overlay.
             } 
            bootstrap();
            checkpushnotification();

        }, false);
    } else {
        bootstrap();
        checkpushnotification();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $('#navigation-container li.active').removeClass('active');
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };

    app.openLink = function (url) {
        if (url.substring(0, 4) === 'geo:' && device.platform === 'iOS') {
            url = 'http://maps.apple.com/?ll=' + url.substring(4, url.length);
        }

        window.open(url, '_system');
        if (window.event) {
            window.event.preventDefault && window.event.preventDefault();
            window.event.returnValue = false;
        }
    };

    /// start appjs functions
    /// end appjs functions
    app.showFileUploadName = function (itemViewName) {
        $('.' + itemViewName).off('change', 'input[type=\'file\']').on('change', 'input[type=\'file\']', function (event) {
            var target = $(event.target),
                inputValue = target.val(),
                fileName = inputValue.substring(inputValue.lastIndexOf('\\') + 1, inputValue.length);

            $('#' + target.attr('id') + 'Name').text(fileName);
        });

    };

    app.clearFormDomData = function (formType) {
        $.each($('.' + formType).find('input:not([data-bind]), textarea:not([data-bind])'), function (key, value) {
            var domEl = $(value),
                inputType = domEl.attr('type');

            if (domEl.val().length) {

                if (inputType === 'file') {
                    $('#' + domEl.attr('id') + 'Name').text('');
                }

                domEl.val('');
            }
        });
    };

    /* tour plan start*/
    // 1 create dcr master informaton
    app.createtable_tourplan_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists tourplan_master (tourplan_master_id integer primary key asc,"
               + "employee_id integer,"
               + "sub_territory_id integer,"
               + "tp_date date,"
               + "activity_period_id integer,"
               + "activity_period_name text,"
               + "activity_id integer,"
               + "activity_name text,"
               + "category_id integer,"
               + "category_name text,"
               + "mode_id integer,"
               + "mode_name text,"
               + "tp_contact text,"
               + "tp_objective text,"
               + " added_on blob)", []);
        });
    }
    app.addto_tourplan_master = function (employee_id, sub_territory_id, tp_date, activity_period_id, activity_period_name,
        activity_id, activity_name, category_id, category_name, mode_id,
        mode_name, tp_contact, tp_objective
        ) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into tourplan_master (employee_id,sub_territory_id,tp_date, activity_period_id, activity_period_name, " +
                "activity_id, activity_name," + "category_id, category_name, mode_id," +
                " mode_name,tp_contact, tp_objective,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [employee_id, sub_territory_id, tp_date, activity_period_id, activity_period_name,
                              activity_id, activity_name, category_id, category_name, mode_id,
                              mode_name, tp_contact, tp_objective, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }
    app.select_tourplan_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM tourplan_master ", [], fn, app.onError);
        });
    };
    app.delete_tourplan_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 2 create dcr master worked with informaton
    app.createtable_tourplan_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists tourplan_master_ww_details (tourplan_master_ww_detail_id integer primary key asc,"
                + "tourplan_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }
    app.addto_tourplan_master_ww_details = function (tourplan_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into tourplan_master_ww_details(tourplan_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [tourplan_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }
    app.select_tourplan_master_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT ww_id,ww_name FROM tourplan_master_ww_details ", [], fn, app.onError);
        });
    };
    app.delete_tourplan_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    app.createtable_tourplan_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists tourplan_master_mj_details (tourplan_master_mj_details_id integer primary key asc,"
                + "tourplan_master_id integer,"
                + "mj_id integer,"
                + "mj_name text,"
                + " added_on blob)", []);
        });
    }
    app.addto_tourplan_master_mj_details = function (tourplan_master_id, mj_id, mj_name) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into tourplan_master_mj_details(tourplan_master_id,mj_id,mj_name,added_on) "
                + " values (?,?,?,?)",
                          [tourplan_master_id, mj_id, mj_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }
    app.select_tourplan_master_mj_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT mj_id,mj_name FROM tourplan_master_mj_details ", [], fn, app.onError);
        });
    };
    app.delete_tourplan_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master_mj_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    /* tour plan end*/

    /* dcr start*/

    // 1 create dcr master informaton
    app.createtable_dcr_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master (dcr_master_id integer primary key asc,"
               + "employee_id integer,"
               + "sub_territory_id integer,"
               + "dcr_date date,"
               + "activity_period_id integer,"
               + "activity_period_name text,"
               + "activity_id integer,"
               + "activity_name text,"
               + "category_id integer,"
               + "category_name text,"
               + "mode_id integer,"
               + "mode_name text,"
               + "sfcroute_id integer,"
               + "sfcroute_place text,"
               + "deviation_reason text,"
               + "deviation_description text,"
               + "latitude text,"
               + "longitude text,"
               + " added_on blob)", []);
        });
    }

    // 1 insert dcr_master
    app.addto_dcr_master = function (employee_id, sub_territory_id, dcr_date, activity_period_id, activity_period_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description, latitude, longitude
        ) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_master(employee_id,sub_territory_id,dcr_date, activity_period_id, activity_period_name, activity_id, activity_name," +
                "category_id, category_name, mode_id, mode_name, sfcroute_id," +
                "sfcroute_place, deviation_reason, deviation_description ,latitude,longitude,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [employee_id, sub_territory_id, dcr_date, activity_period_id, activity_period_name, activity_id, activity_name,
                              category_id, category_name, mode_id, mode_name, sfcroute_id,
                              sfcroute_place, deviation_reason, deviation_description, latitude, longitude,
                              addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    // update dcr master geo
    app.update_dcr_master_geo = function (dcr_master_id, Latitude, Longitude) {
        app.db.transaction(function (tx) {
            tx.executeSql("update dcr_master SET Latitude =?, Longitude = ? WHERE dcr_master_id = ? ",
                          [Latitude, Longitude, dcr_master_id],
                          app.onsuccess,
                          app.onError);
        });
    };
    // update dcr master deviation
    app.update_dcr_master_deviation = function (dcr_master_id, deviation_reason, deviation_description) {
        app.db.transaction(function (tx) {
            tx.executeSql("update dcr_master SET deviation_reason =?, deviation_description = ? WHERE dcr_master_id = ? ",
                          [deviation_reason, deviation_description, dcr_master_id],
                          app.onsuccess,
                          app.onError);
        });
    };
    app.select_old_dcr_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_id,activity_period_id, activity_id,category_id,mode_id FROM dcr_master where dcr_master_id=1", [], fn, app.onError);
        });
    };
    app.select_count_dcr_doctor_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_doctor_master_id) + 1 as dcr_doctor_master_id FROM dcr_doctor_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.select_dcr_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 2 create dcr master worked with informaton
    app.createtable_dcr_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master_ww_details (dcr_master_ww_detail_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_master_ww_details = function (dcr_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_ww_details(dcr_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_master_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_id,ww_id FROM dcr_master_ww_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_master_ww_details_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_id,ww_id,ww_name FROM dcr_master_ww_details where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 2 a  create dcr master worked with informaton for temp
    app.createtable_dcr_master_ww_details_temp_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master_ww_details_temp_master (dcr_master_ww_detail_temp_master_id integer primary key asc,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }

    // 2 a insert  dcr master worked with informaton for temp
    app.addto_dcr_master_ww_details_temp_master = function (ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_ww_details_temp_master(ww_id,ww_name,added_on) "
                + " values (?,?,?)",
                          [ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_master_ww_details_temp_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT ww_id,ww_name FROM dcr_master_ww_details_temp_master ", [], fn, app.onError);
        });
    };
    app.delete_dcr_master_ww_details_temp_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_ww_details_temp_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 2 a  create dcr master worked with informaton for temp
    app.createtable_dcr_master_ww_details_temp_institution = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master_ww_details_temp_institution (dcr_master_ww_detail_temp_institution_id integer primary key asc,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    };
    // 2 a insert  dcr master worked with informaton for temp
    app.addto_dcr_master_ww_details_temp_institution = function (ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_ww_details_temp_institution(ww_id,ww_name,added_on) "
                + " values (?,?,?)",
                          [ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    // 2 select dcr master ww   
    app.select_dcr_master_ww_details_temp_institution = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_ww_detail_temp_institution_id,ww_id,ww_name FROM dcr_master_ww_details_temp_institution ", [], fn, app.onError);
        });
    };
    //2 a Delete dcr master worked with informaton for temp
    app.delete_dcr_master_ww_details_temp_institution_by_id = function (dcr_master_ww_detail_temp_institution_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_ww_details_temp_institution where dcr_master_ww_detail_temp_institution_id=?", [dcr_master_ww_detail_temp_institution_id],
                          app.onsuccess,
                          app.onError);
        });
    };
    app.delete_dcr_master_ww_details_temp_institution = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_ww_details_temp_institution ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 3 create dcr master major town informaton
    app.createtable_dcr_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master_mj_details (dcr_master_mj_detail_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "mj_id integer,"
                + "mj_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_master_mj_details = function (dcr_master_id, mj_id, mj_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_mj_details(dcr_master_id,mj_id,mj_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_master_id, mj_id, mj_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_master_mj_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_id,mj_id FROM dcr_master_mj_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_master_mj_details_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT mj_id,mj_name FROM dcr_master_mj_details where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_mj_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    //doctor start
    // 4 create dcr doctor master informaton
    app.createtable_dcr_doctor_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_doctor_master (dcr_doctor_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "doctor_id integer,"
                + "doctor_msl_id integer," 
                + "doctor_name text,"
                + "doctor_number integer," //doc number
                + "pob integer,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_doctor_master = function (dcr_master_id, doctor_id,doctor_msl_id, doctor_name, doctor_number, pob, latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_doctor_master(dcr_master_id,doctor_id,doctor_msl_id, doctor_name,doctor_number,pob,latitude,longitude,added_on) "
                + " values (?,?,?,?,?,?,?,?,?)",
                          [dcr_master_id, doctor_id,doctor_msl_id, doctor_name, doctor_number, pob, latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_doctor_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id,dcr_master_id,doctor_id,doctor_msl_id, doctor_name, doctor_number,pob, latitude, longitude, added_on FROM dcr_doctor_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_doctor_master_doctor_msl_ids = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT doctor_msl_id  FROM dcr_doctor_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_doctor_master_count = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(doctor_msl_id) as doctor_master_count FROM dcr_doctor_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_doctor_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id,dcr_master_id,doctor_id,doctor_msl_id, doctor_name, doctor_number,pob, latitude, longitude  FROM dcr_doctor_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    }; 
    app.delete_dcr_doctor_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_doctor_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 5 create dcr doctor worked with informaton
    app.createtable_dcr_doctor_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_doctor_ww_details (dcr_doctor_ww_detail_id integer primary key asc,"
                + "dcr_doctor_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_doctor_ww_details = function (dcr_doctor_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_doctor_ww_details(dcr_doctor_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_doctor_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_doctor_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id, ww_id  FROM dcr_doctor_ww_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_doctor_ww_details_by_dcr_doctor_master_id = function (fn, dcr_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id, ww_id, ww_name FROM dcr_doctor_ww_details where dcr_doctor_master_id=?  ", [dcr_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_doctor_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_doctor_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 6 create dcr doctor gift informaton
    app.createtable_dcr_doctor_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_doctor_gift_details (dcr_doctor_gift_detail_id integer primary key asc,"
                + "dcr_doctor_master_id integer,"
                + "gift_id integer,"
                + "gift_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_doctor_gift_details = function (dcr_doctor_master_id, gift_id, gift_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_doctor_gift_details(dcr_doctor_master_id,gift_id,gift_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_doctor_master_id, gift_id, gift_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_doctor_gift_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id, gift_id,  quantity FROM dcr_doctor_gift_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_doctor_gift_details_by_dcr_doctor_master_id = function (fn, dcr_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id, gift_id, gift_name, quantity FROM dcr_doctor_gift_details where dcr_doctor_master_id=?  ", [dcr_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_doctor_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_doctor_gift_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 7 create dcr doctor sample informaton
    app.createtable_dcr_doctor_sample_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_doctor_sample_details (dcr_doctor_sample_detail_id integer primary key asc,"
                + "dcr_doctor_master_id integer,"
                + "product_id integer,"
                + "product_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_doctor_sample_details = function (dcr_doctor_master_id, product_id, product_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_doctor_sample_details(dcr_doctor_master_id,product_id,product_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_doctor_master_id, product_id, product_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_doctor_sample_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id,product_id, quantity FROM dcr_doctor_sample_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_doctor_sample_details_by_dcr_doctor_master_id = function (fn, dcr_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_doctor_master_id,product_id,product_name,quantity FROM dcr_doctor_sample_details where dcr_doctor_master_id=?  ", [dcr_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_doctor_sample_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_doctor_sample_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 8 create dcr unlisted doctor master informaton
    app.createtable_dcr_unlisted_doctor_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_doctor_master (dcr_unlisted_doctor_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "doctor_name text,"
                + "sex_id integer,"
                + "sex_name text,"
                + "registration_number text,"

                + "qualification1 integer,"
                + "qualification1_name text,"
                + "qualification2 integer,"
                + "qualification2_name text,"
                + "qualification3 integer,"

                + "qualification3_name text,"
                + "other_qualification integer,"
                + "other_qualification_name text,"
                + "speciality integer,"
                + "speciality_name text,"

                + "city_id integer,"
                + "city_name text,"
                + "state_id integer,"
                + "state_name text,"
                + "mj_id integer,"

                + "mj_name text,"
                + "address text,"
                + "pincode integer,"
                + "phone text,"
                + "mobile text,"

                + "email text,"
                + "pob integer,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_doctor_master = function (dcr_master_id, doctor_name, sex_id, sex_name, registration_number,
        qualification1, qualification1_name, qualification2, qualification2_name, qualification3,
        qualification3_name, other_qualification, other_qualification_name, speciality, speciality_name,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile,
        email, pob, latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_unlisted_doctor_master(" +
                    " dcr_master_id,doctor_name, sex_id, sex_name,registration_number," +
                    " qualification1,qualification1_name, qualification2, qualification2_name, qualification3," +
                    " qualification3_name,other_qualification, other_qualification_name, speciality, speciality_name," +
                    " city_id, city_name, state_id, state_name, mj_id, " +
                    " mj_name, address, pincode, phone, mobile, " +
                    " email,pob, latitude, longitude,added_on) "
                + " values (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?)",
                    [dcr_master_id, doctor_name, sex_id, sex_name, registration_number,
                    qualification1, qualification1_name, qualification2, qualification2_name, qualification3,
                    qualification3_name, other_qualification, other_qualification_name, speciality, speciality_name,
                    city_id, city_name, state_id, state_name, mj_id,
                    mj_name, address, pincode, phone, mobile,
                    email, pob, latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_count_dcr_unlisted_doctor_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_unlisted_doctor_master_id) + 1 as dcr_unlisted_doctor_master_id FROM dcr_unlisted_doctor_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_doctor_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_doctor_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 9 create dcr unlisted doctor worked with informaton
    app.createtable_dcr_unlisted_doctor_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_doctor_ww_details (dcr_unlisted_doctor_ww_detail_id integer primary key asc,"
                + "dcr_unlisted_doctor_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_doctor_ww_details = function (dcr_unlisted_doctor_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_doctor_ww_details(dcr_unlisted_doctor_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_doctor_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_doctor_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_doctor_master_id,ww_id FROM dcr_unlisted_doctor_ww_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_ww_details_by_dcr_unlisted_doctor_master_id = function (fn, dcr_unlisted_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_ww_details where dcr_unlisted_doctor_master_id=?  ", [dcr_unlisted_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_doctor_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_doctor_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 10 create dcr unlisted doctor products promoted informaton
    app.createtable_dcr_unlisted_doctor_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_doctor_pp_details (dcr_unlisted_doctor_pp_detail_id integer primary key asc,"
                + "dcr_unlisted_doctor_master_id integer,"
                + "pp_id integer,"
                + "pp_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_doctor_pp_details = function (dcr_unlisted_doctor_master_id, pp_id, pp_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_doctor_pp_details(dcr_unlisted_doctor_master_id,pp_id, pp_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_doctor_master_id, pp_id, pp_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_doctor_pp_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_doctor_master_id, pp_id FROM dcr_unlisted_doctor_pp_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_pp_details_by_dcr_unlisted_doctor_master_id = function (fn, dcr_unlisted_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_pp_details where dcr_unlisted_doctor_master_id=?  ", [dcr_unlisted_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_doctor_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_doctor_pp_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 11 create dcr doctor gift informaton
    app.createtable_dcr_unlisted_doctor_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_doctor_gift_details (dcr_unlisted_doctor_gift_detail_id integer primary key asc,"
                + "dcr_unlisted_doctor_master_id integer,"
                + "gift_id integer,"
                + "gift_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_doctor_gift_details = function (dcr_unlisted_doctor_master_id, gift_id, gift_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_doctor_gift_details(dcr_unlisted_doctor_master_id,gift_id,gift_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_unlisted_doctor_master_id, gift_id, gift_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_doctor_gift_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_doctor_master_id, gift_id,quantity FROM dcr_unlisted_doctor_gift_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_gift_details_by_dcr_unlisted_doctor_master_id = function (fn, dcr_unlisted_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_gift_details where dcr_unlisted_doctor_master_id=?  ", [dcr_unlisted_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_doctor_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_doctor_gift_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 12 create dcr doctor sample informaton
    app.createtable_dcr_unlisted_doctor_sample_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_doctor_sample_details (dcr_unlisted_doctor_sample_detail_id integer primary key asc,"
                + "dcr_unlisted_doctor_master_id integer,"
                + "product_id integer,"
                + "product_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_doctor_sample_details = function (dcr_unlisted_doctor_master_id, product_id, product_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_doctor_sample_details(dcr_unlisted_doctor_master_id,product_id, product_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_unlisted_doctor_master_id, product_id, product_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_doctor_sample_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_doctor_master_id, product_id,quantity FROM dcr_unlisted_doctor_sample_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_doctor_sample_details_by_dcr_unlisted_doctor_master_id = function (fn, dcr_unlisted_doctor_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_doctor_sample_details where dcr_unlisted_doctor_master_id=?  ", [dcr_unlisted_doctor_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_doctor_sample_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_doctor_sample_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //chemist start 
    // 4 create dcr chemist master informaton
    app.createtable_dcr_chemist_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_chemist_master (dcr_chemist_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "chemist_id integer," //ins msl number
                 + "chemist_msl_id integer," //ins msl number 
                + "chemist_name text,"
                + "chemist_number integer," //ins msl number
                + "pob integer,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_chemist_master = function (dcr_master_id, chemist_id,chemist_msl_id, chemist_name, chemist_number, pob, latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_chemist_master(dcr_master_id,chemist_id,chemist_msl_id, chemist_name, chemist_number,pob,latitude,longitude,added_on) "
                + " values (?,?,?,?,?, ?,?,?,?)",
                          [dcr_master_id, chemist_id, chemist_msl_id,chemist_name, chemist_number, pob, latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_chemist_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_chemist_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_chemist_master_chemist_msl_ids = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT chemist_msl_id  FROM dcr_chemist_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_chemist_master_count = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(chemist_msl_id) as chemist_master_count FROM dcr_chemist_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_chemist_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_chemist_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.select_count_dcr_chemist_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_chemist_master_id) + 1 as dcr_chemist_master_id FROM dcr_chemist_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_chemist_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_chemist_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 5 create dcr chemist worked with informaton
    app.createtable_dcr_chemist_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_chemist_ww_details (dcr_chemist_ww_detail_id integer primary key asc,"
                + "dcr_chemist_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_chemist_ww_details = function (dcr_chemist_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_chemist_ww_details(dcr_chemist_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_chemist_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_chemist_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_chemist_master_id,ww_id FROM dcr_chemist_ww_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_chemist_ww_details_by_dcr_chemist_master_id = function (fn, dcr_chemist_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_chemist_ww_details where dcr_chemist_master_id=?  ", [dcr_chemist_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_chemist_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_chemist_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 6 create dcr chemist gift informaton
    app.createtable_dcr_chemist_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_chemist_gift_details (dcr_chemist_gift_detail_id integer primary key asc,"
                + "dcr_chemist_master_id integer,"
                + "gift_id integer,"
                + "gift_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_chemist_gift_details = function (dcr_chemist_master_id, gift_id, gift_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_chemist_gift_details(dcr_chemist_master_id,gift_id,gift_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_chemist_master_id, gift_id, gift_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_chemist_gift_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_chemist_master_id,gift_id,quantity FROM dcr_chemist_gift_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_chemist_gift_details_by_dcr_chemist_master_id = function (fn, dcr_chemist_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_chemist_gift_details where dcr_chemist_master_id=?  ", [dcr_chemist_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_chemist_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_chemist_gift_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 8 create dcr unlisted chemist master informaton
    app.createtable_dcr_unlisted_chemist_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_chemist_master (dcr_unlisted_chemist_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "chemist_name text,"
                + "contact_person_name text,"
                + "drug_license_no text,"
                + "vat_no text,"

                + "city_id integer,"
                + "city_name text,"
                + "state_id integer,"
                + "state_name text,"

                + "mj_id integer,"
                + "mj_name text,"

                + "address text,"
                + "pincode integer,"
                + "phone text,"
                + "mobile text,"
                + "email text,"
                + "pob integer,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_chemist_master = function (
        dcr_master_id, chemist_name, contact_person_name, drug_license_no, vat_no,
        city_id, city_name, state_id, state_name, mj_id,
        mj_name, address, pincode, phone, mobile, email,
        pob, latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_unlisted_chemist_master(" +
                    " dcr_master_id,chemist_name, contact_person_name, drug_license_no, vat_no," +
                     " city_id, city_name, state_id, state_name,mj_id, " +
                     " mj_name, address, pincode, phone, mobile, email," +
                    " pob,latitude, longitude,added_on) "
                + " values (?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?)",
                        [dcr_master_id, chemist_name, contact_person_name, drug_license_no, vat_no, 
                        city_id, city_name, state_id, state_name, mj_id,
                        mj_name, address, pincode, phone, mobile, email,
                        pob, latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_chemist_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_chemist_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_chemist_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_chemist_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.select_count_dcr_unlisted_chemist_master_by_dcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_unlisted_chemist_master_id) + 1 as dcr_unlisted_chemist_master_id FROM dcr_unlisted_chemist_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_chemist_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_chemist_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 9 create dcr unlisted chemist worked with informaton
    app.createtable_dcr_unlisted_chemist_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_chemist_ww_details (dcr_unlisted_chemist_ww_detail_id integer primary key asc,"
                + "dcr_unlisted_chemist_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }
    app.addto_dcr_unlisted_chemist_ww_details = function (dcr_unlisted_chemist_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_chemist_ww_details(dcr_unlisted_chemist_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_chemist_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }
    app.select_dcr_unlisted_chemist_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_chemist_master_id,ww_id  FROM dcr_unlisted_chemist_ww_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_unlisted_chemist_ww_details_by_dcr_unlisted_chemist_master_id = function (fn, dcr_unlisted_chemist_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_chemist_ww_details where dcr_unlisted_chemist_master_id=?  ", [dcr_unlisted_chemist_master_id], fn, app.onError);
        });
    };

    app.delete_dcr_unlisted_chemist_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_chemist_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 10 create dcr unlisted chemist products promoted informaton
    app.createtable_dcr_unlisted_chemist_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_chemist_pp_details (dcr_unlisted_chemist_pp_detail_id integer primary key asc,"
                + "dcr_unlisted_chemist_master_id integer,"
                + "pp_id integer,"
                + "pp_name text,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_chemist_pp_details = function (dcr_unlisted_chemist_master_id, pp_id, pp_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_chemist_pp_details(dcr_unlisted_chemist_master_id,pp_id,pp_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_chemist_master_id, pp_id, pp_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_chemist_pp_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_chemist_master_id,pp_id FROM dcr_unlisted_chemist_pp_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_unlisted_chemist_pp_details_by_dcr_unlisted_chemist_master_id = function (fn, dcr_unlisted_chemist_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_chemist_pp_details where dcr_unlisted_chemist_master_id=?  ", [dcr_unlisted_chemist_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_chemist_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_chemist_pp_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 11 create dcr chemist gift informaton
    app.createtable_dcr_unlisted_chemist_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_chemist_gift_details (dcr_unlisted_chemist_gift_detail_id integer primary key asc,"
                + "dcr_unlisted_chemist_master_id integer,"
                + "gift_id integer,"
                + "gift_name text,"
                + "quantity integer,"
                + " added_on blob)", []);
        });
    };
    app.addto_dcr_unlisted_chemist_gift_details = function (dcr_unlisted_chemist_master_id, gift_id, gift_name, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_chemist_gift_details(dcr_unlisted_chemist_master_id,gift_id,gift_name,quantity,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_unlisted_chemist_master_id, gift_id, gift_name, quantity, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };
    app.select_dcr_unlisted_chemist_gift_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT  dcr_unlisted_chemist_master_id,gift_id,quantity FROM dcr_unlisted_chemist_gift_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_unlisted_chemist_gift_details_by_dcr_unlisted_chemist_master_id = function (fn, dcr_unlisted_chemist_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_chemist_gift_details where dcr_unlisted_chemist_master_id=?  ", [dcr_unlisted_chemist_master_id], fn, app.onError);
        });
    };
    app.delete_dcr_unlisted_chemist_gift_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_chemist_gift_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // chemist end  
    /* dcr end */

    /*promo details start*/
    //sub_territory_id,promoitem_value_id	promoitem_id	collaterals	balance_quantity 
    app.createtable_dcr_promo_balance_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_promo_balance_details (dcr_promo_balance_detail_id integer primary key asc,"
            + "sub_territory_id integer,"
            + "promoitem_value_id integer,"
            + "promoitem_id integer,"
            + "collaterals text,"
            + "balance_quantity integer,"
            + "quantity integer,"
            + "update_flag integer,"
            + " added_on blob)", []);
        });
    };
    app.addto_dcr_dcr_promo_balance_details = function (sub_territory_id, promoitem_value_id, promoitem_id, collaterals, balance_quantity, quantity) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            var update_flag =0;
            tx.executeSql("insert into dcr_promo_balance_details(sub_territory_id, promoitem_value_id,promoitem_id, collaterals, balance_quantity, quantity,update_flag,added_on) "
                + " values (?,?,?,?,?,?,?,?)",
                          [sub_territory_id, promoitem_value_id, promoitem_id, collaterals, balance_quantity, quantity,update_flag, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    };

    app.update_promo_balance_details_by_sub_territory_id_promoitem_value_id = function (sub_territory_id, promoitem_value_id, balance_quantity) {
         app.db.transaction(function (tx) {
             tx.executeSql("update dcr_promo_balance_details SET update_flag=1, balance_quantity =? WHERE sub_territory_id = ? and  promoitem_value_id = ?  ",
                          [balance_quantity, sub_territory_id, promoitem_value_id],
                          app.onsuccess,
                          app.onError);
        });
    };
    // gift and sample diffeence by promo itemid 413 or 414 respectively
    app.select_dcr_dcr_promo_balance_details_by_promoitem_id = function (fn, promoitem_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_promo_balance_details where promoitem_id=?  ", [promoitem_id], fn, app.onError);
        });
    }; 
    app.select_dcr_updated_promo_balance_details_by_sub_territory_id = function (fn, sub_territory_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT balance_quantity,sub_territory_id,promoitem_value_id FROM dcr_promo_balance_details where update_flag=1 and sub_territory_id=? ", [sub_territory_id], fn, app.onError);
        });
    };
    app.delete_dcr_promo_balance_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_promo_balance_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    /*promo details end*/
    app.onError = function (tx, e) {
        alert(e.message);
        console.log("Error: " + e.message);
        //  app.hideOverlay();
    }

    app.onsuccess = function (tx, r) {
        // console.log("Your SQLite query was successful!");
        // app.refresh();
        // app.hideOverlay();
    }





}(window));

function app_db_init() {
    app.openDb();
    //tp start  
    app.createtable_tourplan_master();
    app.createtable_tourplan_master_ww_details();
    app.createtable_tourplan_master_mj_details();
    //tp end 

    //dcr start 
    app.createtable_dcr_master();
    app.createtable_dcr_master_ww_details();
    app.createtable_dcr_master_mj_details();

    //doctor
    app.createtable_dcr_doctor_master();
    app.createtable_dcr_doctor_ww_details();
    app.createtable_dcr_doctor_gift_details();
    app.createtable_dcr_doctor_sample_details();

    app.createtable_dcr_unlisted_doctor_master();
    app.createtable_dcr_unlisted_doctor_ww_details();
    app.createtable_dcr_unlisted_doctor_pp_details();
    app.createtable_dcr_unlisted_doctor_gift_details();
    app.createtable_dcr_unlisted_doctor_sample_details();

    //chemist
    app.createtable_dcr_chemist_master();
    app.createtable_dcr_chemist_ww_details();
    app.createtable_dcr_chemist_gift_details();

    app.createtable_dcr_unlisted_chemist_master();
    app.createtable_dcr_unlisted_chemist_ww_details();
    app.createtable_dcr_unlisted_chemist_pp_details();
    app.createtable_dcr_unlisted_chemist_gift_details();


    app.createtable_dcr_master_ww_details_temp_master();
    app.createtable_dcr_master_ww_details_temp_institution();

    app.createtable_dcr_promo_balance_details();
    //dcr end  
}

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp