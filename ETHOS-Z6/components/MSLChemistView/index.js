
'use strict';

(function () {
    var view = app.MSLChemistView = kendo.observable();
    var MSLChemistViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MSLChemistView");
            }
            app.navigation.logincheck();

        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Z6_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID);

        },
    });

    view.set('MSLChemistViewModel', MSLChemistViewModel);
}());

function fun_db_APP_Get_Z6_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_MSL_Details_By_Employee_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                }
            }
        },
        schema: {
            parse: function (response) {
                var getdata = response.Result.Data;
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        //localStorage.setItem("doctomsldetailsdetails", JSON.stringify(data[0])); 
        //localStorage.setItem("msldetailsdetails", JSON.stringify(data[1]));
        //load_doctor_msldetails(JSON.stringify(data[0]));
        load_chemist_msldetails(JSON.stringify(data[1]));
        $('#dvmslchemistdetails').show();
        //sadsdsss
    });
}
 
function load_chemist_msldetails(records) {
    var lvmsldetails2 = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails2 = new kendo.data.DataSource({
        data: lvmsldetails2,
    });
    $("#listview-chemistmsldetails").kendoMobileListView({
        dataSource: dsmsldetails2,
        filterable: [
            {
                field: 'Chemist_Search_Keyword',
                operator: 'contains',
                ignoreCase: true
            } 
        ],
        dataBound: function (e) {//
            if (this.dataSource.data().length == 0) { 
                $("#listview-chemistmsldetails").append("<li>No Records Found!</li>");
            }
        }, 
        template: $("#template-chemistmsldetails").html() 
    });
}
