/*! rotfBuilds - v0.0.0 - 2019-01-27
* Copyright (c) 2019 ;*/
//GLOBALS
var gSrv = "http://localhost:3000/"




$(function() {
    var skrl = skrollr.init();
});




//___________________RUNES_____________________

function toggleSmRune(stat){
    
    $(".smRune[data-stat='" + stat + "']").toggleClass("active")

    updateStats()
}

function getSmRuneStats(){
    var stats = {}

    $(".smRune.active").each(function(){
        stats[$(this).attr("data-stat")] = parseInt($(this).attr("data-value"))
    })
    
    return stats
}

function changeBRune(runeDD, newRune){
    var imgSrc = "/img/runes/" + newRune + ".png"
    $(".rune" + runeDD + "Icon").attr('src', imgSrc)
    $(".rune" + runeDD + "Icon").attr('data-rune', newRune)
    
    $("#rune" + runeDD + "DD").toggleClass("show")
    $("." + runeDD + "DDBtn:not(.collapsed)").toggleClass("collapsed")



    updateStats()
}

function getBRuneStats(){
    var rRune  =  $(".runeRedIcon").attr('data-rune')
    var rRuneStats  = (rRune) ? bRunes[rRune].stats : {}
    var gRune  =  $(".runeGreenIcon").attr('data-rune')
    var gRuneStats  = (gRune) ? bRunes[gRune].stats : {}
    var bRune  =  $(".runeBlueIcon").attr('data-rune')
    var bRuneStats  = (bRune) ? bRunes[bRune].stats : {}
    var aRune  =  $(".runeAllIcon").attr('data-rune')
    var aRuneStats  = (aRune) ? bRunes[aRune].stats : {}

    var stats = sumObjectsByKey([rRuneStats, gRuneStats, bRuneStats, aRuneStats])

    console.log("bNode stats:")
    console.log(stats)

    if(rRune && bRunes[rRune].special){
        console.log("rRune special")
        console.log(bRunes[rRune].special)
    }
    if(gRune && bRunes[gRune].special){
        console.log("gRune special")
        console.log(bRunes[gRune].special)
    }
    if(bRune && bRunes[bRune].special){
        console.log("bRune special")
        console.log(bRunes[bRune].special)
    }
    if(aRune && bRunes[aRune].special){
        console.log("aRune special")
        console.log(bRunes[aRune].special)
    }

    return stats
}






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

function saveTree(){
    var nodes = []
    $(".activeNode").each(function(){
        nodes.push($(this).attr("data-id"))
    })

    console.log(nodes)
}

