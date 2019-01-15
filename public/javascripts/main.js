/*! rotfBuilds - v0.0.0 - 2019-01-15
* Copyright (c) 2019 ;*/
//GLOBALS
var gSrv = "http://localhost:3000/"




$(function() {
    var skrl = skrollr.init();
});





//___________________TREE_____________________


function importTree(){



    srvPost("importTree", console.log, {tree: JSON.stringify(tree)})
}
function getTree(){

 

    srvGet("getTree", function(dbTree){
        /*var newTree = {}

        for(var x in dbTree){
            if(!newTree[dbTree[x]["r"]]) 
                newTree[dbTree[x]["r"]] = {}

            newTree[dbTree[x]["r"]][dbTree[x]["c"]] = {
                type: dbTree[x]["type"],
                val: dbTree[x]["val"]
            }
        }*/
        console.log(dbTree)
    })
}

$(function() {
    $(".tile").click(function(){
        console.log(this)
        var aloc = $(".activeNode")

        //check starting node
        if(!$(this).hasClass("start") && !ceckStart())
            return false

        // check if first start node
        if($(this).hasClass("start") && !$(".activeNode").hasClass("start")){
            //$(".ptCount").text(aloc.length+1)
        }// if active node toggle
        else if($(this).hasClass("activeNode")){
             if($(this).hasClass("start")&&aloc.length!=1){
                console.log("cant remove start")
                return false
             }

            //$(".ptCount").text(aloc.length-1)
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

                //$(".ptCount").text(aloc.length+1)

            }else{
                console.log("no poits left")
                return false
            }

        }

        $(this).toggleClass("activeNode")
        calcTreeStat()
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
    calcTreeStat()
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

function updateStats(stats){

    //update tree stats
    var str = ""

    for (var stat in stats){
        var val = stats[stat]
        if(Number.isInteger(val)&&val !==0){
            str += stat 
            str += ":  " 
            str += val 
            str += "<br>" 
        }
    }

    $("#tStatCont").html(str)


    //update point counter
    var aloc = $(".activeNode")
    $(".ptCount").text(aloc.length)
}

function calcTreeStat(){ 
    var stats = new TStats()


    $(".activeNode").each(function(){
        var id = $(this).data("id")

        var row = id.split("c")[0]
        var col = "c" + id.split("c")[1]
        if(tree[row][col].type == "start"){
            calcStart(tree[row][col].val, stats)
        }else{
             stats[tree[row][col].type] += tree[row][col].val
        }
    })

    updateStats(stats)
}


function calcStart(starter, stats){
    for(var stat in stNodes[starter]){
        stats[stat] += stNodes[starter][stat]
    }
}




//___________________TreeStats_____________________

function TStats(){
    this.vit = 0
    this.vitPre = 0
    this.dex = 0
    this.dexPre = 0
    this.lootPre = 0
    this.mp = 0
    this.mpPre = 0
    this.eva = 0
    this.evaPre = 0
    this.spd = 0
    this.spdPre = 0
    this.hp = 0
    this.hpPre = 0
    this.wis = 0
    this.wisPre = 0
    this.rof = 0
    this.atk = 0
    this.atkPre = 0
    this.def = 0
    this.defPre = 0

}

TStats.prototype.getFlat = function() {
    return {
        vit: this.vit,
        dex: this.dex,
        mp: this.mp,
        eva: this.eva,
        spd: this.spd,
        hp: this.hp,
        wis: this.wis,
        rof: this.rof,
        atk: this.atk,
        def: this.def
    }
}

TStats.prototype.getPre = function() {
    return {
        vitPre: this.vitPre,
        dexPre: this.dexPre,
        lootPre: this.lootPre,
        mpPre: this.mpPre,
        evaPre: this.evaPre,
        spdPre: this.spdPre,
        hpPre: this.hpPre,
        wisPre: this.wisPre,
        atkPre: this.atkPre,
        defPre: this.defPre 
    }
}




//___________________NAV_____________________

$(function() {
    $("#navLogBtn").click(function(){
        if($("#navUsr").attr("hidden")){
            $("#navUsr").attr("hidden", false)
            $("#navPwd").attr("hidden", false)
        }else{
            var usrName = $("#navUsr").val()
            var pwd = $("#navPwd").val()

            srvPost("login", console.log, {usrName: usrName, pwd: pwd})
        }

    })
})






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