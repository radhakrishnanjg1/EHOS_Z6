
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
            if (localStorage.getItem("mslchemistdetails_live") == null ||
                localStorage.getItem("mslchemistdetails_live") != 1) {
                init_mslchemistview()
                app.utils.loading(true);
                fun_db_APP_Get_Chemist_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID);
            }
            var Employee_Name = userdata.Employee_Name;
            if (userdata.IsManager == 1) {
                $("#dvmslchemistview_manager").show();
                $("#dvmslchemistview_team").show();
                load_subordinates_mslchemistview();
            }
            else {
                $("#dvmslchemistview_manager").hide();
                $("#dvmslchemistview_team").hide();
            }
            $('#dvmslchemistview_teamname').html(Employee_Name);
            $('#mslchemistview_txtauocmpemployeelist').val('');
            $("#mslchemistview_txtauocmpemployeelist").kendoAutoComplete({
                clearButton: false
            })
        },

        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },
        fun_close_mslchemistview_txtauocmpemployeelist: function () {
            $('#mslchemistview_txtauocmpemployeelist').val('');
            setTimeout(function () {
                $("#mslchemistview_txtauocmpemployeelist").blur();
                var autocomplete = $("#mslchemistview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
    });

    view.set('MSLChemistViewModel', MSLChemistViewModel);
}());

function load_subordinates_mslchemistview() {
    var localdata = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("ethosinssubordinatesdetails")))
        .Where("$.Employee_Name!='ALL'")
        .ToJSON());
    //create AutoComplete UI component
    $("#mslchemistview_txtauocmpemployeelist").kendoAutoComplete({
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
                fun_db_APP_Get_Chemist_MSL_Details_By_Employee_ID(empid, Sub_Territory_ID);
            }
            else {
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
                app.utils.loading(true);
                fun_db_APP_Get_Chemist_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#mslchemistview_txtauocmpemployeelist").blur();
                var autocomplete = $("#mslchemistview_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function init_mslchemistview() {
     
    $("#listview-chemistmsldetails").kendoMobileListView({
        dataSource: [],
        filterable: {
            field: 'Chemist_Search',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-chemistmsldetails").append("<li>No records found!</li>");
            }
        },
        template: $("#template-chemistmsldetails").html()
    }); 
}

function load_mslchemistview(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    }); 
    $("#listview-chemistmsldetails").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_mslchemist_last_products_modelopen(e) {
    var data = e.button.data();
    var DailyReport_Chemist_Id = parseInt(data.dailyreport_chemist_id);
    app.utils.loading(true);
    fun_db_APP_Get_Chemist_Gift_Details_By_DailyReport_Chemist_Id(DailyReport_Chemist_Id);
    $("#modalview-mslchemist_last_products").kendoMobileModalView("open");
}

function fun_mslchemist_last_products_modelclose() {
    $("#modalview-mslchemist_last_products").kendoMobileModalView("close");
}

function fun_db_APP_Get_Chemist_MSL_Details_By_Employee_ID(Employee_ID, Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Chemist_MSL_Details_By_Employee_ID",
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
        load_mslchemistview(JSON.stringify(data));
        localStorage.setItem("mslchemistdetails_live", 1);
        var userdata = JSON.parse(localStorage.getItem("userdata")); 
        var Employee_Name = userdata.Employee_Name;
        if (userdata.IsManager == 1) {
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
           .Where("$.Employee_ID==" + Employee_ID + "")
           .ToJSON());
            $('#dvmslchemistview_teamname').html(ethosmastervaluesrecords[0].Employee_Name.split("|")[0]); 
        }
        });
}

function fun_db_APP_Get_Chemist_Gift_Details_By_DailyReport_Chemist_Id(DailyReport_Chemist_Id) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Chemist_Gift_Details_By_DailyReport_Chemist_Id",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_Chemist_Id": DailyReport_Chemist_Id,
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

        var dataSource = new kendo.data.DataSource({
            data: data[0]
        });
        $("#grid_mslchemist_last_products_brandremainer").kendoGrid({
            dataSource: dataSource,
            columns: [
               { enabled: false, title: "Brand Reminder Product", field: "Product_Name", editable: false },
               { width: 50, enabled: false, title: "Qty", field: "Quantity", editable: false, },
            ],
            noRecords: {
                template: "No records found!"
            },
        }); 
    });
}


