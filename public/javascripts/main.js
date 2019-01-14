//GLOBALS
var gSrv = "http://localhost:3000/"




$(function() {
    var skrl = skrollr.init();
});






//___________________TREE_____________________

$(function() {
    $(".tile").click(function(){
        console.log(this)
        var aloc = $(".activeNode")

        //check starting node
        if(!$(this).hasClass("start") && !ceckStart())
            return false

        // check if first start node
        if($(this).hasClass("start") && !$(".activeNode").hasClass("start")){
            $(".ptCount").text(aloc.length+1)
        }// if active node toggle
        else if($(this).hasClass("activeNode")){
            $(".ptCount").text(aloc.length-1)
        }else{
            // check if node is conneted to start
            if(!checkCon($(this).data("id"))){
                console.log("not connected to start")
                return false
            }// check if points left
            else if(aloc.length<82){
                //if second start
                if($(this).hasClass("start")){
                    secStart(this)
                    return false
                }

                $(".ptCount").text(aloc.length+1)

            }else{
                console.log("no poits left")
                return false
            }

        }

        $(this).toggleClass("activeNode")
        calcStats()
    })
});



function ceckStart(){
    if($(".start").hasClass("activeNode")){
        return true
    }else{
        console.log("select start")
    }
}


function secStart(newSt){
    //TODO may ask if you want the change
    //TODO search if still all connected , link:
    // https://stackoverflow.com/questions/24685152/check-if-all-tiles-are-connected
    $(".activeNode.start").toggleClass("activeNode")
    $(newSt).toggleClass("activeNode")
    calcStats()
}


// check connected tiles
function checkCon(id){
    var row = parseInt(id.split("c")[0].replace(/r/g, ''))
    var col = parseInt(id.split("c")[1])


    //top
    if(row!=1 && checkAloc( (row-1), col )){
        console.log("t")
        return true
    }

    //right
    if(col!=13 && checkAloc( row, (col+1) )){
        console.log("r")
        return true
    }

    //bottom
    if(row!=15 && checkAloc( (row+1), col )){
        console.log("b")
        return true
    }

    //left
    if(col!=1 && checkAloc( row, (col-1) )){
        console.log("l")
        return true
    }

    return false;
}

function checkAloc(row, col){
    return $(".tile[data-id='r" + row + "c" + col +"']").hasClass("activeNode")
}

function calcStats(){

}


//___________________USER_____________________

//TODO validation
function login(){
    var usrName = $("#usrName").val()
    var pwd = $("#usrPwd").val()
    console.log(usrName +"   " +pwd)

    srvPost("login", console.log, {usrName: usrName, pwd: pwd})
}

function logout(){
    srvGet("logout", console.log)
}

function register(){
    var usr= {
        usrName: $("#usrName").val(),
        mail: $("#mail").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        pwd: $("#usrPwd").val()
    }

    console.log(usr)

    srvPost("register", console.log, usr)
}

function forgot(){
    var mail = $("#mail").val()
    srvPost("forgot", console.log, {mail: mail})
}

function reset(){
    var pw = $("#usrPwd").val()
    var link = window.location.pathname.substring(1)

    srvPost(link, console.log, {pwd: pw})
}








//////////////////////////// utils ////////////////////////////////////


/*
 * server get function
 *
 * @param string, the action to call on the server
 * @param success function, called on successfull server response
 * @param object, additional param for the success function
 */
function srvGet(action, successFn, addSuccParam) {
    $.ajax({
        type: 'GET',
        data: {},
        url: gSrv + action,
        beforeSend: function () {

        },
        success: function (data) {
            console.log(data.redirect)
            if (data.redirect) {
                document.location.href = data.redirect;
            }

            if (addSuccParam) {
                successFn(data, addSuccParam)
            } else {
                successFn(data)
            }

            return data
        },
        error: function (err) {
            console.log(err)
            outputError(err)
        }
    });
}

/*
 * server post function
 * 
 * @param string, the action to call on the server
 * @param success function, called on successfull server response
 * @param json, the data to post
 */
function srvPost(action, successFn, jData) {
    $.ajax({
        type: 'POST',
        url: gSrv + action,
        data: jData,
        beforeSend: function () {

        },
        success: function (data) {
            console.log(data.redirect)
            if (data.redirect) {
                document.location.href = data.redirect;
            }

            successFn(data)
            return data;
        },
        error: function (err) {
            console.log(err)
            outputError(err)
        }
    });
}


function outputError(err){
    //console.log(err)
}




























/*
//adds autocomplete to given element
function createAC(el){
// create autocomplete
    var arr = buildAC();
    $( "#" + el ).autocomplete({
        minLength:4,
        source: function (requestObj, responseFunc) {
            var matchArry   = arr.slice ();
            var srchTerms   = $.trim (requestObj.term).split (/\s+/);

            // for each search term remove non matches.
            $.each (srchTerms, function (J, term) {
                var regX    = new RegExp (term, "i");
                matchArry   = $.map (matchArry, function (item) {
                    return regX.test (item.label)  ?  item  : null;
                } );
                console.log(matchArry)
            } );

            // return the matches
            responseFunc (matchArry);
        },
       open:   function (event, ui) {       
            var resultsList = $("ul.ui-autocomplete > li.ui-menu-item > div");
            var srchTerm    = $.trim ( $("#" + el).val () ).split (/\s+/).join ('|');

            // loop through the results list and style the terms
            resultsList.each ( function () {
                var jThis   = $(this);
                var regX    = new RegExp ('(' + srchTerm + ')', "ig");
                var oldTxt  = jThis.text ();

                jThis.html (oldTxt.replace (regX, '<span class="acHL"><b>$1</b></span>') );
            } );
        },
        select: function (event, ui) {
            console.log(event)
            console.log(ui)

            getAni(ui.item.aid)

            return false;
        }
    }).data("ui-autocomplete")._renderItem = function (ul, item) {
    return $("<li></li>")
    .data("ui-autocomplete-item", item)
    .append(acTitle(item))
    .appendTo(ul);
    };

    // run search on enter
    $( "#" + el ).keypress(function (e) {
            var key = CheckBrowser(e);
            if (key == 13) {
                e.preventDefault();
                renderResults(searchFor($("#aidTxt").val()))
                return false;
            }
            else {
                return true;
            }
        });
}

// build AC object array (label and value)
function buildAC() {
    for (var x in aTitles) {
        var tmp = '';

        for (var y in aTitles[x].lng) {
            tmp += aTitles[x].lng[y] + ', ';

        }
        tmp = tmp.substr(0, tmp.length - 2)

        aTitles[x].label = tmp
    }

    var arr = $.map(aTitles, function (value, index) {
        return [value];
    });


    return arr
}
*/












