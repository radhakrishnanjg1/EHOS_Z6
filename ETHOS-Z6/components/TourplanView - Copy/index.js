
'use strict';

(function () {
    var view = app.TourplanView = kendo.observable();
    var TourplanViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("TourplanView");
            }
            app.navigation.logincheck();
            
        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            var Month = parseInt(new Date().getMonth() + 1);
            var Year = parseInt(new Date().getFullYear());
            app.utils.loading(true);
            fun_db_APP_Get_TourPlan_By_Employee_ID(Employee_ID, Sub_Territory_ID,
                Month, Year); 
        },
    });

    view.set('TourplanViewModel', TourplanViewModel);
}());


function fun_db_APP_Get_TourPlan_By_Employee_ID(Employee_ID, Sub_Territory_ID,
                Month, Year) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_TourPlan_By_Employee_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "Month": Month,
                    "Year": Year
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
        localStorage.setItem("tourplandetails", JSON.stringify(data));
        load_tourplan_details(JSON.stringify(data));
        init_tourplan_Scheduler(JSON.stringify(data));
        $('#dvtourplanview').show();
    });
}

function load_tourplan_details(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-tourplanldetails").kendoMobileListView({
        dataSource: dsmsldetails,
        //filterable: [
        //    { field: "Chemist_Name", operator: 'contains' },  
        //],
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-tourplanldetails").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-tourplanldetails").html(),
    });
}

function init_tourplan_Scheduler(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var ds = new kendo.data.DataSource({
        data: ds,
    });
    $("#scheduler").kendoScheduler({
        //width: 100,
        date: new Date(),
        //mobile: "phone",
        views: [{
            type: "month",
            dateHeaderTemplate: kendo.template("<strong>#=kendo.toString(date, 'd')#</strong>")
            //editable: false
        },
        ],
        selectable: true,
        //dataSource:ds,
        //dataSource: [
        //{
        //    id: 1,
        //    start: new Date("2017/5/15"),
        //    end: new Date("2017/5/15"),
        //    title: "a",
        //    atendees: [1, 2]
        //},
        //{
        //    id: 2,
        //    start: new Date("2017/5/7"),
        //    end: new Date("2017/5/7"),
        //    title: "b",
        //    atendees: [1, 2]
        //}
        //],
        editable: {
            template: $("#editor").html(),
            update: false,
            destroy: false
        },
        change: function (e) {
            var TourPlan_Details_ID = e.TourPlan_Details_ID;
            //var end = e.end;
            //app.navigation.navigateLMSleavemanagementView();
        },
        footer: false,
    });
    var scheduler = $("#scheduler").data("kendoScheduler");
    var dataSource = new kendo.data.SchedulerDataSource({
        data: ds
    });
    scheduler.setDataSource(dataSource);
}
