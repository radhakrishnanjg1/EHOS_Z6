
'use strict';

(function () {
    var view = app.DCRreportView = kendo.observable();
    var DCRreportViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRreportView");
            }
            app.navigation.logincheck();

        }, 
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            var Month = parseInt(new Date().getMonth() + 1);
            var Year = parseInt(new Date().getFullYear()); 
            if (localStorage.getItem("dcrreportview_live") == null ||
                localStorage.getItem("dcrreportview_live") != 1) {
                init_dcrreportview();
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_DailyReport(Employee_ID, Sub_Territory_ID, Month, Year);
            } 
            var Employee_Name = userdata.Employee_Name;
            if (userdata.IsManager == 1) {
                $("#dvdcrreportview_manager").show(); 
                $("#dvdcrreportview_team").show();
                loadsubordinatesdetails_dcrreportview();
            }
            else {
                $("#dvdcrreportview_manager").hide();
                $("#dvdcrreportview_team").hide();  
            }
            $('#dcrreportview_teamname').html(Employee_Name);
            $('#dcrreportview_txtauocmpemployeelist').val('');
            $("#dcrreportview_txtauocmpemployeelist").kendoAutoComplete({
                clearButton: false
            })
        },

        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },
        fun_close_dcrreportview_txtauocmpemployeelist: function () { 
            $('#dcrreportview_txtauocmpemployeelist').val('');
            setTimeout(function () {
                $("#dcrreportview_txtauocmpemployeelist").blur();
                var autocomplete = $("#dcrreportview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);  
        },
    });

    view.set('DCRreportViewModel', DCRreportViewModel);
}());

function loadsubordinatesdetails_dcrreportview() {
    var localdata = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("ethosinssubordinatesdetails")))
        .Where("$.Employee_Name!='ALL'")
        .ToJSON());
    //create AutoComplete UI component
    $("#dcrreportview_txtauocmpemployeelist").kendoAutoComplete({
        dataSource: localdata,
        dataTextField: "Employee_Name",
        valuePrimitive: true,
        ignoreCase: true,
        minLength: 1,
        filter: "contains",
        placeholder: "Type employee or sub-territory name",
        clearButton: false,
        //separator: ", "
        noDataTemplate: 'No records found!',
        change: function (e) {
            var value = this.value();
            var Month = parseInt(new Date().getMonth() + 1);
            var Year = parseInt(new Date().getFullYear());
            if (value.length > 6) {
                var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
                var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Employee_Name=='" + value + "'")
               .ToJSON());
                if (ethosmastervaluesrecords.length == 0) {
                    app.notify.error("Select valid employee name in list!");
                    return false;
                }
                var empid = value.split("|")[1];
                var ethosmastervaluesdata_sub = JSON.parse(Enumerable.From(ethosmastervaluesdata)
               .Where("$.Employee_ID==" + empid )
               .ToJSON());
                var Sub_Territory_ID = ethosmastervaluesdata_sub[0].Sub_Territory_ID; 
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_DailyReport(empid, Sub_Territory_ID,Month, Year);
            } 
            else {
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID); 
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_DailyReport(Employee_ID, Sub_Territory_ID, Month, Year);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#dcrreportview_txtauocmpemployeelist").blur();
                var autocomplete = $("#dcrreportview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}


function init_dcrreportview() {

    $("#listview-dcrreportdetails").kendoMobileListView({
        dataSource: [],
        //filterable: {
        //    field: 'Doctor_Search',
        //    operator: 'contains',
        //    ignoreCase: true
        //},
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-dcrreportdetails").append("<li>No records found!</li>");
            }
        },
        template: $("#template-dcrreportdetails").html()
    });
}

function load_dcrreportview(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-dcrreportdetails").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_db_APP_Get_Z6_Employee_DailyReport(Employee_ID, Sub_Territory_ID, Month,Year) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_DailyReport",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID,
                    "Month": Month,
                    "Year": Year,  
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
        load_dcrreportview(JSON.stringify(data)); 
        localStorage.setItem("dcrreportview_live", 1); 
        var userdata = JSON.parse(localStorage.getItem("userdata"));
        var Employee_Name = userdata.Employee_Name;
        if (userdata.IsManager == 1) {
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
           .Where("$.Employee_ID==" + Employee_ID + "")
           .ToJSON());
            $('#dcrreportview_teamname').html(ethosmastervaluesrecords[0].Employee_Name.split("|")[0]);
        }
    });
}

 
 
