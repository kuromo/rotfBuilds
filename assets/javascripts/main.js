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
    var oldSt = $(".activeNode.start")
    oldSt.toggleClass("activeNode")
    $(newSt).toggleClass("activeNode")

    var uncon = checkUncon()
    if(uncon){
        handleUncon(newSt, uncon, oldSt)
    }
    calcTreeStat()
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
    

    calcTreeStat()
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


function changeClass(newCls){
    console.log(newCls)
    var imgSrc = "/img/classes/" + newCls + ".png"
    $(".classIcon").attr('src', imgSrc)
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