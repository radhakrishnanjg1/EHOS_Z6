'use strict';

(function () {

    var view = app.authenticationView = kendo.observable({
        onShow: function (e) {
            var actionvalue = e.view.params.action;
            if (actionvalue == "logout") {
                app.utils.loading(true);
                var user = JSON.parse(localStorage.getItem("userdata"));
                fun_db_APP_User_Logout(user.Login_ID, user.Employee_ID, app.utils.deviceinformation('Logout'));
                $('#username').val('');
                $('#password').val('');
                $('#hdnLogin_ID').val('0');
                localStorage.clear();
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
            username: 'ZE-Imphal1', //field
            password: 'dilip',

            //////username: 'ZE-RM-GUWAHATI1', //rm
            //////password: 'himalaya', 

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
            if (model.username == '') {
                username = model.username;
                app.notify.error("Enter username!");
                return false;
            }

            if (model.password == '') {
                password = model.password;
                app.notify.error("Enter password!");
                return false;
            }
            app.utils.loading(true);
            fun_db_APP_Verify_Field_User_Authentication(model.username, model.password, app.utils.deviceinformation('Login'));
        },
    });

    view.set('authenticationViewModel', vm);
}());


function fun_db_APP_Verify_Field_User_Authentication(username, password, deviceinfo) {
    var storelogin = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Verify_Field_User_Authentication",
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
            localStorage.clear();
            localStorage.setItem("userdata", JSON.stringify(data[0][0])); // userdata details 

            localStorage.setItem("ethosmastervalues", JSON.stringify(data[1])); // ethosmastervalues details 
            //app.navigation.navigateMSLView();
            //app.utils.loading(false);
            //$('#limsllist').show();
            if (data[0][0].IsManager == 0) {
                $('#liindvcoverage').show();
                //$('#lifieldlocator').hide();
                $('#limsllist').show();
                //redirect dashboard/indiviual  page 
                app.navigation.navigateMSLView();// navigatedashboard
                app.utils.loading(false);
            }
            else if (data[0][0].IsManager == 1) {
                $('#liteamcoverage').show();
                //$('#lifieldlocator').show();
                $('#limsllist').hide();
                //redirect dashboard/team coverage page 
                app.navigation.navigateTeamAbsensesView();//navigateteamcoverage
                app.utils.loading(false);
            }
            app_db_init();
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
        }
        else {
            app.notify.error(data[0].Output_Message);
            app.utils.loading(false);
        }
    });

}
