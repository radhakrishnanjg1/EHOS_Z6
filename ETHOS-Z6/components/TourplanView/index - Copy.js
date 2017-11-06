
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
            if (localStorage.getItem("tourplanviewdetails_live") == null ||
                localStorage.getItem("tourplanviewdetails_live") != 1) {
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID);
           }
        },

        onRefresh: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            app.utils.loading(true);
            fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID);

        },
    });

    view.set('TourplanViewModel', TourplanViewModel);
}());


function fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID)                  {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_TP_Details",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
                    "Sub_Territory_ID": Sub_Territory_ID 
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
        localStorage.setItem("tourplanviewdetails", JSON.stringify(data)); 
        localStorage.setItem("tourplanviewdetails_live",1);
        $('#dvtourplanview').show();
        loadmonth_tourplan_calendar();
        var d = new Date();
        var currentmonvalu = d.getMonth() + 1;
        var currentdate = new Date();
        load_tourplan_details_today(currentdate);
        load_tourplan_details_month(currentmonvalu);
    });
}

function loadmonth_tourplan_calendar() {
    $("#tourplan-details-calendar > table").remove();

    $("#tourplan-details-calendar > div").remove(); 
    $("#tourplan-details-calendar").kendoCalendar({
        depth: "month", 
        value: new Date(), 
        change: function () {
            var value = this.value();
            var d = new Date(value);
            var currentmonvalu = d.getMonth() + 1; 
            var currentdate = new Date(value);
            load_tourplan_details_today(currentdate);
            load_tourplan_details_month(currentmonvalu);
        },
        navigate: function () {
            var current = this.current();
            var d = new Date(current); 
            var currentmonvalu = d.getMonth() + 1;
            var currentdate = new Date(current);
            load_tourplan_details_today(currentdate)
            load_tourplan_details_month(currentmonvalu);
        },
        footer: false,
    });
    function compareDates(date, dates) {
        for (var i = 0; i < dates.length; i++) {
            var actualdate = todateddmmyyy_hyphen(date);
            if (dates[i].HolidayDate == actualdate) {
                return true;
            }
        }
    }
}

function load_tourplan_details_today(today) {
    today = todateddmmyyy_hyphen(today);
    var records = JSON.parse(localStorage.getItem("tourplanviewdetails"));
    var lvmsldetails = JSON.parse(Enumerable.From(records)
       .Where("$.TourPlan_Date=='" + today + "'")
     .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-tourplanldetailstoday").kendoMobileListView({
        dataSource: dsmsldetails,
        //filterable: [
        //    { field: "Chemist_Name", operator: 'contains' },  
        //],
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-tourplanldetailstoday").append("<li style='color:#ff6600!important'>No records found!</li>");
            }
        },
        template: $("#template-tourplanldetailstoday").html(),
    });
}


function load_tourplan_details_month(month) { 
    var records = JSON.parse(localStorage.getItem("tourplanviewdetails"));
    var lvmsldetails = JSON.parse(Enumerable.From(records)
         .Where("$.TourPlan_Month==" + month + "")
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-tourplanldetailsmonth").kendoMobileListView({
        dataSource: dsmsldetails,
        //filterable: [
        //    { field: "Chemist_Name", operator: 'contains' },  
        //],
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#listview-tourplanldetailsmonth").append("<li style='color:#ff6600!important'>No records found!</li>");
            }
        },
        template: $("#template-tourplanldetailsmonth").html(),
    });

    var months = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];
    $('#spanmonthtp').html(months[month - 1]);
} 

function fun_open_modalviewtourplanview(e) {
    $("#modalview-tourplanview").kendoMobileModalView("open");
    var data = e.button.data();
    var TourPlan_Date = data.tourplan_date;

    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("tourplanviewdetails"));
    var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
    .Where("$.TourPlan_Date=='" + TourPlan_Date+"'")
        .ToJSON());

    var dataSource = new kendo.data.DataSource({
        data: ethosmastervaluesrecords,
        batch: true,
        schema: {
            model: { 
                fields: {
                    Institution_Name: { type: "string", editable: false },
                    Name_of_Key_Decision_Maker: { type: "string", editable: false },
                    
                }
            }
        }
    });
    $("#tourplan-inskdmlist").kendoGrid({
        dataSource: dataSource,
        columns: [
             { enabled: false, title: "Institution", field: "Institution_Name", editable: false, },
           { enabled: false, title: "KDM", field: "Name_of_Key_Decision_Maker", editable: false, },
            ],
        editable: true
    });
}

function fun_close_modalviewtourplanview() {
    $("#modalview-tourplanview").kendoMobileModalView("close");
}