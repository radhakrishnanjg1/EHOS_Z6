
'use strict';

(function () {
    var view = app.LMSapplyleaveView = kendo.observable();
    var validator;
    var LMSapplyleaveViewModel = kendo.observable({
        onShow: function () {
            if (!app.utils.checkinternetconnection()) {
                return app.navigation.navigateoffline("LMSapplyleaveView");
            }
            app.navigation.logincheck();
            fun_applyleave_pageload();
            validator = app.validate.getValidator('#form-applyleave');
            fun_applyleaveclearcontrols();
        }, 
        afterShow: function () {
        }, 
        fun_applyleavesaveleavedetails: function () { 
            if (fun_applyleave_validation()) {
                var leavetype = parseInt($("#ddlleavetype").val());
                if (!isNaN(leavetype) && leavetype == 869) { //el encash to allow
                    //EBO.From_Date = DateTime.Now.ToString("yyyy-MM-dd");
                    //EBO.To_Date = DateTime.Now.ToString("yyyy-MM-dd");
                    //EBO.No_Of_Days = txtNoDayELEncash.Text.ToString();
                    $("#txtdays").val(parseInt($("#txtnodayelencash").val()));
                    $("#txtfrom").val(todateddmmyyy_hyphen(new Date()));
                    $("#txtto").val(todateddmmyyy_hyphen(new Date()));
                    
                    fun_applyleave_leaveencashment();
                }
                else {
                    fun_applyleave_savevalidation();
                }
            }
        }, 
    });

    view.set('LMSapplyleaveViewModel', LMSapplyleaveViewModel);
}());

 
function fun_applyleave_pageload() {
    $("#txtfrom").kendoDatePicker({
        format: app.constants.dateFormat,//app.constants.dateFormat, 
       // open: keyboardClose(),
    });
    $("#txtto").kendoDatePicker({
        format: app.constants.dateFormat,//app.constants.dateFormat,"dd-MM-yyyy  
        //open: function(e) {
        //    keyboardClose();//prevent popup opening
    //}
    });
    //var datepickertxtfrom = $("#txtfrom").data("kendoDatePicker");
    //datepickertxtfrom.readonly(false);
    //var datepickertxtto = $("#txtto").data("kendoDatePicker");
    //datepickertxtto.readonly(true);
    //$("#txtfrom").attr("disabled", "true");
    //$(".k-datepicker input").prop("readonly", "readonly");
    var currentyearvalue = new Date().getFullYear();
    $("#currentyear").html(currentyearvalue);
    //get leave details based on emp 
    var ethosmastervaluesdata = JSON.parse(localStorage.getItem("ethosmastervalues"));
    var leavetypedata = JSON.parse(Enumerable.From(ethosmastervaluesdata)
   .Where("$.Master_Table_ID==" + 70)
   .ToJSON());
    $("#ddlleavetype").kendoDropDownList({
        index: 0,
        dataTextField: "Master_Value_Name",
        dataValueField: "Master_Value_ID",
        dataSource: leavetypedata, 
        //change: onChange
        optionLabel: "---Select---",
        change: function (e) {
            var leavetype = this.value();
            // Use the value of the widget
            app.utils.loading(true);
            fun_db_APP_Get_Employee_Leave_Details(leavetype, $('#hdnEmployee_ID').val());
        },
    });
    //$("#ddlleavetype").kendoDropDownList({ height: 500 });
    fun_applyleave_load_mlandpl();
}

function fun_applyleave_load_mlandpl() {
    $("#txtfrom").kendoDatePicker({
        format: app.constants.dateFormat,//app.constants.dateFormat,
        parseFormats: [app.constants.dateFormat],
        disableDates: ["su"],
    }); 
    $("#txtto").kendoDatePicker({
        format: app.constants.dateFormat,//app.constants.dateFormat,"dd-MM-yyyy
        parseFormats: [app.constants.dateFormat],
        disableDates: ["su"],
    });
    
   // $('#txtto').attr('disabled', 'disabled');
    var userdata = JSON.parse(localStorage.getItem("userdata"));
    var Gender = userdata.Sex;
    var MaritalStatus = userdata.Marital_Status;
    if (Gender == "20" && MaritalStatus == "21") {
        $("#ddlleavetype").data("kendoDropDownList")
        .dataSource.add({ "Master_Value_Name": "ML", "Master_Value_ID": 2234 });
    }
    else if (Gender == "19" && MaritalStatus == "21") {
        $("#ddlleavetype").data("kendoDropDownList")
        .dataSource.add({ "Master_Value_Name": "PL", "Master_Value_ID": 2242 });
    }
    $("#hdnReporting_Employee_ID").val(parseInt(userdata.Reporting_Employee_ID));
    $("#txtmobilenumber").val(userdata.Mobile);
}

