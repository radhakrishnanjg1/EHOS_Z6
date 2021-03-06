
'use strict';

(function () {
    var view = app.dashboardView = kendo.observable();
    var dashboardViewModel = kendo.observable({
        onShow: function () { 
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("dashboardView");
            }
            app.navigation.logincheck();
            if (localStorage.getItem("ethosinscoveragedetails_live") == null || localStorage.getItem("ethosinscoveragedetails_live") != 1) {
                 
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                app.utils.loading(true);
                fun_db_APP_Get_MSL_Coverage_Details_Z6_Employee(Employee_ID); 
            }
            var user = JSON.parse(localStorage.getItem("userdata"));
            $('#dvemployeename').html(user.Employee_Name);
        },
        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Current_MSL_Coverage_Details_Z6_Employee(Employee_ID);
        },
    });

    view.set('dashboardViewModel', dashboardViewModel);
}());

function fun_db_APP_Get_Current_MSL_Coverage_Details_Z6_Employee(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Current_MSL_Coverage_Details_Z6_Employee",
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
        },
        error: function (e) {
            app.utils.loading(false);
            app.notify.error('Error loading data please try again later.!');
            //alert(e);
            if (e.errorThrown == "ERR_EMPTY_RESPONSE") {
                // app.notify.error('Error loading data please try again later.!');
            }
            else if (e.errorThrown == "Unauthorized") {
                // ...navigate("#login");
                //ERR_EMPTY_RESPONSE
            }
            else {

            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0].SNO > 0) {
            loadchart(1);
            localStorage.setItem("ethosinscoveragedetailscurrentmonth", JSON.stringify(data)); // coverage details  
            localStorage.setItem("ethosinscoveragedetailscurrentmonth_refresh", 1);
            //  loadcurrentmonthdata(parseInt($('#hdnchartslno').val()));
            loadcurrentmonthdata(1);
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function fun_db_APP_Get_MSL_Coverage_Details_Z6_Employee(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_MSL_Coverage_Details_Z6_Employee",
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
        },
        error: function (e) {

            app.utils.loading(false); // alert(e);
            app.notify.error('Error loading data please try again later.!');
            if (e.errorThrown == "ERR_EMPTY_RESPONSE") {
                // app.notify.error('Error loading data please try again later.!');
            }
            else if (e.errorThrown == "Unauthorized") {
                // ...navigate("#login");
                //ERR_EMPTY_RESPONSE
            }
            else {

            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        if (data[0].SNO > 0) {
            localStorage.setItem("ethosinscoveragedetails", JSON.stringify(data)); // coverage details 
            localStorage.setItem("ethosinscoveragedetails_live", 1);
            $('#dvvisionsummarycoveragedetails').show();
            loadchart(1);
            loadcurrentmonthdatafa(1);
            app.utils.loading(false);
        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}


function loadchart(filterid) {
    var localdata = JSON.parse(localStorage.getItem("ethosinscoveragedetails"));
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });
    var chartdata = JSON.parse(Enumerable.From(localdata)
        .Where("$.SNO==" + filterid + " && $.DataMonth != '" + currentmonname + "'")
        .ToJSON());

    var chartcurrentdatafa = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());
    localStorage.setItem("ethosinscoveragedetails_live_currentmonth", JSON.stringify(chartcurrentdatafa));
    loadcurrentmonthdatafa(filterid);

    //$("#spanchartdivisionname").html(chartdata[0].Division_Name);
    //$("#hdnchartslno").val(chartdata[0].SNO);

    $("#chartbarcoveragedetails").kendoChart({
        theme: "nova",
        title: {
            text: "Coverage and Average Details",
            font: "bold 18px HimalayaFont",
            color: "#ff6600",
        },
        legend: {
            position: "bottom",
            labels: {
                font: "bold 12px HimalayaFont",
            },
        },
        dataSource: {
            data: chartdata,
            group: { field: "Parameter" },
            sort: [
                 { "field": "OrderByChart", "dir": "asc" },
            ],

        },
        series: [{
            field: "ParameterValue",
        }],
        categoryAxis: {
            field: "DataMonth",
            labels: {
                font: "bold 12px HimalayaFont",
            }
        },
        valueAxis: [{
            labels: {
                format: "{0}"
            }
        }, ],
        tooltip: {
            visible: true
        },
    });

}

