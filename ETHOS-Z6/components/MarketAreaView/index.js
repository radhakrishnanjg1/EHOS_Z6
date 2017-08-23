
'use strict';

(function () {
    var view = app.MarketAreaView = kendo.observable();
    var MarketAreaViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MarketAreaView");
            }
            app.navigation.logincheck();
            $('#dvmarketareaview_txtauocmpemployeelist').val('');
            $("#dvmarketareaview_txtauocmpemployeelist").kendoAutoComplete({
                clearButton: false
            });
            $('#dvmarketareaview_teamname').html('Team');


        }, 
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID); 
            if (localStorage.getItem("marketareaview_live") == null ||
                localStorage.getItem("marketareaview_live") != 1) {
                init_marketareaview();
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_Market_Area_With_MSL_Count(Employee_ID);
            } 
            var Employee_Name = userdata.Employee_Name;
            if (userdata.IsManager == 1) {
                $("#dvmarketareaview_manager").show();
                $("#dvmarketareaview_team").show();
                load_subordinates_marketareaview();
                $('#dvmarketareaview_teamname').html('Team');
            }
            else { 
                $("#dvmarketareaview_manager").hide();
                $("#dvmarketareaview_team").hide();
                $('#dvmarketareaview_teamname').html(Employee_Name);
            }
        },

        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },

        fun_close_dvmarketareaview_txtauocmpemployeelist: function () {
            $('#dvmarketareaview_txtauocmpemployeelist').val('');
            setTimeout(function () {
                $("#dvmarketareaview_txtauocmpemployeelist").blur();
                var autocomplete = $("#dvmarketareaview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
    });

    view.set('MarketAreaViewModel', MarketAreaViewModel);
}());

function load_subordinates_marketareaview() {
    //create AutoComplete UI component
    //Employee_Name    ALL
    var localdata = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("ethosinssubordinatesdetails")))
        .Where("$.Employee_Name!='ALL'")
        .ToJSON());
    $("#dvmarketareaview_txtauocmpemployeelist").kendoAutoComplete({
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
                $('#dvmarketareaview_teamname').html(value.split("|")[0]);
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_Market_Area_With_MSL_Count(empid);
            }
            else {
                $('#dvmarketareaview_teamname').html('Team');
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Employee_Market_Area_With_MSL_Count(Employee_ID);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#dvmarketareaview_txtauocmpemployeelist").blur();
                var autocomplete = $("#dvmarketareaview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function init_marketareaview() {

    $("#listview-marketareadetails").kendoMobileListView({
        dataSource: [],
        filterable: {
            field: 'Market_Area_Name',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-marketareadetails").append("<li>No records found!</li>");
            }
        },
        template: $("#template-marketareadetails").html()
    });
}

function load_marketareaview(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    });
    $("#listview-marketareadetails").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_db_APP_Get_Z6_Employee_Market_Area_With_MSL_Count(Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Employee_Market_Area_With_MSL_Count",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID,
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
        load_marketareaview(JSON.stringify(data));
        localStorage.setItem("marketareaview_live", 1); 
    });
}


 
