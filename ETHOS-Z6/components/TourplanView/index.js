
'use strict';

(function () {
    var view = app.TourplanView = kendo.observable();
    var TourplanViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("TourplanView");
            }
            app.navigation.logincheck();
            $('#TourplanView_txtauocmpemployeelist').val('');
            $("#TourplanView_txtauocmpemployeelist").kendoAutoComplete({
                clearButton: false
            });
        },
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID); 
            if (localStorage.getItem("TourplanView_live") == null ||
                localStorage.getItem("TourplanView_live") != 1) {
                init_TourplanView();
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID);
            }
            var Employee_Name = userdata.Employee_Name;
            if (userdata.IsManager == 1) {
                $("#dvTourplanView_manager").show();
                $("#dvTourplanView_team").show();
                loadsubordinatesdetails_TourplanView();
            }
            else {
                $("#dvTourplanView_manager").hide();
                $("#dvTourplanView_team").hide();
            }
            $('#TourplanView_teamname').html(Employee_Name);
            
        },

        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },
        fun_close_TourplanView_txtauocmpemployeelist: function () {
            $('#TourplanView_txtauocmpemployeelist').val('');
            setTimeout(function () {
                $("#TourplanView_txtauocmpemployeelist").blur();
                var autocomplete = $("#TourplanView_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
    });

    view.set('TourplanViewModel', TourplanViewModel);
}());

function loadsubordinatesdetails_TourplanView() {
    var localdata = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("ethosinssubordinatesdetails")))
        .Where("$.Employee_Name!='ALL'")
        .ToJSON());
    //create AutoComplete UI component
    $("#TourplanView_txtauocmpemployeelist").kendoAutoComplete({
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
               .Where("$.Employee_ID==" + empid)
               .ToJSON());
                var Sub_Territory_ID = ethosmastervaluesdata_sub[0].Sub_Territory_ID;
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_TP_Details(empid, Sub_Territory_ID);
            }
            else {
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#TourplanView_txtauocmpemployeelist").blur();
                var autocomplete = $("#TourplanView_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}


function init_TourplanView() {

    $("#listview-tpdetails").kendoMobileListView({
        dataSource: [],
        //filterable: {
        //    field: 'Doctor_Search',
        //    operator: 'contains',
        //    ignoreCase: true
        //},
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-tpdetails").append("<li style='color:#ff6600!important'>No records found!</li>");
            }
        },
        template: $("#template-tpdetails").html()
    });
}

function load_TourplanView(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-tpdetails").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_db_APP_Get_Z6_Employee_TP_Details(Employee_ID, Sub_Territory_ID ) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_TP_Details",
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
                var getdata = response.Result.Data[0];
                return getdata;
            }
        }
    });

    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        load_TourplanView(JSON.stringify(data));
        localStorage.setItem("TourplanView_live", 1);
        var userdata = JSON.parse(localStorage.getItem("userdata"));
        var Employee_Name = userdata.Employee_Name;
        if (userdata.IsManager == 1) {
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
           .Where("$.Employee_ID==" + Employee_ID + "")
           .ToJSON());
            $('#TourplanView_teamname').html(ethosmastervaluesrecords[0].Employee_Name.split("|")[0]);
        }
    });
}



