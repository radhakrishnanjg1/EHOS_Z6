
'use strict';

(function () {
    var view = app.TeamAbsensesView = kendo.observable();
    var TeamAbsensesViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("TeamAbsensesView");
            }
            app.navigation.logincheck();
            
        },

        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID); 
            app.utils.loading(true);
            fun_db_APP_Get_Employee_Absenses(Employee_ID); 
        },
    });

    view.set('TeamAbsensesViewModel', TeamAbsensesViewModel);
}());


function fun_db_APP_Get_Employee_Absenses(Employee_ID)                  {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Employee_Absenses",
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
        localStorage.setItem("teamabsensesviewdetails", JSON.stringify(data)); 
        $('#dvTeamAbsensesView').show();
        loadmonth_absenses_calendar();
        var d = new Date();
        var currentmonvalu = d.getMonth() + 1;
        var currentdate = new Date();
        load_absenses_details_today(currentdate);
        load_absenses_details_month(currentmonvalu);
    });
}

function loadmonth_absenses_calendar() {
    $("#absenses-details-calendar > table").remove();

    $("#absenses-details-calendar > div").remove(); 
    $("#absenses-details-calendar").kendoCalendar({
        depth: "month", 
        value: new Date(), 
        change: function () {
            var value = this.value();
            var d = new Date(value);
            var currentmonvalu = d.getMonth() + 1; 
            var currentdate = new Date(value);
            load_absenses_details_today(currentdate);
            load_absenses_details_month(currentmonvalu);
        },
        navigate: function () {
            var current = this.current();
            var d = new Date(current); 
            var currentmonvalu = d.getMonth() + 1;
            var currentdate = new Date(current);
            load_absenses_details_today(currentdate)
            load_absenses_details_month(currentmonvalu);
        },
        footer: false,
    });
    function compareDates(date, dates) {
        for (var i = 0; i < dates.length; i++) {
            var actualdate = todateddmmyyy(date);
            if (dates[i].HolidayDate == actualdate) {
                return true;
            }
        }
    }
}

function load_absenses_details_today(today) {
    today = todateddmmyyy(today);
    var records = JSON.parse(localStorage.getItem("teamabsensesviewdetails"));
    var lvmsldetails = JSON.parse(Enumerable.From(records)
       .Where("$.FromDate=='" + today + "'  ||  $.ToDate=='" + today + "'")
     .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-absensesldetailstoday").kendoMobileListView({
        dataSource: dsmsldetails,
        //filterable: [
        //    { field: "Chemist_Name", operator: 'contains' },  
        //],
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-absensesldetailstoday").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-absensesldetailstoday").html(),
    });
}

function load_absenses_details_month(month) { 
    var records = JSON.parse(localStorage.getItem("teamabsensesviewdetails"));
    var lvmsldetails = JSON.parse(Enumerable.From(records)
         .Where("$.For_Month==" + month + "")
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-absensesldetailsmonth").kendoMobileListView({
        dataSource: dsmsldetails,
        //filterable: [
        //    { field: "Chemist_Name", operator: 'contains' },  
        //],
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-absensesldetailsmonth").append("<li>No Records Found!</li>");
            }
        },
        template: $("#template-absensesldetailsmonth").html(),
    });

    var months = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];
    $('#spanmonthabsenses').html(months[month - 1]);
}
 