function fun_applyleave_txttochange() {
    var start = $("#txtfrom").data("kendoDatePicker").value();
    var end = $("#txtto").data("kendoDatePicker").value();
    var diff_date = end - start;
    //var days = (Math.floor(((diff_date % 31536000000) % 2628000000) / 86400000)) + 1;
    var days = ((end - start) / 1000 / 60 / 60 / 24) + 1;
    if (days < 0) {
        $("#txtdays").val(0);
    } else {
        $("#txtdays").val(days);
    }
}

function fun_applyleave_leavetypechange(leavetype) {
    $('#dvleavenorms div').hide();
    $('#dvaddress').hide();
    $('#dvpreviousltaperiod').hide();
    $('#dvnextltaeligibility').hide();
    $('#dveldays').hide();
    $('#dvearneddays').hide();
    $('#dveventdetailsforelencashment').hide();
    $('#dvcommoneventdetails').show();
    $('#spanleavenorms').html('Leave Norms');
    if (leavetype == 865) {
        $('#dveldays').show();
        $('#dvleavenorms #paraCL').show();
        $('#spanleavenorms').html('Casual Leave (CL) Norms');
    }
    else if (leavetype == 866) {
        $('#dveldays').show();
        $('#dvleavenorms #paraSL').show();
        $('#spanleavenorms').html('Sick Leave (SL) Norms');
    }
    else if (leavetype == 868) {
        $('#dvaddress').show();
        $('#dvleavenorms #paraLTA').show();
        $('#dvpreviousltaperiod').show();
        $('#dvnextltaeligibility').show();
        $('#dvearneddays').show();
        $('#spanleavenorms').html('Leave Travel Allowance (LTA) Norms');
    }
    else if (leavetype == 867) {
        $('#dvleavenorms #paraEL').show();
        $('#dvearneddays').show();
        $('#spanleavenorms').html('Earned Leave (EL) Norms');
    }
    else if (leavetype == 869) {
        $('#dveventdetailsforelencashment').show();
        $('#dvcommoneventdetails').hide();
        $('#dvleavenorms #paraEncashment').show();
        $('#spanleavenorms').html('Leave Encashment Norms');
    }
    else if (leavetype == 2234) {
        $('#txtopeningbalance').val('0');
        $('#txtavailedleave').val('0');
        $('#txtavailablebalance').val('0');
        $('#txtearneddays').val('0');

        $('#dvleavenorms #paraMaternity').show();
        $('#spanleavenorms').html('Maternity Leave (ML) Norms');
        $('#dvcommoneventdetails').show();
        $('#dvearneddays').show();
    }
    else if (leavetype == 2242) {
        $('#txtopeningbalance').val('0');
        $('#txtavailedleave').val('0');
        $('#txtavailablebalance').val('0');
        $('#txtearneddays').val('0');

        $('#dvleavenorms #paraPaternity').show();
        $('#spanleavenorms').html('Paternity Leave (PL) Norms');
        $('#dvcommoneventdetails').show();
        $('#dvearneddays').show();
    }
    else {
        $('#dvleavenorms div').hide();
        $('#spanleavenorms').html('Leave Norms');
    }
}

