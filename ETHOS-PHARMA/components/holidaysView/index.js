'use strict';

app.holidaysView = kendo.observable({ 
    onShow: function () {
        if (!app.utils.checkinternetconnection()) {
           return app.navigation.navigateoffline("holidaysView");
        }
        app.navigation.logincheck();
        if (localStorage.getItem("holidaydetails_live") == null || localStorage.getItem("holidaydetails_live") != 1) {
            app.utils.loading(true);
            fun_db_APP_Get_Field_Permited_Holiday_Master($('#hdnEmployee_ID').val());
           // fun_db_APP_Get_Permited_Holiday_Master(2756);
        } 
    }, 
});

function fun_db_APP_Get_Field_Permited_Holiday_Master(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Field_Permited_Holiday_Master",
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
        //app.utils.loading(false);
        //localStorage.setItem("holidaydetails", JSON.stringify(data)); // holiday  details 
        //localStorage.setItem("holidaydetails_live", 1);
        //loaddropdownlist();
        //loadcontrols();
        //$('#dvholidaysummary').show();
        app.utils.loading(false);
        if (data[0].SNO > 0) {
            localStorage.setItem("holidaydetails", JSON.stringify(data)); // holiday  details 
            localStorage.setItem("holidaydetails_live", 1);  
            loaddropdownlist();
            loadcontrols();
            $('#dvholidaysummary').show(); 
            app.utils.loading(false);

        }
        else {
            //app.notify.error(data[0][0].Output_Message);
            app.utils.loading(false);
        }
    });

}

function loadcontrols()
{
    var currentdivision = $('#ddldivisionlist').val();
    var currentstate = $('#ddlstatelist').val();
    var d = new Date();
    var currentmon = d.getMonth() + 1;
    var currentyear = d.getFullYear();
     loadyearholidays(currentdivision, currentstate, currentyear);
     loadmonthcalendar(currentdivision, currentstate,currentyear);
     loadmonthholidaydetails(currentdivision, currentstate, currentyear, currentmon);
}
function loaddropdownlist() {
     var divisionsource = Enumerable
                .From(JSON.parse(localStorage.getItem("holidaydetails"))) 
                .Select("$.Division_Name")
                .Distinct()
                 .ToArray();

    $("#ddldivisionlist").kendoDropDownList({ 
        dataSource: divisionsource,
        change: onchangedivision,
        //popup: {
        //    origin: "top left"
        //}
    }); 
    var statesource =  Enumerable
        .From(JSON.parse(localStorage.getItem("holidaydetails"))) 
        .Select("$.State") 
        .Distinct() 
        .ToArray(); 
    $("#ddlstatelist").kendoDropDownList({ 
        dataSource: statesource,
        change: onchangestate,
    });
    var userdata = JSON.parse(localStorage.getItem("userdata")); 
    if (userdata.IsManager == 0) {
        $("#dvholidayaccess").hide();
    }
}

function loadyearholidays(currentdivision, currentstate, currentyear) {
    var alldivision = JSON.parse(localStorage.getItem("holidaydetails"));
    var singledivision = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Division_Name=='" + currentdivision + "'   && $.State=='" + currentstate + "'" + "   && $.Year==" + currentyear + "")
       .ToJSON());
    $('#spanyear').html(currentyear); 
    var holidaydetails = new kendo.data.DataSource({
        data: singledivision, 
    });
    $("#yearholidays-listview").kendoMobileListView({
        dataSource: holidaydetails,
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logic
                $("#yearholidays-listview").append("<li>No holidays in this year!</li>");
            }
        },
        template: $("#template-yearholidays").html(),

    });
}

function loadmonthcalendar(currentdivision, currentstate,currentyear) { 
    $("#national-holidays > table").remove();

    $("#national-holidays > div").remove();

    var alldivision = JSON.parse(localStorage.getItem("holidaydetails"));  
    var monthholidaylist = Enumerable.From(alldivision)
       .Where("$.Division_Name=='" + currentdivision + "'   && $.State=='" + currentstate + "'")
      .Select("x => { HolidayDate: x['HolidayDate']}")
     .ToArray(); 
    var currentyearvalu = new Date().getFullYear(); 
    $("#national-holidays").kendoCalendar({ 
        depth: "month",
        min: new Date(currentyearvalu, 0, 1),
        max: new Date(currentyearvalu +1, 0, 31), 
        value: new Date(),
        dates: monthholidaylist,
        disableDates: function (date) {
            var dates = $("#national-holidays").data("kendoCalendar").options.dates;
            if (date && compareDates(date, dates)) {
                return true;
            } else { 
                return false;
            }
        }, 
        change: function () {
            var value = this.value();
            var d = new Date(value);
            var currentmonvalu = d.getMonth() + 1;
            var currentyear = d.getFullYear();
            loadyearholidays(currentdivision, currentstate, currentyear);
            loadmonthholidaydetails(currentdivision, currentstate,currentyear, currentmonvalu);
        },
        navigate: function () {
            var current = this.current();
            var d = new Date(current);
            var currentmonvalu = d.getMonth() + 1;
            var currentyear = d.getFullYear();
            loadyearholidays(currentdivision, currentstate, currentyear);
            loadmonthholidaydetails(currentdivision, currentstate, currentyear, currentmonvalu);
            
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

function loadmonthholidaydetails(currentdivision, currentstate, currentyear,currentmon) {
    var alldivision = JSON.parse(localStorage.getItem("holidaydetails"));
    var singledivision = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Division_Name=='" + currentdivision + "'   && $.State=='" + currentstate + "'" + " && $.Year==" + currentyear + "" + "   && $.Month=='" + currentmon + "'")
       .ToJSON());

    $('#spanyear').html(currentyear);
    var months = ["January", "February", "March", "April", "May", "June",
               "July", "August", "September", "October", "November", "December"];
    $('#spanmonth').html(months[currentmon-1]);

    var holidaydetails = new kendo.data.DataSource({
        data: singledivision, 
    }); 
    $("#holidays-listview").kendoMobileListView({
        dataSource: holidaydetails,
        dataBound: function(e) {
        if(this.dataSource.data().length == 0){
            //custom logic
            $("#holidays-listview").append("<li>No holidays in this month!</li>");
        }
        },
        template: $("#template-holidays").html(),
        
    }); 
}

function onchangedivision() {
    loadcontrols();
};

function onchangestate() {
    loadcontrols();
};


// START_CUSTOM_CODE_holidaysView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_holidaysView