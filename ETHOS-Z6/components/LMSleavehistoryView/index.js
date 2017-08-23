
'use strict';

(function () {
    var view = app.LMSleavehistoryView = kendo.observable();
    var LMSleavehistoryViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMSleavehistoryView");
            }
            app.navigation.logincheck(); 
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            if (localStorage.getItem("LMSleavehistorydetails_live") == null ||
               localStorage.getItem("LMSleavehistorydetails_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_Get_Employee_CurrentYear_Leave_History(Employee_ID);
            }

        },
        onRefresh: function () { 
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Employee_CurrentYear_Leave_History(Employee_ID);
        },
    });

    view.set('LMSleavehistoryViewModel', LMSleavehistoryViewModel);
}());
 
function fun_db_APP_Get_Employee_CurrentYear_Leave_History(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Employee_CurrentYear_Leave_History",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID
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
        app.utils.loading(false);
       // localStorage.setItem("leavehistorydetails", JSON.stringify(data)); 
        localStorage.setItem("LMSleavehistorydetails_live", 1);
        loadleavehistory(JSON.stringify(data));
        $('#dvleavehistory').show();
    }); 
}
function loadleavehistory(records) {
    var alldivision = JSON.parse(records); 
    $("#listview-leavehistory").kendoMobileListView({
        dataSource: alldivision,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-leavehistory").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-leavehistory").html(), 
    });
   // $('#listview-leavehistory ul[class="km-list"] li').wrap('<div class="col-xs-12"/>').contents().unwrap();
     
}