function fun_applyleave_validation() {
    var leavetype = parseInt($("#ddlleavetype").val());
    var start = $("#txtfrom").data("kendoDatePicker").value();
    var end = $("#txtto").data("kendoDatePicker").value();
    var days = $("#txtdays").val();
    var txtmobilenumber = $("#txtmobilenumber").val();
    var txtreason = $("#txtreason").val();
    var txtaddress = $("#txtaddress").val();
    var txtnodayelencash = $("#txtnodayelencash").val();
    var txteligibledays = $("#txteligibledays").val();
    if (leavetype == "" || isNaN(leavetype) || leavetype == null) {
        app.notify.error("Select leavetype!");
        return false;
    }
    if (leavetype == 865 || leavetype == 866 || leavetype == 867
        || leavetype == 868 || leavetype == 2234 || leavetype == 2242) {

        if (start == "" || start == null) {
            app.notify.error("Select from date!");
            return false;
        }
        if (end == "" || end == null) {
            app.notify.error("Select to date!");
            return false;
        }
        if (txtmobilenumber == "") {
            app.notify.error("Enter Mobile Number!");
            return false;
        }
        if (txtreason == "") {
            app.notify.error("Enter reason!");
            return false;
        }
        if (leavetype == 868 && txtaddress == "") {
            app.notify.error("Enter address!");
            return false;
        }

    }
    else if (leavetype == 869) {
        if (txtnodayelencash == "") {
            app.notify.error("Enter number of days!");
            return false;
        }
    }
    return true;
}

function fun_applyleave_savevalidation() {
    var fulldate = new Date();
    var fromdate = $("#txtfrom").data("kendoDatePicker").value();
    var todate = $("#txtto").data("kendoDatePicker").value();
    var noofdays = parseInt($("#txtdays").val());
    var days = Math.round(((fulldate - todate) / 1000 / 60 / 60 / 24), 0);
    $('#hdnSLdatediff').val(Math.round(days, 0));
    var slduedate = $("#txtto").data("kendoDatePicker").value();
    var sldays = Math.round(((fulldate - slduedate) / 1000 / 60 / 60 / 24), 0);

    var leavetype = parseInt($('#ddlleavetype').val());
    var reason = $('#txtreason').val();
    var isconfirmed = $('#hdnisconfirmed').val();
    var totaleldays = parseInt($('#hdntotalel').val());
    var issundayfromdate = fromdate.getDay();
    var issundaytodate = todate.getDay();
    var fromyear = fromdate.getFullYear();
    var toyear = todate.getFullYear();
    var currentyear = fulldate.getFullYear();
    if (currentyear != fromyear || currentyear != toyear) {
        app.notify.error("You cannot apply leave for previous and future year.");
        return false;
    }
    else if (issundayfromdate == 0) {
        app.notify.error("You have selected Sunday as the from Date.");
        return false;
    }
    else if (issundaytodate == 0) {
        app.notify.error("You have selected Sunday as the to Date.");
        return false;
    }
    else if (noofdays <= 0) {
        app.notify.error("To date should be after from date.");
        return false;
    }
    else if (noofdays >= 4 && leavetype == "865") {
        app.notify.error("You can't apply more than 3 days as CL.");
        return false;
    }
    else if ((noofdays < 5 && leavetype == "868")) {
        app.notify.error("You can not apply for LTA lesser than 5 days.");
        return false;
    }
    else if ((totaleldays < 5 && leavetype == "868")) {
        app.notify.error("You can not apply for LTA since your EL is lesser than 5 days.");
        return false;
    }
    else if (isconfirmed != "true" && (leavetype == "867" || leavetype == "868" || leavetype == "869")) {
        app.notify.error("You are not confirmed yet hence you cannot avail the leaves.");
        return false;
    }
    else {

        var daysbal = parseInt($('#txtavailablebalance').val()) -
            noofdays;
        if (daysbal >= 0) {
            //EBO.LOP_Days = "0";
            //EBO.EL_Days = "0";
            //EBO.No_Of_Days = txtDays.Text.ToString().Trim();
            $('#txtlopdays').val("0");
            $('#txteldays').val("0");
        }
        else {
            if (leavetype == "867") {
                //EBO.EL_Days = "0";
                //EBO.LOP_Days = ((-1) * DaysBal).ToString();
                //EBO.No_Of_Days = (Convert.ToDecimal(txtDays.Text.ToString().Trim()) + DaysBal).ToString();

                $('#txteldays').val("0");
                $('#txtlopdays').val(parseInt((-1) * daysbal));
                //$('#txtdays').val();
            }
            else {
                if (totaleldays != "0") {
                    if (totaleldays < (-1) * daysbal) {
                        // EBO.EL_Days = hfTotalEL.Value;
                        //$('#txteldays').val();
                        //EBO.LOP_Days = ((-1) * DaysBal - parseInt($('#hdntotalel').val())).ToString(); 
                        $('#txtlopdays').val((-1) * daysbal - totaleldays);
                        //EBO.No_Of_Days = (Convert.ToDecimal(txtDays.Text.ToString().Trim()) +
                        //    DaysBal).ToString();
                        //$('#txtdays').val();
                    }
                    else {
                        //EBO.EL_Days = ((-1) * DaysBal);
                        $('#txteldays').val((-1) * daysbal);
                        //EBO.LOP_Days = "0";
                        $('#txtlopdays').val('0');
                        //EBO.No_Of_Days = (Convert.ToDecimal(txtDays.Text.ToString().Trim()) + DaysBal).ToString();
                        //$('#txtdays').val();
                    }

                }
                else {
                    //EBO.EL_Days = "0";
                    $('#txteldays').val('0');
                    //EBO.LOP_Days = ((-1) * DaysBal).ToString();
                    $('#txtlopdays').val((-1) * daysbal);
                    //EBO.No_Of_Days = (Convert.ToDecimal(txtDays.Text.ToString().Trim()) + DaysBal).ToString();
                    //$('#txtdays').val();
                }
            }
        }
        // allow cl and sl less than 3 days
        if ((noofdays <= 3 && leavetype == "865") || (noofdays <= 3 && leavetype == "866")) {
            fun_applyleave_request();
        }
            // allow sl greater than 3 days with confirmation
        else if (leavetype == "866") {
            if (sldays > 15 && noofdays > 3) {
                var confirmation = "SL more than 3 days and it is exceeded the due date of producing certificate,hence SL more than 3 days will be considered as EL .Do you want to save?";
                app.notify.confirmation(confirmation, function (confirm) {
                    if (!confirm) {
                        return;
                    }
                    fun_applyleave_request();
                });
            }
            else if (sldays == 15 && noofdays > 3) {
                var confirmation = "SL more than 3 days and today is the due date of producing certificate,hence submit the supporting  documents today itself or else u can avail EL for SL more than 3 days .Do you want to save?";
                app.notify.confirmation(confirmation, function (confirm) {
                    if (!confirm) {
                        return;
                    }
                    fun_applyleave_request();
                });
            }
            else if (sldays < 15 && noofdays > 3) {
                var confirmation = "SL more than 3 days should be supported by a certificate.Do you want to save?";
                app.notify.confirmation(confirmation, function (confirm) {
                    if (!confirm) {
                        return;
                    }
                    fun_applyleave_request();
                });
            }
        }
        else if (leavetype == "868") { // lta to allow
            fun_applyleave_request();
        }
        else if (leavetype == "867") { //el to allow
            fun_applyleave_request();
        }
        else if (leavetype == "2234" || leavetype == "2242") { //Ml and Pl to allow
            fun_applyleave_request();
        }
    }
}

