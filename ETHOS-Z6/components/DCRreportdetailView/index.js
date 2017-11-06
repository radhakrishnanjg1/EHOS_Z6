
'use strict';

(function () {
    var view = app.DCRreportdetailView = kendo.observable();
    var DCRreportdetailViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("DCRreportdetailView");
            }
            app.navigation.logincheck();
        },
        afterShow: function (e) {
            var DailyReport_Date = parseInt(e.view.params.DailyReport_Date); 
            var DailyReport_Details_ID = parseInt(e.view.params.DailyReport_Details_ID);
            //var DailyReport_Details_ID = 7849927;
            app.utils.loading(true);
            fun_db_APP_Get_Z6_DCR_DailyReport_Details_ID(DailyReport_Details_ID); 
            $("#dcrreportdetailview_dcr_date").html(DailyReport_Date);
        },
    });

    view.set('DCRreportdetailViewModel', DCRreportdetailViewModel);
}());

//doctor start

function fun_dcrreportdetailview_listeddoctor_modelopen(e) {
    var data = e.button.data();
    var dailyreport_msl_doctor_id = data.dailyreport_msl_doctor_id;
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_DailyReport_Doctor_ID(dailyreport_msl_doctor_id);
}

function fun_dcr_dcrreportdetailview_listed_msl_doctor_promos_gift(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 413 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_listeddoctor_brandremainer").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
           { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });
}

function fun_dcr_dcrreportdetailview_listed_msl_doctor_promos_sample(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 414 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_listeddoctor_sample").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Sample Product", field: "product_name", editable: false },
           { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });
}

function fun_dcrreportdetailview_listeddoctor_modelclose() {
    $("#modalview-dcrreportdetailview_listeddoctor").kendoMobileModalView("close");
}

function fun_dcrreportdetailview_unlisteddoctor_modelopen(e) {
    var data = e.button.data();
    var dailyreport_msl_doctor_id = data.dailyreport_msl_doctor_id; 
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_DailyReport_UnlistedDoctor_ID(dailyreport_msl_doctor_id);
}

function fun_dcrreportdetailview_unlisted_msl_doctor_promos_gift(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 413 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_unlisteddoctor_brandremainer").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
           { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });

}

function fun_dcrreportdetailview_unlisted_msl_doctor_promos_sample(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 414 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_unlisteddoctor_sample").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Sample Product", field: "product_name", editable: false },
           { width: 100, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });

}

function fun_dcrreportdetailview_unlisteddoctor_modelclose() {
    $("#modalview-dcrreportdetailview_unlisteddoctor").kendoMobileModalView("close");
}
// doctor end 

//chemist start

function fun_dcrreportdetailview_listedchemist_modelopen(e) {
    var data = e.button.data();
    var dailyreport_msl_chemist_id =parseInt(data.dailyreport_msl_chemist_id);
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_DailyReport_Chemist_ID(dailyreport_msl_chemist_id);
 }

function fun_dcr_dcrreportdetailview_listed_msl_chemist_promos_gift(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 413 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_listedchemist_brandremainer").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
           { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });
}
 
function fun_dcrreportdetailview_listedchemist_modelclose() {
    $("#modalview-dcrreportdetailview_listedchemist").kendoMobileModalView("close");
}

function fun_dcrreportdetailview_unlistedchemist_modelopen(e) {
    var data = e.button.data();
    var dailyreport_msl_chemist_id = parseInt(data.dailyreport_msl_chemist_id);
    app.utils.loading(true);
    fun_db_APP_Get_Z6_DCR_DailyReport_UnlistedChemist_ID(dailyreport_msl_chemist_id);
   }

function fun_dcrreportdetailview_unlisted_msl_chemist_promos_gift(data) {
    var alldivision = JSON.parse(data);
    var data1 = JSON.parse(Enumerable.From(alldivision)
       .Where("$.Product_Type==" + 413 + "")
       .ToJSON());
    var dataSource = new kendo.data.DataSource({
        data: data1,
        batch: true,
        schema: {
            model: {
                fields: {
                    product_name: { type: "string", editable: false },
                    quantity: { type: "number", editable: true }
                }
            }
        }
    });
    $("#grid_dcrreportdetailview_unlistedchemist_brandremainer").kendoGrid({
        dataSource: dataSource,
        columns: [
           { enabled: false, title: "Brand Reminder Product", field: "gift_name", editable: false },
           { width: 50, enabled: false, title: "Qty", field: "quantity", editable: false, },
        ],
        noRecords: {
            template: "No records found!"
        },
    });

}
 
