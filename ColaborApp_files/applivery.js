/**
 * Created by César Trigo on 28/09/14.
 */

function sendRequest(method, endpoint, content, callback){

    var requestData = {
        method: method,
        endpoint: endpoint
    };

    if(content)
        requestData.content = content;

    $.ajax({
        type: 'POST',
        url: '/dashboard/request',
        data: JSON.stringify(requestData),
        complete: function(data){
            callback(data);
        },
        dataType: "jsonp",
        jsonp: "callback",
        processData: false,
        contentType: 'application/json'
    });
};

function execRequest(method, endpoint, payload, callback){

    var requestData = {}
    requestData.method = method;
    requestData.endpoint = endpoint;

    if(payload) {
        requestData.payload = payload;
    }

    $.ajax({
        type: 'POST',
        url: '/dashboard/request/exec',
        data: JSON.stringify(requestData),
        complete: function(data){
            callback(data);
        },
        dataType: "jsonp",
        jsonp: "callback",
        processData: false,
        contentType: 'application/json'
    });
};

function displayValidationError(element, msg){
    element.popover({
        placement: 'top',
        content : msg
    });
    element.popover('show');
    element.focus();
    element.parent().addClass("has-error");
};

function hideValidationErrors(){
    $('.popover').hide();
    $(".has-error").removeClass("has-error");
};

/* View Reload after success AJAX request */
function successReload(){
    $("#successAlert").show("fast");
    $('.modal').modal('hide');
    setTimeout(function() {
        $(".alert").hide("fast", function(){
            location.reload();
        });
    }, 1000);
};

function successReloadNoMsg(){
    location.reload();
};

/* View Reload after success AJAX request */
function successReloadMsg(msg){
    $("#errorAlertMsg").html(msg);
    $("#errorAlert").hide();
    $("#successAlert").html(msg);
    $("#successAlert").show("fast");
    setTimeout(function() {
        $(".alert").hide("fast", function(){
            location.reload();
        });
    }, 3000);
};

/* View Reload after success AJAX request */
function successMsg(msg){
    $("#successAlert").html(msg);
    $("#successAlert").show("slow");
};

/* View Back after success AJAX request */
function successBack(url){
    window.location = url;
};

/* View display errors after error AJAX request */
function displayError(){
    $("#errorAlert").show("fast");
    setTimeout(function() {
        $(".alert").hide("fast");
    }, 3000);
};

/* View Reload after success AJAX request */
function displayErrorMsg(msg){
    $("#errorAlertMsg").html(msg);
    $("#errorAlert").show("fast");
    setTimeout(function() {
        $(".alert").hide("fast");
    }, 5000);
};

/* View Reload after success AJAX request */
function displayErrorMsgPermanent(msg){
    $("#errorAlertMsg").html(msg);
    $("#errorAlert").show("fast");
};

/* Reduce dates */
function reduceDates(fulldate){
    if(fulldate) {
        var startTime = new Date(fulldate);
        startTime = new Date(startTime.getTime() + ( startTime.getTimezoneOffset() * 60000 ));

        var month = parseInt(startTime.getUTCMonth()) + 1;
        var day = parseInt(startTime.getUTCDate());
        var year = startTime.getUTCFullYear()
        var hour = startTime.getUTCHours();
        var minute = startTime.getUTCMinutes();

        return year + "/" + month + "/" + day + " " + hour + ":" + minute;
    }
    else{
        return "";
    }
};

/* Normalize OS */
function osNormalization(os){
    if(os == 'ios') {
        return 'iOS';
    }
    else if(os == 'android') {
        return 'Android';
    }
    else {
        return 'Desktop'
    }
}

/* Get token */
function downloadBuild(buildId, so){
    var url = "/api/builds/"+buildId+"/token";
    sendRequest('GET', url, {}, function(data){
        if(data.responseJSON.status){
            var host = window.location.origin;

            var token = data.responseJSON.response.token;

            var distributionURL = host+"/download/" + buildId + "/manifest/"+token;
            if(so == "ios") {
                distributionURL = "itms-services://?action=download-manifest&url="+distributionURL;
            }

            document.location = distributionURL;

        }
        else{

        }
    });


};

/* getQueryVariable */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}

function validateImageFile(fileInput, file, maxSize){

    if(typeof maxSize === 'undefined'){
        maxSize = 0.01;
    }
    var maxSizeBytes = maxSize*1000000;

    var extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    if ((extension == "png" || extension == "jpeg" || extension == "jpg") && file.size <= maxSizeBytes) {
        return true;
    }
    else if(file.size > maxSizeBytes){
        fileInput.value = "";
        alert("The maximum allowed file size is "+maxSize+" Mb");
        return false;
    }
    else{
        fileInput.value = "";
        alert("This field only allows PNG, JPG, JPEG file types.");
        return false;
    }
}

function getQueryStringParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function membersToCSVParser(data){
    var result = [];
    data.forEach(function(item) {

        item.device.forEach(function(dev){
            var obj = {};
            obj._id = dev.created;
            obj.name = (dev.member) ? dev.member.fullname : 'Unknown';
            obj.email = (dev.member) ? dev.member.email : 'Unknown';
            obj.os = (dev.deviceInfo.os) ? dev.deviceInfo.os.name : 'Unknown';
            obj.version = (dev.deviceInfo.os) ? dev.deviceInfo.os.version : 'Unknown';
            obj.model = (dev.deviceInfo.device) ? dev.deviceInfo.device.model : 'Unknown';

            result.push(obj);
        });
    });

    return result;
}

function appMembersToCSVParser(data){
    console.log(data);
    var result = [];

    //Members
    data.members.forEach(function(mem) {
        var obj = {};
        obj.name = mem.member.fullname;
        obj.email = mem.member.email;
        obj.role = mem.role;
        result.push(obj);
    });

    //Teams
    data.teams.forEach(function(team) {

        team.members.forEach(function(mem){
            var obj = {};
            obj.name = mem.member.fullname;
            obj.email = mem.member.email;
            obj.role = mem.role;
            result.push(obj);
        });
    });

    return result;
}

function teamMembersToCSVParser(data){
    console.log(data);
    var result = [];

    //Members
    data.members.forEach(function(mem) {
        var obj = {};
        obj.name = mem.member.fullname;
        obj.email = mem.member.email;
        obj.role = mem.role;
        result.push(obj);
    });

    return result;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "Applivery_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function getPendingNotifications(){

    var url = '/api/members/session/notifications?unread=true';

    sendRequest('GET', url, null, function (data) {
        if (data.status && data.responseJSON != undefined) {
            var pendingNotifications = data.responseJSON.response
            if(pendingNotifications > 0){
                $('#pendingNotifications').text(pendingNotifications);

            }
        }
    });
}

function getLastNotifications(){

    var url = '/api/members/session/notifications';
    $('#notificationsList').html('<li class="header" id="pendingNotificationsHeader"></li>');
    $('#pendingNotifications').hide();

    sendRequest('GET', url, null, function (data) {
        if (data.status && data.responseJSON != undefined) {
            var notifications = data.responseJSON.response

            var totalNotifications = notifications.length;
            if(totalNotifications > 0){
                $('#pendingNotificationsHeader').text("You have "+totalNotifications+" notifications");

                notifications.forEach(function(not){

                    var notLink         =   (not.link != undefined) ? not.link : '#';
                    var notMsg          =   (not.msg != undefined) ? not.msg : '';
                    var notIcon         =   (not.icon != undefined) ? not.icon : 'fa-warning';
                    var notColor        =   (not.color != undefined) ? not.color : 'info';
                    var notLinkTarget   =   (not.target != undefined) ? not.target : '_self';

                    var html = '';
                    html += '<li>';
                        html += '<ul class="menu">';
                            html += '<li>';
                                html += '<a href="'+ notLink +'" target="'+notLinkTarget+'">';
                                    html += '<i class="fa '+notIcon+' '+notColor+' notifications-icon"></i><span class="notifications-text">' + notMsg + '</span>';
                                html += '</a>';
                            html += '</li>';
                        html += '</ul>';
                    html += '</li>';
                    $('#notificationsList').append(html);
                });
            }
            else{
                $('#pendingNotificationsHeader').html("Wll done!<br/>You don't have pending notifications!");
            }
        }
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function makeDroppable_old(element, callback) {

    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('multiple', true);
    input.style.display = 'none';

    input.addEventListener('change', triggerCallback);
    element.appendChild(input);
    
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.add('dragover');
    });

    element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
    });

    element.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        element.classList.remove('dragover');
        triggerCallback(e);
    });
    
    element.addEventListener('click', function() {
        input.value = null;
        input.click();
    });

    function triggerCallback(e) {
        var files;
        if(e.dataTransfer) {
        files = e.dataTransfer.files;
        } else if(e.target) {
        files = e.target.files;
        }
        callback.call(null, files);
    }
}

function makeDroppable(area) {
    area.on('dragover', function(e){
        e.preventDefault();
        e.stopPropagation();
        area.addClass('dragover');
        $('#default-nodrag').hide();
        $('#default-drag').show();
    });

    area.on('dragleave', function(e){
        e.preventDefault();
        e.stopPropagation();
        area.removeClass('dragover');
        $('#default-drag').hide();
        $('#default-nodrag').show();
    });

    /*area.on('drop', function(e){
        console.log("drop");
        e.preventDefault();
        e.stopPropagation();
        area.removeClass('dragover');
        $('#default-drag').hide();
        $('#default-nodrag').show();
    });*/
}