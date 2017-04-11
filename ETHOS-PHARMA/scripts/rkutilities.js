// user not allowing to exceeding chars
function textinputlength(val, max, id) {
    // alert(val);
    if (val.length > max) {
        $("#" + id).val(val.substring(0, max));
    }
    //else {
    //    $("#" + id).val(val);
    //}
}

function todateddmmyyy(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "/" + month + "/" + year;

    return date;
}
function todateddmmyyy_hyphen(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var date = day + "-" + month + "-" + year;

    return date;
}

function todateddmmyyyhhmmss_hyphen(dateObject) {
    var d = new Date(dateObject);
    var year = d.getFullYear(); 
    var month = d.getMonth() + 1;
    var day = d.getDate(); 
    var hh = (d.getHours());
    var mm = (d.getMinutes());
    var ss = (d.getSeconds());
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (hh < 10) {
        hh = "0" + hh;
    }
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (ss < 10) {
        ss = "0" + ss;
    } 
    var date = day + "-" + month + "-" + year + " " + hh + ":" + mm + ":" + ss;
    return date;
} 
//$(function () {
//    $("input:text.datepicker").kendoDatePicker({
//        format: 'dd-MM-yyyy'
//    });
//});

function SelectAllCheckBoxes(obj) {
    var checkBoxList = $('input:checkbox[class=chkCls]');
    if (obj.checked) {
        for (var i = 0; i < checkBoxList.length ; i++) {
            checkBoxList[i].checked = true;
        }
        //var isActiveAttr = $(checkBoxList[0]).attr('isactive');
        //if (isActiveAttr == "True") {
        //    $("[id$='spanDeactivateBtn']").show();
        //    $("[id$='spanActivateBtn']").hide();
        //}
        //else if (isActiveAttr == "False") {
        //    $("[id$='spanActivateBtn']").show();
        //    $("[id$='spanDeactivateBtn']").hide();
        //}
    }
    else if (!obj.checked) {
        for (var i = 0; i < checkBoxList.length ; i++) {
            checkBoxList[i].checked = false;
        }
        //$("[id$='spanDeactivateBtn']").hide();
        //$("[id$='spanActivateBtn']").hide();
    }
}

function SelectSingleCheckBox(obj) {
    var isActiveRecord = $(obj).attr('isactive');

    if ($('input:checkbox[class=chkCls]').length == $('input[class=chkCls]:checked').length) {
        $("[id$='grvChkSelectAll']").prop("checked", "checked");
    }
    else if ($('input[class=chkCls]:checked').length >= 0) {
        $("[id$='grvChkSelectAll']").removeAttr("checked");
    }

    //if (isActiveRecord == "True") {
    //    $("[id$='spanDeactivateBtn']").show();
    //    $("[id$='spanActivateBtn']").hide();
    //}
    //else if (isActiveRecord == "False") {
    //    $("[id$='spanActivateBtn']").show();
    //    $("[id$='spanDeactivateBtn']").hide();
    //}

    //if ($('input[class=chkCls]:checked').length == 0) {
    //    $("[id$='spanDeactivateBtn']").hide();
    //    $("[id$='spanActivateBtn']").hide();
    //}
}


function toggleSingleCheckBox(obj) {
    var isActiveRecord = $(obj).attr('checked');
    if (isActiveRecord = "checked")
    {
        obj.removeAttr("checked");
    } 
    else {
        obj.attr("checked", "checked");
    }
}