function fun_applyleave_leaveencashment() {
    //decimal numberofdays = Convert.ToDecimal(txtNoDayELEncash.Text.ToString().Trim());
    //decimal EligibleDays = Convert.ToDecimal(txtEligible.Text.ToString().Trim());
    //bool ismultipleof15 = ((numberofdays % 15) == 0) ? true : false;
    var numberofdays = parseInt($('#txtnodayelencash').val());
    var eligibledays = parseInt($('#txteligibledays').val());
    var ismultipleof15 = false;
    if (numberofdays % 15 == 0)
    {
        ismultipleof15 = true;
    }
    //var ismultipleof15 = ((numberofdays % 15) === 0) ? true : false;
    var availablebalance = parseInt($('#txtavailablebalance').val());
    if (availablebalance <= 30) {
        app.notify.error("You can not encash the EL since its lesser than or equal to 30 days.");
        return false;
    }
    else if ((availablebalance - numberofdays) < 30) {
        app.notify.error("You can not encash the EL Since the EL balance should be 30 days .");
        return false;
    }
    else if (numberofdays > eligibledays) {
        app.notify.error("You can not encash the EL Since the EL days should be less than Eligible days.");
        return false;
    }
    else if (ismultipleof15 == false) {
        app.notify.error("You can not encash the EL Since the EL days should be multiples of 15.");
        return false;
    }
    fun_applyleave_request(); 
}