function fun_dcrreportdetailview_unlistedchemist_modelclose() {
    $("#modalview-dcrreportdetailview_unlistedchemist").kendoMobileModalView("close");
}
// chemist end 
function fun_db_APP_Get_Z6_DCR_DailyReport_Details_ID(DailyReport_Details_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_DailyReport_Details_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_Details_ID": DailyReport_Details_ID
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
        $("#dcrreportdetailview_dcr_date").html(data[0][0].DailyReport_Date); 
        $("#dcrreportdetailview_period").html(data[0][0].Activity_Period);
        $("#dcrreportdetailview_dcr_activity").html(data[0][0].Activity);
        $("#dcrreportdetailview_dcr_category").html(data[0][0].Category);
        $("#dcrreportdetailview_dcr_mode").html(data[0][0].Mode);
        $("#dcrreportdetailview_dcr_sfcroute").html(data[0][0].SFC_Route);
        $("#dcrreportdetailview_dcr_workwith_details").html(data[0][0].Worked_With_Details);
        $("#dcrreportdetailview_dcr_workwith_employee_details").html(data[0][0].Worked_With_Employee_Details);
        $("#dcrreportdetailview_dcr_market_area").html(data[0][0].Market_Area_Name);
        	
        $("#dcrreportdetailview_dcr_deviationreason").html(data[0][0].Deviation_Reason);
        $("#dcrreportdetailview_dcr_description").html(data[0][0].Description);

        localStorage.setItem("dcrreportdetailview_dcr_msl_details", JSON.stringify(data[1]));
        var ListedDoctor = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcrreportdetailview_dcr_msl_details")))
            .Where("$.MSL_Type=='ListedDoctor'")
            .ToJSON());
        $("#listview-dcrreportdetailview-listeddoctor").kendoMobileListView({
            dataSource: ListedDoctor,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrreportdetailview-listeddoctor").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrreportdetailview-listeddoctor").html(),
        });

        var UnListedDoctor = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcrreportdetailview_dcr_msl_details")))
            .Where("$.MSL_Type=='UnListedDoctor'")
            .ToJSON());
        $("#listview-dcrreportdetailview-unlisteddoctor").kendoMobileListView({
            dataSource: UnListedDoctor,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrreportdetailview-unlisteddoctor").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrreportdetailview-unlisteddoctor").html(),
        });

        var ListedChemist = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcrreportdetailview_dcr_msl_details")))
            .Where("$.MSL_Type=='ListedChemist'")
            .ToJSON());
        $("#listview-dcrreportdetailview-listedchemist").kendoMobileListView({
            dataSource: ListedChemist,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrreportdetailview-listedchemist").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrreportdetailview-listedchemist").html(),
        });

        var UnListedChemist = JSON.parse(Enumerable.From(JSON.parse(localStorage.getItem("dcrreportdetailview_dcr_msl_details")))
            .Where("$.MSL_Type=='UnListedChemist'")
            .ToJSON());
        $("#listview-dcrreportdetailview-unlistedchemist").kendoMobileListView({
            dataSource: UnListedChemist,
            dataBound: function (e) {
                if (this.dataSource.data().length == 0) {
                    //custom logic
                    $("#listview-dcrreportdetailview-unlistedchemist").append("<li style='color:#ff6600!important'>No records found!</li>");
                }
            },
            template: $("#template-dcrreportdetailview-unlistedchemist").html(),
        });
    });
}
 
function fun_db_APP_Get_Z6_DCR_DailyReport_Doctor_ID(DailyReport_Doctor_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_DailyReport_Doctor_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_Doctor_ID": DailyReport_Doctor_ID
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
        fun_dcr_dcrreportdetailview_listed_msl_doctor_promos_gift(JSON.stringify(data));
        fun_dcr_dcrreportdetailview_listed_msl_doctor_promos_sample(JSON.stringify(data));
        $("#modalview-dcrreportdetailview_listeddoctor").kendoMobileModalView("open");
    });
}

function fun_db_APP_Get_Z6_DCR_DailyReport_UnlistedDoctor_ID(DailyReport_UnlistedDoctor_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_DailyReport_UnlistedDoctor_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_UnlistedDoctor_ID": DailyReport_UnlistedDoctor_ID
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
        fun_dcrreportdetailview_unlisted_msl_doctor_promos_gift(JSON.stringify(data));
        fun_dcrreportdetailview_unlisted_msl_doctor_promos_sample(JSON.stringify(data));
        $("#modalview-dcrreportdetailview_unlisteddoctor").kendoMobileModalView("open");
         
    });
}

function fun_db_APP_Get_Z6_DCR_DailyReport_Chemist_ID(DailyReport_Chemist_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_DailyReport_Chemist_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_Chemist_ID": DailyReport_Chemist_ID
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
        fun_dcr_dcrreportdetailview_listed_msl_chemist_promos_gift(JSON.stringify(data));
        $("#modalview-dcrreportdetailview_listedchemist").kendoMobileModalView("open");
    });
}

function fun_db_APP_Get_Z6_DCR_DailyReport_UnlistedChemist_ID(DailyReport_UnlistedChemist_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/demtnkv7hvet83u0/Invoke/SqlProcedures/APP_Get_Z6_DCR_DailyReport_UnlistedChemist_ID",
                type: "POST",
                dataType: "json",
                data: {
                    "DailyReport_UnlistedChemist_ID": DailyReport_UnlistedChemist_ID
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
        fun_dcrreportdetailview_unlisted_msl_chemist_promos_gift(JSON.stringify(data));
        $("#modalview-dcrreportdetailview_unlistedchemist").kendoMobileModalView("open"); 
    });
}