function loadTree(){
    
    var nodes = eval($("#loadTxt").val())

    $(".activeNode").toggleClass("activeNode")

    for(var x in nodes){
        $(".tile[data-id=" + nodes[x] + "]").toggleClass("activeNode")
    }
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
            if(!getAdjac($(this).data("id"))){
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

        var uncon = checkUncon()
        if(uncon){
            handleUncon(this, uncon)
        }


        updateStats()
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
    var oldSt = $(".activeNode.start")
    oldSt.toggleClass("activeNode")
    $(newSt).toggleClass("activeNode")

    var uncon = checkUncon()
    if(uncon){
        handleUncon(newSt, uncon, oldSt)
    }
    updateStats()
}


// check connected tiles
function getAdjac(id){
    var row = parseInt(id.split("c")[0].replace(/r/g, ''))
    var col = parseInt(id.split("c")[1])
    var adjNodes = {}


    //top
    if(row!=1 && checkAloc( (row-1), col )){
        var node = $(".tile[data-id='r" + (row-1) + "c" + col +"']")
        adjNodes[node.attr("data-id")] = node
    }

    //right
    if(col!=13 && checkAloc( row, (col+1) )){
        var node = $(".tile[data-id='r" + row + "c" + (col+1) +"']")
        adjNodes[node.attr("data-id")] = node
    }

    //bottom
    if(row!=15 && checkAloc( (row+1), col )){
        var node = $(".tile[data-id='r" + (row+1) + "c" + col +"']")
        adjNodes[node.attr("data-id")] = node
    }

    //left
    if(col!=1 && checkAloc( row, (col-1) )){
        var node = $(".tile[data-id='r" + row + "c" + (col-1) +"']")
        adjNodes[node.attr("data-id")] = node
    }

    if(hasProp(adjNodes)){
        return adjNodes
    }else{
        return false
    }
}

function checkAloc(row, col){
    return $(".tile[data-id='r" + row + "c" + col +"']").hasClass("activeNode")
}

function checkUncon(){
    var visited = breadthFirst()
    var aloc = $(".activeNode")
    var uncon = {}


    for (var i = 0; i < aloc.length; i++) {
        var id = $(aloc[i]).attr("data-id")
        if(!visited[id]){
            uncon[id] = aloc[i]
        }
    }

    if(hasProp(uncon)){
        return uncon
    }else{
        return false
    }

    //console.log("visited nodes: ")
    //console.log(visited)

}

function breadthFirst() {
    var start = $(".activeNode.start")
    var visited = {};
    visited[$(start).attr("data-id")] = start
    var queue = [start];

    while(queue.length) {
        var current = queue.shift();
        var adjNodes = getAdjac($(current).attr("data-id"))

        for (var id in adjNodes) {
            var node = adjNodes[id];

            if (!visited[id]) {
                visited[id] = node;
                queue.push(node);
            }
        }

    }
    return visited;
}

function handleUncon(clicked, uncon, oldSt){
    var clickedId = $(clicked).attr("data-id")
    var oldStId = $(oldSt).attr("data-id")
    var unconStr = ""
    for(var id in uncon){
        unconStr += id
        unconStr += ","
    }
    unconStr = unconStr.slice(0, -1);

    if($(clicked).hasClass("start")){

        var head = '<h5 class="modal-title">Start cahnge</h5>'
        var body = 'newSt:'
            + statById(clickedId).toModal()
            + 'oldSt:'
            + statById(oldStId).toModal()
        +'<h3>some nodes are unconnected</h3>'
            + statById(unconStr).toModal()
        var foot = '<button type="button" class="btn btn-primary" data-dismiss="modal" onClick="'
            + 'toggleNodes(\'' + unconStr + '\')'
            +'">Remove</button>'
            +'<button type="button" class="btn btn-secondary" data-dismiss="modal" onClick="'
            + 'toggleNodes(\'' + clickedId + ',' + oldStId + '\')'
            +'">Keep Old</button>'

    }else{
        var head = '<h5 class="modal-title">Unconnected ndoes</h5>'

        var body = 'unalocated node:'
        + statById(clickedId).toModal()
        +'will be unconnected:'
        + statById(unconStr).toModal()

        var foot = '<button type="button" class="btn btn-primary" data-dismiss="modal" onClick="'
            + 'toggleNodes(\'' + unconStr + '\')'
            +'">Remove</button>'
            +'<button type="button" class="btn btn-secondary" data-dismiss="modal" onClick="'
            + 'toggleNodes(\'' + clickedId + '\')'
            +'">Undo</button>'
    }

     createModal(head, body, foot) 

}

function toggleNodes(nodeIds){
    nodeIds = nodeIds.split(",")

    for(var x in nodeIds){
        $(".tile[data-id='" + nodeIds[x] +"']").toggleClass("activeNode")
    }

    window.setTimeout(function(){$("#treeModal").remove()},500)
    

    updateStats()
}

function statById(nodeIds){
    var stats = new TStats()
    nodeIds = nodeIds.split(",")

    for(var x in nodeIds){

        var row = nodeIds[x].split("c")[0]
        var col = "c" + nodeIds[x].split("c")[1]
        if(tree[row][col].type == "start"){
            for(var stat in stNodes[tree[row][col].val]){
                stats[stat] += stNodes[tree[row][col].val][stat]
            }
        }else{
             stats[tree[row][col].type] += tree[row][col].val
        }
    }
    console.log(stats.getActive())
    return stats.getActive()
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

TStats.prototype.getActive = function() {
    var activeStats = {}
    for(var stat in this){
        if(this[stat]!=0)
            activeStats[stat] = this[stat]
    }

    return activeStats
}

TStats.prototype.toModal = function() {
    var html = '<div class="modalStats">'
    for(var stat in this){
        if(typeof this[stat] != 'function')
            html += '<b>' + stat + ': </b>' +this[stat] + '<br/>'
    }
    html += '</div>'
    return html
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

    return stats
}


function calcStart(starter, stats){
    for(var stat in stNodes[starter]){
        stats[stat] += stNodes[starter][stat]
    }
}


function changeClass(newCls){
    console.log(newCls)
    var imgSrc = "/img/classes/" + newCls + ".png"
    $(".classIcon").attr('src', imgSrc)
    $(".classIcon").attr('data-class', newCls)
    
    $("#classDD").toggleClass("show")
    $(".classDDBtn:not(.collapsed)").toggleClass("collapsed")



    updateStats()
}


//___________________Stat Screen_____________________
function updateStats(){
    var tStats = calcTreeStat()
    var smRuneStats= getSmRuneStats()
    var bRuneStats= getBRuneStats()
    var curClass =  $(".classIcon").attr('data-class')
    var classStats = (curClass) ? classes[curClass].stats : {}
    var gearStats = getGearStats()

    /*var gearStats = {
        hp: 60,
        mp: 10,
        atk: 1,
        def: 36,
        spd: 1,
        dex: 12,
        vit: 6,
        wis: 1,
    }*/

    /*console.log("tStats: ")
    console.log(tStats)
    console.log("smRuneStats: ")
    console.log(smRuneStats)
    console.log("classStats: ")
    console.log(classStats)
   /* console.log("stat sum")
    console.log(sumObjectsByKey([tStats, smRuneStats, classStats, gearStats]))*/

    var withPre = calcIncreases(sumObjectsByKey([gearStats, tStats.getPre(), smRuneStats, bRuneStats, classStats]))
    var withFlat = sumObjectsByKey([tStats.getFlat(), withPre])

    //var endStats= calcIncreases(sumObjectsByKey([tStats, smRuneStats, classStats/*, gearStats*/]))

    renderStats(withFlat)
    calcAdvStats(withFlat)
}

function renderStats(stats){
    $("#hpBar").html(stats.hp)
    $("#mpBar").html(stats.mp)
    $("#atkStat .statValue").html(stats.atk)
    $("#defStat .statValue").html(stats.def)
    $("#spdStat .statValue").html(stats.spd)
    $("#dexStat .statValue").html(stats.dex)
    $("#vitStat .statValue").html(stats.vit)
    $("#wisStat .statValue").html(stats.wis)
}

function calcIncreases(stats){
   

    stats["hp"] = stats.hp * (1 + stats.hpPre/100)
    stats["mp"] = stats.mp * (1 + stats.mpPre/100)
    stats["atk"] = stats.atk * (1 + stats.atkPre/100)
    stats["def"] = stats.def * (1 + stats.defPre/100)
    stats["spd"] = stats.spd * (1 + stats.spdPre/100)
    stats["dex"] = stats.dex * (1 + stats.dexPre/100)
    stats["vit"] = stats.vit * (1 + stats.vitPre/100)
    stats["wis"] = stats.wis * (1 + stats.wisPre/100)

    return stats
}

function getGearStats(){
    var stats = {}
    stats["hp"] = parseInt($("#hpTxt").val())
    stats["mp"] = parseInt($("#mpTxt").val())
    stats["atk"] = parseInt($("#atkTxt").val())
    stats["def"] = parseInt($("#defTxt").val())
    stats["spd"] = parseInt($("#spdTxt").val())
    stats["dex"] = parseInt($("#dexTxt").val())
    stats["vit"] = parseInt($("#vitTxt").val())
    stats["wis"] = parseInt($("#wisTxt").val())
    stats["avgDmg"] = (parseInt($("#minDmgTxt").val()) + parseInt($("#maxDmgTxt").val()) - 1) / 2
    stats["shots"] = parseInt($("#shotsTxt").val())
    stats["rof"] = parseInt($("#rofTxt").val()) -100
 
    return stats
}

function calcAdvStats(stats){
    var advStats = stats
    advStats["hpps"] = 1 + 0.12 * stats.vit
    advStats["mpps"] = 0.5 + 0.06 * stats.wis
    advStats["defCap"] = stats.def + stats.def / 85 * 15
    advStats["tps"] = 4 + 5.6 * (stats.spd / 75)


    advStats["dexAps"] = 1.5 + 6.5 * (stats.dex / 75)
    advStats["aps"] = advStats.dexAps * (1 + stats.rof/100)
    advStats["atkMulti"] = 1.5 + 6.5 * (stats.atk / 75)

    advStats["dps"] = (stats.avgDmg * advStats.atkMulti * stats.shots) * advStats.aps
    
    //((Avg Damage  * atkMulti * Number of Shots) * (dexAps * rof))



    console.log("advStats")
    console.log(advStats)
    renderAdvStats(advStats)
}

function renderAdvStats(stats){
    var hppsWReg = stats.hpps * (1 + (stats.hReg || 0) / 100)
    var hppsString = hppsWReg + " (" +stats.hpps +")"
    var mppsWReg = stats.mpps * (1 + (stats.mReg || 0) / 100)
    var mppsString = mppsWReg + " (" +stats.mpps +")"

    $("#hppsStat .statValue").html(hppsString)
    $("#mppsStat .statValue").html(mppsString)

    $("#defCapStat .statValue").html(stats.defCap)
    $("#tpsStat .statValue").html(stats.tps)
    $("#dexApsStat .statValue").html(stats.dexAps)
    $("#apsStat .statValue").html(stats.aps)
    $("#dpsStat .statValue").html(stats.dps)
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


function hasProp(object) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            return true;
        }
    }
    return false;
}

function sumObjectsByKey(objs) {
  return objs.reduce(function (a, b) {
    for(var k in b) {
      if(b.hasOwnProperty(k))
        a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

function createModal(head, body, foot){

    var modal = '<div id="treeModal" class="modal" tabindex="-1" role="dialog" show="true">'
    +'<div class="modal-dialog" role="document">'
        +'<div class="modal-content">'
        +'<div class="modal-header">'
            + head
        +'</div>'
        +'<div class="modal-body">'
            + body
        +'</div>'
        +'<div class="modal-footer">'
            + foot
        +'</div>'
        +'</div>'
    +'</div>'
    +'</div>'

    $("#mainCont").append( modal )   
    $("#treeModal").modal({backdrop: 'static', keyboard: false}) 
    $("#treeModal").modal("show") 
}