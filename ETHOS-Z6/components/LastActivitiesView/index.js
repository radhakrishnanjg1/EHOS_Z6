
'use strict';

(function () {
    var view = app.LastActivitiesView = kendo.observable();
    var LastActivitiesViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LastActivitiesView");
            }
            app.navigation.logincheck();

        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID); 
            if (localStorage.getItem("lastactivities_details_live") == null ||
                localStorage.getItem("lastactivities_details_live") != 1) {
                init_LastActivitiesView();
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_Last_DCR_TP_EXP(Employee_ID);
            }
        },
        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Z6_Employee_Last_DCR_TP_EXP(Employee_ID);
        },
    });

    view.set('LastActivitiesViewModel', LastActivitiesViewModel);
}());

function init_LastActivitiesView() {

    $("#listview-lastactivities").kendoMobileListView({
        dataSource: [],
        filterable: {
            field: 'Employee_Name',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-lastactivities").append("<li>No records found!</li>");
            }
        },
        template: $("#template-lastactivities").html()
    });
}

function load_LastActivitiesView(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-lastactivities").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_db_APP_Get_Z6_Employee_Last_DCR_TP_EXP(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_Last_DCR_TP_EXP",
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
        load_LastActivitiesView(JSON.stringify(data));
        localStorage.setItem("lastactivities_details_live", 1);
    });
} 
 

