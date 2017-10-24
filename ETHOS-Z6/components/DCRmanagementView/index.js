
'use strict';

(function () {
    var view = app.DCRmanagementView = kendo.observable();
    var DCRmanagementViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRmanagementView");
            }
            app.navigation.logincheck();   
        },
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var DCR_Type = parseInt(userdata.DCR_Type);
            if (DCR_Type == 0) { 
                $("#dvnavigatedcrstartview").show();  
            }
            else {
                $("#dvnavigatedcrstartview").hide(); 
            }
        },
        onRefresh: function () {  
        },

    });

    view.set('DCRmanagementViewModel', DCRmanagementViewModel);
}());

 
 