
'use strict';

(function () {
    var view = app.EDetailingView = kendo.observable();
    var EDetailingViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("EDetailingView");
            }
            app.navigation.logincheck();
        },
        afterShow: function () { 
        },
    });

    view.set('EDetailingViewModel', EDetailingViewModel);
}());
