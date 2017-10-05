'use strict';

(function () {

    var view = app.authenticationView = kendo.observable({
        onShow: function (e) {
            var actionvalue = e.view.params.action;
            if (actionvalue == "logout") {
                app.utils.loading(true);
                var user = JSON.parse(localStorage.getItem("userdata"));
                fun_db_APP_User_Logout(user.Login_ID, user.Employee_ID, app.utils.deviceinformation('Logout'));
                 
            }
            if (app.user != null) {
                return app.navigation.navigatedashboard();
            }
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("authenticationView");
            }
        },
    });

    var provider = app.data.defaultProvider;
    var mode = app.constants.authenticationModeSignin;
    var registerRedirect = 'activitiesView';
    var signinRedirect = 'activitiesView';



    var vm = kendo.observable({
        user: {
            displayName: '',
            //username: '',
            //password: '',
            //username: 'ze-surat3',
            //password: 'rahul',
            username: 'ZE-RM-SURAT2',
            password: '9138',
            //username: 'ZE-Imphal1', //field
            //password: 'dilip',
            //username: 'ZR-MANGALDOI1', //field
            //password: 'pankaj',
            ////username: 'ZE-RM-GUWAHATI1', //rm
            ////password: 'himalaya',

            //username: 'ZE-ZM-GUWAHATI1', //zm
            //password: 'emp73',
            //username: 'ZE-SM-KOLKATA1', //sm
            //password: 'emp66',
            // vacant credentials 
            //username: 'VACANT(ze-ALIGARH3)', //field
            //password: 'NEW',

            //username: 'VACANT(ZE-RM-INDORE1)', //rm
            //password: 'VACANT(ZE-RM-INDORE1)',

            //email: ''
        },
        loginValidator: null,
        registerValidator: null,
        signin: function (username, password) {
            var model = vm.user;
            if ($('#username').val() == '' || model.username == '' || model.username == undefined) {
                username = model.username;
                app.notify.error("Enter username!");
                return false;
            }
            if ($('#password').val() == '' || model.password == '' || model.password == undefined) {
                password = model.password;
                app.notify.error("Enter password!");
                return false;
            }
            app.utils.loading(true);
            fun_db_APP_Verify_Field_Z6_User_Authentication(model.username, model.password, app.utils.deviceinformation('Login'));
        },
    });

    view.set('authenticationViewModel', vm);
}());


function fun_db_APP_Verify_Field_Z6_User_Authentication(username, password, deviceinfo) {
    var storelogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Verify_Field_Z6_User_Authentication",
                type: "POST",
                dataType: "json",
                data: {
                    "Username": username, "Password": password, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getlogin = response.Result.Data;
                return getlogin;
            }
        }
    });

    storelogin.fetch(function () {
        var data = this.data();
        if (data[0][0].Output_ID == 1) {
            $('#dvusername').html(data[0][0].Employee_Name)
            $('#hdnLogin_ID').val(data[0][0].Login_ID)
            $('#hdnEmployee_ID').val(data[0][0].Employee_ID)
            $('#dvlast_visited').html(data[2][0].Last_Visited);
            localStorage.clear();
            localStorage.setItem("userdata", JSON.stringify(data[0][0])); // userdata details 

            localStorage.setItem("ethosmastervalues", JSON.stringify(data[1])); // ethosmastervalues details 
            app_db_init(); 
            app.navigation.navigateAppDashboardView();  //navigateAppDashboardView
            app.utils.loading(false); 
            if (data[0][0].IsManager == 1) {
                localStorage.setItem("ethosinssubordinatesdetails", JSON.stringify(data[3])); // coverage details 
            }
            //if (data[0][0].IsManager == 0) {
            //    $('#dvindvcoverage').show();
            //    //$('#lifieldlocator').hide(); 
            //    //redirect dashboard/indiviual  page 
            //    app.navigation.navigateAppDashboardView();//navigateEDetailingView,
            //    //navigateMSLView, navigatedashboard
            //    app.utils.loading(false);
            //}
            //else if (data[0][0].IsManager == 1) {
            //    $('#dvteamcoverage').show();
            //    //$('#lifieldlocator').show(); 
            //    //redirect dashboard/team coverage page 
            //    app.navigation.navigateAppDashboardView();//navigateEDetailingView, navigateTeamAbsensesView,navigateteamcoverage
            //    app.utils.loading(false);
            //}
        }
        else {
            app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_User_Logout(Login_ID, Employee_ID, deviceinfo) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_User_Logout",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": Login_ID, "Employee_ID": Employee_ID, "DeviceInfo": deviceinfo
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.utils.loading(false);
            $('#username').val('');
            $('#password').val('');
            $('#hdnLogin_ID').val('0');
            localStorage.clear();
        }
        else {
            app.notify.error(data[0].Output_Message);
            app.utils.loading(false);
        }
    });

}

