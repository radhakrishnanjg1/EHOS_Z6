
'use strict';

(function () {
    var view = app.MyTeamView = kendo.observable();
    var MyTeamViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MyTeamView");
            }
            app.navigation.logincheck();

        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID); 
            if (localStorage.getItem("myteammembers_details_live") == null ||
                localStorage.getItem("myteammembers_details_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_Team_Members(Employee_ID);
            }
        },
        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Z6_Employee_Team_Members(Employee_ID);
        },
    });

    view.set('MyTeamViewModel', MyTeamViewModel);
}());


function fun_db_APP_Get_Z6_Employee_Team_Members(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_Team_Members",
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
        //localStorage.setItem("lastactivities_details", JSON.stringify(data));
        localStorage.setItem("myteammembers_details_live", 1);
       // $('#dvMyTeamView').show();
        load_MyTeamView(JSON.stringify(data));
    });
}

function load_MyTeamView(records) {
    var lvleavehistory = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsleavehistory = new kendo.data.DataSource({
        data: lvleavehistory,
    });
    $("#listview-teammembersdetails").kendoMobileListView({
        dataSource: dsleavehistory,
        filterable: {
            field: 'Employee_Name',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-teammembersdetails").append("<li>No records found!</li>");
            }
        },
        template: $("#template-teammembersdetails").html(),
    });
}
 