function loadcurrentmonthdatafa(filterid) {
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });

    var localdata = JSON.parse(localStorage.getItem("ethosinscoveragedetails_live_currentmonth"));

    var currentmonthdata = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());

    var divisionsource = new kendo.data.DataSource({
        data: currentmonthdata,
        group: { field: "GroupByName" },
        sort: [
                 { "field": "OrderByValue", "dir": "asc" },
        ],
    });
    $("#chartdivisionlist-listview").kendoMobileListView({
        dataSource: divisionsource,
        template: $("#template-chartdivisionlist").html(),
    });

    $('#chartdivisionlist-listview .km-group-title').hide();
    $('#chartdivisionlist-listview li[class="km-group-container"]').wrap('<div class="row " ><div class="col-xs-12" style="padding:0"/></div>').contents().unwrap();
    $('#chartdivisionlist-listview ul[class="km-list"] li').wrap('<div class="col-xs-4"/>').contents().unwrap();
    $('#chartdivisionlist-listview div ul div[class="col-xs-4"]')
        .css({ "background-color": "#006666 !important", "color": "#33404E" });

}

function loadcurrentmonthdata(filterid) {
    var objdate = new Date(),
    locale = "en-us",
    currentmonname = objdate.toLocaleString(locale, { month: "short" });

    var localdata = JSON.parse(localStorage.getItem("ethosinscoveragedetailscurrentmonth"));
    var currentmonthdata = JSON.parse(Enumerable.From(localdata)
       .Where("$.SNO==" + filterid + " && $.DataMonth == '" + currentmonname + "'")
       .ToJSON());

    //$("#spanchartdivisionname").html(currentmonthdata[0].Division_Name);
    //$("#hdnchartslno").val(currentmonthdata[0].SNO);

    var divisionsource = new kendo.data.DataSource({
        data: currentmonthdata,
        group: { field: "GroupByName" },
        sort: [
                 { "field": "OrderByValue", "dir": "asc" },
        ],
    });
    $("#chartdivisionlist-listview").kendoMobileListView({
        dataSource: divisionsource,
        template: $("#template-chartdivisionlist").html(),
    });

    $('#chartdivisionlist-listview .km-group-title').hide();
    $('#chartdivisionlist-listview li[class="km-group-container"]').wrap('<div class="row " ><div class="col-xs-12" style="padding:0"/></div>').contents().unwrap();
    $('#chartdivisionlist-listview ul[class="km-list"] li').wrap('<div class="col-xs-4"/>').contents().unwrap();
    $('#chartdivisionlist-listview div ul div[class="col-xs-4"]')
        .css({ "background-color": "#006666 !important", "color": "#33404E" });

}

function gotochartnextrecord(e) {
    var data = e.button.data();
    var direction = data.direction;
    var filterid = parseInt($('#hdnchartslno').val());
    filterid = findchartdirection(direction, filterid);
    loadchart(filterid);
    //loadcurrentmonthdatafa(filterid);
    if (localStorage.getItem("ethosinscoveragedetailscurrentmonth_refresh") != null
        || localStorage.getItem("ethosinscoveragedetailscurrentmonth_refresh") == 1) {

        loadcurrentmonthdata(filterid);
    }
}

function gotoswipedirectioncoveragedetails(e) {
    var direction = e.direction;
    var filterid = parseInt($('#hdnchartslno').val());
    filterid = finddirection(direction, filterid);
    loadchart(filterid);
    // loadcurrentmonthdatafa(filterid);
    if (localStorage.getItem("ethosinscoveragedetailscurrentmonth_refresh") != null
         || localStorage.getItem("ethosinscoveragedetailscurrentmonth_refresh") == 1) {
        loadcurrentmonthdata(filterid);
    }
}

function findchartdirection(direction, filterid) {
    if (direction == "right") {
        if (filterid != 1) {
            filterid = parseInt(filterid) - 1;
        }
        else {
            app.notify.warning('No more records.!');
        }
    }
    else {
        var totalSLNO = Enumerable
            .From(JSON.parse(localStorage.getItem("ethosinscoveragedetails")))
            .Select("$.SNO")
            .Distinct().ToArray();
        if (filterid != totalSLNO.length) {
            filterid = parseInt(filterid) + 1;
        }
        else {
            app.notify.warning('No more records.!');
        }
    }
    return filterid;
}

