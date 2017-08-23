
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

        onRefresh: function () {  
        },

    });

    view.set('DCRmanagementViewModel', DCRmanagementViewModel);
}());

 
 