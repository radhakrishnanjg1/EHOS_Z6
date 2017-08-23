
'use strict';

(function () {
    var view = app.AppDashboardView = kendo.observable();
    var AppDashboardViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("AppDashboardView");
            }
            app.navigation.logincheck();   
        }, 

    });

    view.set('AppDashboardViewModel', AppDashboardViewModel);
}());

 
 