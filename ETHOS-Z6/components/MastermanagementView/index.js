
'use strict';

(function () {
    var view = app.MastermanagementView = kendo.observable();
    var MastermanagementViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MastermanagementView");
            }
            app.navigation.logincheck();  
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            if (userdata.IsManager == 0) {
                $('.dvaccess_msl').show(); 
            }
            else
            {
                $('.dvaccess_msl').hide();
            }
        },

        onRefresh: function () { 
            //app.utils.loading(true);
            //fun_db_APP_Get_Activity_Details($('#hdnLogin_ID').val());
        },

    });

    view.set('MastermanagementViewModel', MastermanagementViewModel);
}());

 
 