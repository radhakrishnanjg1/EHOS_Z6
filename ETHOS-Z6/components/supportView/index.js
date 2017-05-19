
'use strict';

(function () {
    var view = app.supportView = kendo.observable();
    var supportViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("supportView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () {
            $('#span_appversion').html(app.constants.appversion);
            var user = JSON.parse(localStorage.getItem("userdata"));
            var TechSupportEmail = user.TechSupportEmail;
            var TechSupportMobile = user.TechSupportMobile;
            $('#anchartechsupportemail').attr("href", TechSupportEmail + "&subject=" + app.constants.appname + " App Queries");
            $('#anchartechsupportmobile').attr("href", TechSupportMobile);
        },
    });

    view.set('supportViewModel', supportViewModel);
}());