function fun_applyleaveclearcontrols() {
    $('#txtdays').val('');
    $('#txtfrom').val('');
    $('#txtto').val('');
    //$('#txtmobilenumber').val('');
    $('#txtreason').val('');
    $('#txtaddress').val(' ');
    var dropdownlist = $("#ddlleavetype").data("kendoDropDownList");
    dropdownlist.value("---Select---");

    // info 
    $('#txtopeningbalance').val('0');
    $('#txtavailedleave').val('0');
    $('#txtavailablebalance').val('0');
    $('#txteldays').val('0');
    $('#txtlopdays').val('0');
    $('#txtearneddays').val('0');
    $('#txtpreviousltaperiod').val('');
    $('#txtnextltaeligibility').val('');
    $('#txtnodayelencash').val('');
    $('#hdntotalel').val('0'); 
}

function fun_applyleave_request() {
    var eldays = parseInt($('#txteldays').val());
    if (isNaN(eldays))
    {
        eldays = 0;
    }
    var noofdays = parseInt($('#txtdays').val());
    if (isNaN(noofdays)) {
        noofdays = 0;
    } 
    fun_applyleave_txttochange();

    var txtaddress="";
    if (parseInt($('#ddlleavetype').val()) == 868)
    {
        txtaddress = $('#txtaddress').val(); 
    } 
    //alert($('#hdnEmployee_ID').val() + "<--Employee_ID |" + parseInt($('#ddlleavetype').val()) + " <--leavetype|" + parseInt($('#txtopeningbalance').val()) + " <--openingbalance|" +
    //     parseInt($('#txtavailablebalance').val()) + " <--availablebalance|" + $('#txtfrom').val() + " <--from|" + $('#txtto').val() + " <--to|" +
    //     parseInt($('#txtdays').val()) + " <--Noofdays|" + parseInt($('#hdnReporting_Employee_ID').val()) + " <--Reporting_Employee_ID|" + $('#txtreason').val() + " <--reason|" +
    //txtaddress + " <--address|" + $('#txtmobilenumber').val() + "  <--mobile|" + 1 + " <--active|" +
    //     parseInt($('#hdnLogin_ID').val()) + " <--Login_ID|" + parseInt($('#hdnLogin_ID').val()) + " <--Login_ID|" + parseInt($('#txtlopdays').val()) + " <--lopdays|" +
    //      "eldays-->" + eldays);
    app.utils.loading(true); 
    fun_db_APP_Insert_Ethos_Leave_Master(parseInt($('#hdnEmployee_ID').val()), parseInt($('#ddlleavetype').val()), parseInt($('#txtopeningbalance').val()),
         parseInt($('#txtavailablebalance').val()), $('#txtfrom').val(), $('#txtto').val(),
         parseInt(noofdays), parseInt($('#hdnReporting_Employee_ID').val()), $('#txtreason').val(),
         txtaddress , $('#txtmobilenumber').val(), 1,
         parseInt($('#hdnLogin_ID').val()), parseInt($('#hdnLogin_ID').val()), parseInt($('#txtlopdays').val()),
         eldays);
}

