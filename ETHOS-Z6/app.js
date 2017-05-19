'use strict';

(function (global) {
    var app = global.app = global.app || {};
    window.app = app;


    // using sql db for storing offline information 
    app.openDb = function () {
        if (window.sqlitePlugin !== undefined) {
            app.db = window.sqlitePlugin.openDatabase("Ethos_fZ6");
        } else {
            // For debugging in simulator fallback to native SQL Lite
            app.db = window.openDatabase("Ethos_fZ6", "1.0", "Cordova Demo", 200000);
            //app.db = window.sqlitePlugin.openDatabase("EthosINS");
        }
    };

    var bootstrap = function () {
        var os = kendo.support.mobileOS,
      statusBarStyle = os.ios && os.flatVersion >= 700 ? 'white-translucent' : 'white';
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {
                //transition: 'slide',
                layout: "tabstrip-layout",
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
                StatusBar.overlaysWebView(false); //Turns off web view overlay.
            }
            //if (device.platform === 'iOS' && parseFloat(device.version) >= 7.0) {
            //    document.body.style.marginTop = "20px";
            //} 
            bootstrap();

        }, false);
    } else {
        bootstrap();
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

    //1 Delete
    app.delete_dcr_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //2 Delete
    app.delete_dcr_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //3 Delete
    app.delete_dcr_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_master_mj_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //4 Delete
    app.delete_dcr_ins_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_ins_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //5 Delete
    app.delete_dcr_ins_kdm_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_ins_kdm_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //6 Delete
    app.delete_dcr_ins_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_ins_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //7 Delete
    app.delete_dcr_ins_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_ins_pp_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //8 Delete
    app.delete_dcr_unlisted_ins_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_ins_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //9 Delete
    app.delete_dcr_unlisted_ins_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_ins_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //10 Delete
    app.delete_dcr_unlisted_ins_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from dcr_unlisted_ins_pp_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    // 1 create dcr master informaton
    app.createtable_dcr_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master (dcr_master_id integer primary key asc,"
               + "employee_id integer,"
               + "sub_territory_id integer,"
               + "dcr_date date,"
               + "activity_peroid_id integer,"
               + "activity_peroid_name text,"
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

    // 2 create dcr master worked with informaton
    app.createtable_dcr_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_master_ww_details (dcr_master_ww_detail_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }

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
    }

    //   
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
    }



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
    }

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
    }

    // 4 create dcr instutition master informaton
    app.createtable_dcr_ins_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_ins_master (dcr_ins_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "instutition_id integer," //ins msl number
                + "instutition_name text,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    }

    // 5 create dcr instutition master informaton
    app.createtable_dcr_ins_kdm_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_ins_kdm_details (dcr_ins_kdm_detail_id integer primary key asc,"
                + "dcr_ins_master_id integer,"
                + "kdm_id integer,"
                + "kdm_name text,"
                + "pob integer,"
                + " added_on blob)", []);
        });
    }

    // 6 create dcr instutition worked with informaton
    app.createtable_dcr_ins_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_ins_ww_details (dcr_ins_ww_detail_id integer primary key asc,"
                + "dcr_ins_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }

    // 7 create dcr instutition products promoted informaton
    app.createtable_dcr_ins_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_ins_pp_details (dcr_ins_pp_detail_id integer primary key asc,"
                + "dcr_ins_master_id integer,"
                + "pp_id integer,"
                + "pp_name text,"
                + " added_on blob)", []);
        });
    }

    // 8 create dcr unlisted instutition master informaton
    app.createtable_dcr_unlisted_ins_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_ins_master (dcr_unlisted_ins_master_id integer primary key asc,"
                + "dcr_master_id integer,"
                + "instutition_name text,"
                + "kdm_name text,"
                + "pob integer,"
                + "mj_id integer,"
                + "mj_name text,"
                + "state_id integer,"
                + "state_name text,"
                + "city_id integer,"
                + "city_name text,"
                + "address text,"
                + "pincode integer,"
                + "phone text,"
                + "mobile text,"
                + "email text,"
                + "latitude text,"
                + "longitude text,"
                + " added_on blob)", []);
        });
    }

    // 9 create dcr unlisted instutition worked with informaton
    app.createtable_dcr_unlisted_ins_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_ins_ww_details (dcr_unlisted_ins_ww_detail_id integer primary key asc,"
                + "dcr_unlisted_ins_master_id integer,"
                + "ww_id integer,"
                + "ww_name text,"
                + " added_on blob)", []);
        });
    }

    // 10 create dcr unlisted instutition products promoted informaton
    app.createtable_dcr_unlisted_ins_pp_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists dcr_unlisted_ins_pp_details (dcr_unlisted_ins_pp_detail_id integer primary key asc,"
                + "dcr_unlisted_ins_master_id integer,"
                + "pp_id integer,"
                + "pp_name text,"
                + " added_on blob)", []);
        });
    }

    // 1 insert dcr_master
    app.addto_dcr_master = function (employee_id, sub_territory_id, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
        category_id, category_name, mode_id, mode_name, sfcroute_id,
        sfcroute_place, deviation_reason, deviation_description, latitude, longitude
        ) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_master(employee_id,sub_territory_id,dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name," +
                "category_id, category_name, mode_id, mode_name, sfcroute_id," +
                "sfcroute_place, deviation_reason, deviation_description ,latitude,longitude,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [employee_id, sub_territory_id, dcr_date, activity_peroid_id, activity_peroid_name, activity_id, activity_name,
                              category_id, category_name, mode_id, mode_name, sfcroute_id,
                              sfcroute_place, deviation_reason, deviation_description, latitude, longitude,
                              addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 2 insert  dcr_master_ww_details
    app.addto_dcr_master_ww_details = function (dcr_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_ww_details(dcr_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 3 insert dcr master major town informaton
    app.addto_dcr_master_mj_details = function (dcr_master_id, mj_id, mj_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_master_mj_details(dcr_master_id,mj_id,mj_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_master_id, mj_id, mj_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    //  4 insert dcr instutition master informaton
    app.addto_dcr_ins_master = function (dcr_master_id, instutition_id, instutition_name, latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_ins_master(dcr_master_id,instutition_id,instutition_name,latitude,longitude,added_on) "
                + " values (?,?,?,?,?,?)",
                          [dcr_master_id, instutition_id, instutition_name, latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    //  5 insert dcr instutition master informaton
    app.addto_dcr_ins_kdm_details = function (dcr_ins_master_id, kdm_id, kdm_name, pob) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_ins_kdm_details(dcr_ins_master_id,kdm_id,kdm_name,pob,added_on) "
                + " values (?,?,?,?,?)",
                          [dcr_ins_master_id, kdm_id, kdm_name, pob, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 6 insert dcr instutition worked with informaton
    app.addto_dcr_ins_ww_details = function (dcr_ins_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_ins_ww_details(dcr_ins_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_ins_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 7 insert dcr instutition products promoted informaton 
    app.addto_dcr_ins_pp_details = function (dcr_ins_master_id, pp_id, pp_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_ins_pp_details(dcr_ins_master_id,pp_id,pp_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_ins_master_id, pp_id, pp_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 8 insert dcr unlisted instutition master informaton
    app.addto_dcr_unlisted_ins_master = function (dcr_master_id, instutition_name, kdm_name, pob,
        mj_id, mj_name, state_id, state_name, city_id,
        city_name, address, pincode, phone, mobile, email,
        latitude, longitude) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into dcr_unlisted_ins_master(dcr_master_id, instutition_name, kdm_name, pob," +
                "mj_id, mj_name, state_id, state_name, city_id," +
                "city_name, address,pincode,phone,mobile,email," +
                "latitude, longitude,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [dcr_master_id, instutition_name, kdm_name, pob,
                              mj_id, mj_name, state_id, state_name, city_id,
                              city_name, address, pincode, phone, mobile, email,
                              latitude, longitude, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }
    // 9 insert dcr unlisted instutition worked with informaton
    app.addto_dcr_unlisted_ins_ww_details = function (dcr_unlisted_ins_master_id, ww_id, ww_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_ins_ww_details(dcr_unlisted_ins_master_id,ww_id,ww_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_ins_master_id, ww_id, ww_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 10 insert dcr unlisted instutition products promoted informaton
    app.addto_dcr_unlisted_ins_pp_details = function (dcr_unlisted_ins_master_id, pp_id, pp_name) {
        app.db.transaction(function (tx) {
            var addedon = new Date();
            tx.executeSql("insert into dcr_unlisted_ins_pp_details(dcr_unlisted_ins_master_id,pp_id,pp_name,added_on) "
                + " values (?,?,?,?)",
                          [dcr_unlisted_ins_master_id, pp_id, pp_name, addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    app.tocompletecustomertest = function (customer_test_info_id) {
        app.db.transaction(function (tx) {
            var addedOn = new Date();
            tx.executeSql("UPDATE sl_SURVEY_CUSTOMER_TEST_INFO set added_on =?,  STATUS='Completed' WHERE ID =? ", [addedOn, customer_test_info_id],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 1 select  
    app.select_dcr_master_byid = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };

    // 2 select dcr master ww   
    app.select_dcr_master_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT ww_id,ww_name FROM dcr_master_ww_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_master_ww_details_bydcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT ww_id,ww_name FROM dcr_master_ww_details where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };

    // 3 select dcr master mj   

    app.select_dcr_master_mj_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT mj_id,mj_name FROM dcr_master_mj_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_master_mj_details_bydcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT mj_id,mj_name FROM dcr_master_mj_details where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };

    // 4 select dcr instutition   
    app.select_dcr_ins_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id,instutition_id,instutition_name,latitude,longitude,added_on FROM dcr_ins_master ", [], fn, app.onError);
        });
    };
    app.select_dcr_ins_master_bydcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, instutition_name FROM dcr_ins_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };

    // 5 select dcr instutition  kdm details
    app.select_dcr_ins_kdm_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id,kdm_id, kdm_name,pob FROM dcr_ins_kdm_details ", [], fn, app.onError);
        });
    };
    app.select_dcr_ins_kdm_details_bydcr_ins_master_id = function (fn, dcr_ins_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, kdm_name,pob FROM dcr_ins_kdm_details where dcr_ins_master_id=?  ", [dcr_ins_master_id], fn, app.onError);
        });
    };

    // 6 select dcr instutition  worked with details
    app.select_dcr_ins_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, ww_id,ww_name FROM dcr_ins_ww_details", [], fn, app.onError);
        });
    };

    app.select_dcr_ins_ww_details_bydcr_ins_master_id = function (fn, dcr_ins_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, ww_id,ww_name FROM dcr_ins_ww_details where dcr_ins_master_id=?  ", [dcr_ins_master_id], fn, app.onError);
        });
    };

    // 7 select dcr instutition products promoted details 
    app.select_dcr_ins_pp_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, pp_id,pp_name FROM dcr_ins_pp_details", [], fn, app.onError);
        });
    };
    app.select_dcr_ins_pp_details_bydcr_ins_master_id = function (fn, dcr_ins_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_ins_master_id, pp_id,pp_name FROM dcr_ins_pp_details where dcr_ins_master_id=?  ", [dcr_ins_master_id], fn, app.onError);
        });
    };

    // 8 dcr_unlisted_ins_master
    app.select_dcr_unlisted_ins_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM dcr_unlisted_ins_master", [], fn, app.onError);
        });
    };

    app.select_dcr_unlisted_ins_master_bydcr_master_id = function (fn, hdndcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_ins_master_id, instutition_name,kdm_name,pob FROM dcr_unlisted_ins_master where dcr_master_id=?  ", [hdndcr_master_id], fn, app.onError);
        });
    };

    // 9 select dcr instutition  worked with details
    app.select_dcr_unlisted_ins_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_ins_master_id, ww_id,ww_name FROM dcr_unlisted_ins_ww_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_unlisted_ins_ww_details_bydcr_unlisted_ins_master_id = function (fn, dcr_unlisted_ins_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_ins_master_id, ww_id,ww_name FROM dcr_unlisted_ins_ww_details where dcr_unlisted_ins_master_id=?  ", [dcr_unlisted_ins_master_id], fn, app.onError);
        });
    };

    // 10 select dcr instutition products promoted details
    app.select_dcr_unlisted_ins_pp_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_ins_master_id, pp_id,pp_name FROM dcr_unlisted_ins_pp_details ", [], fn, app.onError);
        });
    };

    app.select_dcr_unlisted_ins_pp_details_bydcr_unlisted_ins_master_id = function (fn, dcr_unlisted_ins_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_unlisted_ins_master_id, pp_id,pp_name FROM dcr_unlisted_ins_pp_details where dcr_unlisted_ins_master_id=?  ", [dcr_unlisted_ins_master_id], fn, app.onError);
        });
    };

    // 1 select  

    app.select_count_dcr_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT dcr_master_id,activity_peroid_id,activity_id FROM dcr_master where dcr_master_id=1", [], fn, app.onError);
        });
    };

    app.select_count_dcr_ins_master_bydcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_ins_master_id) + 1 as dcr_ins_master_id FROM dcr_ins_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
        });
    };

    app.select_count_dcr_unlisted_ins_master_bydcr_master_id = function (fn, dcr_master_id) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT count(dcr_unlisted_ins_master_id) + 1 as dcr_unlisted_ins_master_id FROM dcr_unlisted_ins_master where dcr_master_id=?  ", [dcr_master_id], fn, app.onError);
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
     

    /* tour plan start*/
    // 1 create dcr master informaton
    app.createtable_tourplan_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists tourplan_master (tourplan_master_id integer primary key asc,"
               + "employee_id integer,"
               + "sub_territory_id integer,"
               + "tp_date date,"
               + "activity_peroid_id integer,"
               + "activity_peroid_name text," 
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

    // 3 create dcr master major town informaton
    app.createtable_tourplan_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("create table if not exists tourplan_master_mj_details (tourplan_master_mj_details_id integer primary key asc,"
                + "tourplan_master_id integer,"
                + "mj_id integer,"
                + "mj_name text,"
                + " added_on blob)", []);
        });
    }

    // 1 insert dcr_master
    app.addto_tourplan_master = function (employee_id, sub_territory_id, tp_date, activity_peroid_id, activity_peroid_name,
        activity_id, activity_name, category_id, category_name, mode_id,
        mode_name, tp_contact, tp_objective
        ) {
        app.db.transaction(function (tx) {
            var addedon = todateddmmyyyhhmmss_hyphen(new Date());
            tx.executeSql("insert into tourplan_master (employee_id,sub_territory_id,tp_date, activity_peroid_id, activity_peroid_name, " +
                "activity_id, activity_name," +"category_id, category_name, mode_id," +
                " mode_name,tp_contact, tp_objective,added_on) "
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [employee_id, sub_territory_id, tp_date, activity_peroid_id, activity_peroid_name,
                              activity_id, activity_name, category_id, category_name, mode_id,
                              mode_name,tp_contact, tp_objective,addedon],
                          app.onsuccess,
                          app.onerror);
        });
    }

    // 2 insert  tourplan_master_ww_details
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

    // 3 insert dcr master major town informaton
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
    //1 Delete
    app.delete_tourplan_master = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //2 Delete
    app.delete_tourplan_master_ww_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master_ww_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };
    //3 Delete
    app.delete_tourplan_master_mj_details = function () {
        app.db.transaction(function (tx) {
            tx.executeSql("delete from tourplan_master_mj_details ", [],
                          app.onsuccess,
                          app.onError);
        });
    };

    // 1 select  
    app.select_tourplan_master = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM tourplan_master ", [], fn, app.onError);
        });
    };

    // 2 select dcr master ww   
    app.select_tourplan_master_ww_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT ww_id,ww_name FROM tourplan_master_ww_details ", [], fn, app.onError);
        });
    };
    // 3 select dcr master mj    
    app.select_tourplan_master_mj_details = function (fn) {
        app.db.transaction(function (tx) {
            tx.executeSql("SELECT mj_id,mj_name FROM tourplan_master_mj_details ", [], fn, app.onError);
        });
    };
    /* tour plan end*/


}(window));

function app_db_init() {
    app.openDb();
    //app.createtable_dcr_master();
    //app.createtable_dcr_master_ww_details();
    //app.createtable_dcr_master_mj_details();

    //app.createtable_dcr_ins_master();
    //app.createtable_dcr_ins_kdm_details();
    //app.createtable_dcr_ins_ww_details();
    //app.createtable_dcr_ins_pp_details();

    //app.createtable_dcr_unlisted_ins_master();
    //app.createtable_dcr_unlisted_ins_ww_details();
    //app.createtable_dcr_unlisted_ins_pp_details();

    //app.createtable_dcr_master_ww_details_temp_master();
    //app.createtable_dcr_master_ww_details_temp_institution();


    app.createtable_tourplan_master();
    app.createtable_tourplan_master_ww_details();
    app.createtable_tourplan_master_mj_details();
}

// START_CUSTOM_CODE_kendoUiMobileApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_kendoUiMobileApp