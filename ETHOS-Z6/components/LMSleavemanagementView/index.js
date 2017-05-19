
'use strict';

(function () {
    var view = app.LMSleavemanagementView = kendo.observable();
    var LMSleavemanagementViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMSleavemanagementView");
            }
            app.navigation.logincheck();  
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            if (userdata.IsManager == 0) {
                $("#dvaccess_approval").hide();
            }
        },

        onRefresh: function () { 
            //app.utils.loading(true);
            //fun_db_APP_Get_Activity_Details($('#hdnLogin_ID').val());
        },

    });

    view.set('LMSleavemanagementViewModel', LMSleavemanagementViewModel);
}());

 
 