function fun_db_APP_Get_Employee_Leave_Details(leavetype, Employee_ID) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Get_Employee_Leave_Details",
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
            app.notify.error('Error loading data please try again later!');
        }
    }); 
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        if (data[0].Leave_Type_ID > 0) {
            app.utils.loading(false);
            fun_applyleave_leavetypechange(leavetype);

            if (!(leavetype == 2234 || leavetype == 2242)) {
                if (leavetype == 868 || leavetype == 869) {
                    leavetype = 867;
                }  
                var empelleavedata = JSON.parse(Enumerable.From(JSON.parse(JSON.stringify(data)))
                  .Where("$.Leave_Type_ID==" + leavetype)
                 .ToJSON());
                if (leavetype == 867) {
                    var numberofdays = parseInt(empelleavedata[0]["Closing_Bal"]);
                    var elgdays = (((numberofdays - 30) / 15) * 15);
                    $('#txteligibledays').val(elgdays);
                }
                //el
                if (empelleavedata.length == 0) {
                    $('#hdntotalel').val(0);
                }
                else {
                    $('#hdntotalel').val(parseInt(empelleavedata[0]["EL_Days"]));
                }
                //EL            LTA            EL ENCASHMENT
                if (leavetype == "867" || leavetype == "868" || leavetype == "869") {
                    $('#txtopeningbalance').val((parseInt(empelleavedata[0]["Opening_Bal"]) -
                        parseInt(empelleavedata[0]["Earned_EL"])));
                }
                else {
                    $('#txtopeningbalance').val(parseInt(empelleavedata[0]["Opening_Bal"]));
                }
                var availedleaves = parseInt(empelleavedata[0]["Opening_Bal"]) +
                    parseInt(empelleavedata[0]["LOP_Days"]) + parseInt(empelleavedata[0]["EL_Days"]) -
                    parseInt(empelleavedata[0]["Closing_Bal"]);
                $('#txtavailedleave').val(availedleaves);
                $('#txtlopdays').val(empelleavedata[0]["LOP_Days"]);
                $('#txtavailablebalance').val(empelleavedata[0]["Closing_Bal"]);
                $('#previousltaperiod').val(empelleavedata[0]["LTA_Date"]);
                $('#txtnextltaeligibility').val(empelleavedata[0]["LTA_Eligibility"]);
                $('#txteldays').val(parseInt(empelleavedata[0]["EL_Days"]));
                $('#txtearneddays').val(empelleavedata[0]["Earned_EL"]);

                $('#hdnisconfirmed').val(empelleavedata[0]["isconfirmed"]);
                // not required in 
                //$('#hdndcrdate').val(empelleavedata[0]["isconfirmed"]);
            } 
        }
        else {
            app.utils.loading(false);
        }
    }); 
}

function fun_db_APP_Insert_Ethos_Leave_Master(Employee_ID, Leave_Type_ID, Opening_Bal,
    Closing_Bal, FromDate, ToDate,
    No_Of_Days, Reporting_To, Reason,
    Employee_Address, Phone_No, Active,
    Created_By, Last_Modified_By, LOP_Days,
    EL_Days) {
    var datasource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/dvu4zra5xefb2qfq/Invoke/SqlProcedures/APP_Insert_Ethos_Leave_Master",
                type: "POST",
                dataType: "json",
                data: {
                    "Employee_ID": Employee_ID, "Leave_Type_ID": Leave_Type_ID, "Opening_Bal": Opening_Bal,
                    "Closing_Bal": Closing_Bal, "FromDate": FromDate, "ToDate": ToDate,
                    "No_Of_Days": No_Of_Days, "Reporting_To": Reporting_To, "Reason": Reason,
                    "Employee_Address": Employee_Address, "Phone_No": Phone_No, "Active": Active,
                    "Created_By": Created_By, "Last_Modified_By": Last_Modified_By, "LOP_Days": LOP_Days,
                    "EL_Days": EL_Days
                }
                //data: {
                //    "Employee_ID": 979, "Leave_Type_ID": 865, "Opening_Bal": 15,
                //    "Closing_Bal": 15, "FromDate": '12-12-2012', "ToDate": '12-12-2012',
                //    "No_Of_Days": 1, "Reporting_To": 979, "Reason": 'a',
                //    "Employee_Address": 'aa', "Phone_No": '11', "Active": 1,
                //    "Created_By": 979, "Last_Modified_By": 979, "LOP_Days": 1,
                //    "EL_Days": 1
                //}

                //    fun_db_APP_Insert_Ethos_Leave_Master(979, 865, 15,
                //0, '08-02-2017', '09-02-2017',
                //2, 2478, 'ReasonText',
                //'Employee_AddressText', 9003467461, 1,
                //983, 983, 0, 0);
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
            app.notify.error('Error loading data please try again later!');
        }
    });
    datasource.fetch(function () {
        var data = this.data();
        app.utils.loading(false);
        if (data[0].Output_ID == 1) {
            app.notify.success(data[0].Output_Message);
            // fun_applyleave_pageload();
            fun_applyleaveclearcontrols();
            app.navigation.navigateLMSleavemanagementView();
        }
        else {
            app.notify.error(data[0].Output_Message);
        }
    });
}


