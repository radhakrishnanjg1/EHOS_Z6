
'use strict';

(function () {
    var view = app.MasterPromoBalanceView = kendo.observable();
    var MasterPromoBalanceViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("MasterPromoBalanceView");
            }
            app.navigation.logincheck();

        },
        afterShow: function () {
            var userdata = JSON.parse(localStorage.getItem("userdata"));
            var Employee_ID = parseInt(userdata.Employee_ID);
            var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
            if (localStorage.getItem("MasterPromoBalanceView_live") == null ||
                localStorage.getItem("MasterPromoBalanceView_live") != 1) {
                init_MasterPromoBalanceView()
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Promo_Balance(Sub_Territory_ID);
            }
            var Employee_Name = userdata.Employee_Name;
            if (userdata.IsManager == 1) {
                $("#dvMasterPromoBalanceView_manager").show();
                $("#dvMasterPromoBalanceView_team").show();
                load_subordinates_MasterPromoBalanceView();
            }
            else {
                $("#dvMasterPromoBalanceView_manager").hide();
                $("#dvMasterPromoBalanceView_team").hide();
            }
            $('#dvMasterPromoBalanceView_teamname').html(Employee_Name);
            $('#MasterPromoBalanceView_txtauocmpemployeelist').val('');
            $("#MasterPromoBalanceView_txtauocmpemployeelist").kendoAutoComplete({
                clearButton: false
            })
        },

        ScrollTop: function () {
            $(".km-scroll-container").css("transform", "none");
        },
        fun_close_MasterPromoBalanceView_txtauocmpemployeelist: function () {
            $('#MasterPromoBalanceView_txtauocmpemployeelist').val('');
            setTimeout(function () {
                $("#MasterPromoBalanceView_txtauocmpemployeelist").blur();
                var autocomplete = $("#MasterPromoBalanceView_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        },
    });

    view.set('MasterPromoBalanceViewModel', MasterPromoBalanceViewModel);
}());

function load_subordinates_MasterPromoBalanceView() {
    var localdata = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("ethosinssubordinatesdetails")))
        .Where("$.Employee_Name!='ALL'")
        .ToJSON());
    //create AutoComplete UI component
    $("#MasterPromoBalanceView_txtauocmpemployeelist").kendoAutoComplete({
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
                fun_db_APP_Get_Z6_Promo_Balance(Sub_Territory_ID);
            }
            else {
                var userdata = JSON.parse(localStorage.getItem("userdata"));
                var Employee_ID = parseInt(userdata.Employee_ID);
                var Sub_Territory_ID = parseInt(userdata.Sub_Territory_ID);
                app.utils.loading(true);
                fun_db_APP_Get_Z6_Promo_Balance(Sub_Territory_ID);
            }
            $('.k-nodata').hide();
            setTimeout(function () {
                $("#MasterPromoBalanceView_txtauocmpemployeelist").blur();
                var autocomplete = $("#MasterPromoBalanceView_txtauocmpemployeelist").data("kendoAutoComplete");
                // Close the suggestion popup
                autocomplete.close();
            }, 1);
        }
    });
}

function init_MasterPromoBalanceView() {
     
    $("#listview-promobalancedetails").kendoMobileListView({
        dataSource: [],
        filterable: {
            field: 'Product_Search',
            operator: 'contains',
            ignoreCase: true
        },
        dataBound: function (e) {
            if (this.dataSource.data().length == 0) {
                //custom logics
                $("#listview-promobalancedetails").append("<li>No records found!</li>");
            }
        },
        template: $("#template-promobalancedetails").html()
    }); 
}

function load_MasterPromoBalanceView(records) {
    var lvmsldetails = JSON.parse(Enumerable.From(JSON.parse(records))
        .ToJSON());
    var dsmsldetails = new kendo.data.DataSource({
        data: lvmsldetails,
    }); 
    $("#listview-promobalancedetails").data("kendoMobileListView").setDataSource(dsmsldetails);
}

function fun_db_APP_Get_Z6_Promo_Balance(Sub_Territory_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_Promo_Balance",
                type: "POST",
                dataType: "json",
                data: { 
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
        load_MasterPromoBalanceView(JSON.stringify(data));
        localStorage.setItem("MasterPromoBalanceView_live", 1);
        var userdata = JSON.parse(localStorage.getItem("userdata")); 
        var Employee_Name = userdata.Employee_Name;
        if (userdata.IsManager == 1) {
            var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosinssubordinatesdetails"));
            var ethosmastervaluesrecords = JSON.parse(Enumerable.From(ethosmastervaluesdata)
           .Where("$.Sub_Territory_ID==" + Sub_Territory_ID + "")
           .ToJSON());
            $('#dvMasterPromoBalanceView_teamname').html(ethosmastervaluesrecords[0].Employee_Name.split("|")[0]); 
        }
        });
}


