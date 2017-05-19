'use strict';
(function () {
    var view = app.changepasswordView = kendo.observable();
    var validator;
    var changepasswordViewModel = kendo.observable({
        profile: null,
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("changepasswordView");
            }
            app.navigation.logincheck();   
            var profile = kendo.observable({
                oldpassword: "",
                newpassword: "",
                confirmpassword: "",
            });
            this.set('profile', profile); 
        },
        updatepassword: function () { 
            var profile = this.profile;
            var user = JSON.parse(localStorage.getItem("userdata"));
            var model = {
                Id: user.Employee_ID
            };
            if (profile.oldpassword ==="") {
                app.notify.error('Enter old password!');
                return;
            }
            else if (profile.newpassword === "") {
                app.notify.error('Enter new password!');
                return;
            }
            else if (profile.confirmpassword === "") {
                app.notify.error('Enter confirm password!');
                return;
            }
            else if (profile.oldpassword !== user.Password) {
                app.notify.error('Password is not matched!');
                return;
            }
            else if (profile.oldpassword === profile.newpassword) {
                app.notify.error('Old password and new password should be not same!');
                return;
            }
            else if (profile.newpassword !== profile.confirmpassword) {
                app.notify.error('New password and confirm password must be same!');
                return;
            }

            var loginid = user.Login_ID;
            var confirmpassword = profile.confirmpassword;
            // alert(loginid + "|" + confirmpassword);
            //update password 
            fun_dbupdatepassword(loginid, confirmpassword);
            var profile = kendo.observable({
                oldpassword: "",
                newpassword: "",
                confirmpassword: "",
            });
           // app.user.Password = confirmpassword; 
            this.set('profile', profile);
        }
    });

    view.set('changepasswordViewModel', changepasswordViewModel);
}());

function fun_dbupdatepassword(login_id, password) {
    var datacheck = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Change_Password",
                type: "POST",
                dataType: "json",
                data: {
                    "Login_ID": login_id, "Password": password
                }
            }
        },
        schema: {
            parse: function (response) {
                var data = response.Result.Data[0];
                return data;
            }
        }
    });
    app.utils.loading(true);
    datacheck.fetch(function () {
        var data = this.data();
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            app.navigation.navigateAuthentication();
            app.utils.loading(false);
        }
        else {
            app.notify.error(data[0].Output_Message);
        }
        app.utils.loading(false);
    });

}

