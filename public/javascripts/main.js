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
             if($(this).hasClass("start")){
                console.log("cant remove start")
                return false
             }

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


function calcTreeStat(){ 
    var stats = new TStats()


    $(".activeNode").each(function(){
        var id = $(this).data("id")
        console.log(id)

        var row = id.split("c")[0]
        var col = "c" + id.split("c")[1]
        if(tree[row][col].type != "start")
            stats[tree[row][col].type] += tree[row][col].val
        console.log(stats)
    })
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








var tree = {
    r1:{
        c1:{
            type: "wis",
            val: 3
        },
        c2:{
            type: "wis",
            val: 1
        },
        c3:{
            type: "wis",
            val: 1
        },
        c4:{
            type: "wisPre",
            val: 2
        },
        c5:{
            type: "wisPre",
            val: 1
        },
        c6:{
            type: "wis",
            val: 1
        },
        c7:{
            type: "lootPre",
            val: 1
        },
        c8:{
            type: "wis",
            val: 2
        },
        c9:{
            type: "wisPre",
            val: 1
        },
        c10:{
            type: "wis",
            val: 1
        },
        c11:{
            type: "wisPre",
            val: 3
        },
        c12:{
            type: "wis",
            val: 1
        },
        c13:{
            type: "wis",
            val: 1
        }
    },
    r2:{
        c1:{
            type: "wisPre",
            val: 1
        },
        c2:{
            type: "wis",
            val: 1
        },
        c3:{
            type: "wis",
            val: 1
        },
        c4:{
            type: "start",
            val: "surv"
        },
        c5:{
            type: "atk",
            val: 1
        },
        c6:{
            type: "dex",
            val: 1
        },
        c7:{
            type: "atk",
            val: 2
        },
        c8:{
            type: "dex",
            val: 1
        },
        c9:{
            type: "dex",
            val: 2
        },
        c10:{
            type: "start",
            val: "infi"
        },
        c11:{
            type: "dex",
            val: 1
        },
        c12:{
            type: "dex",
            val: 1
        },
        c13:{
            type: "atk",
            val: 1
        }
    },
    r3:{
        c1:{
            type: "rof",
            val: 2
        },
        c2:{
            type: "rof",
            val: 1
        },
        c3:{
            type: "dex",
            val: 1
        },
        c4:{
            type: "atk",
            val: 1
        },
        c5:{
            type: "atk",
            val: 1
        },
        c6:{
            type: "rof",
            val: 2
        },
        c7:{
            type: "spd",
            val: 1
        },
        c8:{
            type: "spd",
            val: 1
        },
        c9:{
            type: "spd",
            val: 2
        },
        c10:{
            type: "def",
            val: 2
        },
        c11:{
            type: "spd",
            val: 2
        },
        c12:{
            type: "def",
            val: 1
        },
        c13:{
            type: "def",
            val: 1
        }
    },
    r4:{
        c1:{
            type: "spdPre",
            val: 2
        },
        c2:{
            type: "defPre",
            val: 4
        },
        c3:{
            type: "def",
            val: 1
        },
        c4:{
            type: "spd",
            val: 1
        },
        c5:{
            type: "def",
            val: 1
        },
        c6:{
            type: "spd",
            val: 1
        },
        c7:{
            type: "def",
            val: 1
        },
        c8:{
            type: "spd",
            val: 2
        },
        c9:{
            type: "def",
            val: 2
        },
        c10:{
            type: "atkPre",
            val: 1
        },
        c11:{
            type: "vit",
            val: 1
        },
        c12:{
            type: "vit",
            val: 2
        },
        c13:{
            type: "vit",
            val: 1
        }
    },
    r5:{
        c1:{
            type: "atkPre",
            val: 1
        },
        c2:{
            type: "vit",
            val: 2
        },
        c3:{
            type: "vitPre",
            val: 2
        },
        c4:{
            type: "vit",
            val: 1
        },
        c5:{
            type: "vitPre",
            val: 2
        },
        c6:{
            type: "defPre",
            val: 5
        },
        c7:{
            type: "atkPre",
            val: 2
        },
        c8:{
            type: "vitPre",
            val: 3
        },
        c9:{
            type: "vit",
            val: 1
        },
        c10:{
            type: "vit",
            val: 1
        },
        c11:{
            type: "vitPre",
            val: 2
        },
        c12:{
            type: "def",
            val: 1
        },
        c13:{
            type: "hp",
            val: 10
        }
    },
    r6:{
        c1:{
            type: "mp",
            val: 5
        },
        c2:{
            type: "mp",
            val: 10
        },
        c3:{
            type: "hp",
            val: 5
        },
        c4:{
            type: "start",
            val: "sent"
        },
        c5:{
            type: "hpPre",
            val: 3
        },
        c6:{
            type: "mpPre",
            val: 3
        },
        c7:{
            type: "mpPre",
            val: 3
        },
        c8:{
            type: "hp",
            val: 10
        },
        c9:{
            type: "mp",
            val: 10
        },
        c10:{
            type: "start",
            val: "loot"
        },
        c11:{
            type: "hp",
            val: 5
        },
        c12:{
            type: "hp",
            val: 5
        },
        c13:{
            type: "mp",
            val: 5
        }
    },
    r7:{
        c1:{
            type: "mp",
            val: 5
        },
        c2:{
            type: "hpPre",
            val: 2
        },
        c3:{
            type: "lootPre",
            val: 1
        },
        c4:{
            type: "lootPre",
            val: 1
        },
        c5:{
            type: "lootPre",
            val: 1
        },
        c6:{
            type: "lootPre",
            val: 1
        },
        c7:{
            type: "lootPre",
            val: 1
        },
        c8:{
            type: "eva",
            val: 1
        },
        c9:{
            type: "eva",
            val: 2
        },
        c10:{
            type: "eva",
            val: 1
        },
        c11:{
            type: "eva",
            val: 1
        },
        c12:{
            type: "eva",
            val: 3
        },
        c13:{
            type: "evaPre",
            val: 4
        }
    },
    r8:{
        c1:{
            type: "eva",
            val: 1
        },
        c2:{
            type: "eva",
            val: 2
        },
        c3:{
            type: "evaPre",
            val: 3
        },
        c4:{
            type: "spd",
            val: 2
        },
        c5:{
            type: "spd",
            val: 1
        },
        c6:{
            type: "spdPre",
            val: 3
        },
        c7:{
            type: "spdPre",
            val: 1
        },
        c8:{
            type: "lootPre",
            val: 1
        },
        c9:{
            type: "eva",
            val: 1
        },
        c10:{
            type: "spd",
            val: 1
        },
        c11:{
            type: "hp",
            val: 5
        },
        c12:{
            type: "mp",
            val: 5
        },
        c13:{
            type: "hpPre",
            val: 2
        }
    },
    r9:{
        c1:{
            type: "mpPre",
            val: 2
        },
        c2:{
            type: "hpPre",
            val: 3
        },
        c3:{
            type: "mpPre",
            val: 3
        },
        c4:{
            type: "hp",
            val: 10
        },
        c5:{
            type: "mp",
            val: 10
        },
        c6:{
            type: "rof",
            val: 1
        },
        c7:{
            type: "rof",
            val: 1
        },
        c8:{
            type: "atk",
            val: 1
        },
        c9:{
            type: "dex",
            val: 1
        },
        c10:{
            type: "atk",
            val: 1
        },
        c11:{
            type: "dexPre",
            val: 2
        },
        c12:{
            type: "atkPre",
            val: 2
        },
        c13:{
            type: "wis",
            val: 2
        }
    },
    r10:{
        c1:{
            type: "wisPre",
            val: 5
        },
        c2:{
            type: "wisPre",
            val: 10
        },
        c3:{
            type: "wis",
            val: 5
        },
        c4:{
            type: "start",
            val: "mani"
        },
        c5:{
            type: "wis",
            val: 3
        },
        c6:{
            type: "wis",
            val: 3
        },
        c7:{
            type: "vit",
            val: 3
        },
        c8:{
            type: "vit",
            val: 10
        },
        c9:{
            type: "vitPre",
            val: 10
        },
        c10:{
            type: "start",
            val: "butch"
        },
        c11:{
            type: "hp",
            val: 5
        },
        c12:{
            type: "hp",
            val: 5
        },
        c13:{
            type: "hp",
            val: 1
        }
    },
    r11:{
        c1:{
            type: "vitPre",
            val: 1
        },
        c2:{
            type: "rof",
            val: 1
        },
        c3:{
            type: "dexPre",
            val: 1
        },
        c4:{
            type: "dexPre",
            val: 1
        },
        c5:{
            type: "rof",
            val: 1
        },
        c6:{
            type: "eva",
            val: 1
        },
        c7:{
            type: "evaPre",
            val: 1
        },
        c8:{
            type: "eva",
            val: 2
        },
        c9:{
            type: "spd",
            val: 1
        },
        c10:{
            type: "hp",
            val: 3
        },
        c11:{
            type: "mp",
            val: 3
        },
        c12:{
            type: "hpPre",
            val: 1
        },
        c13:{
            type: "mpPre",
            val: 1
        }
    },
    r12:{
        c1:{
            type: "wis",
            val: 1
        },
        c2:{
            type: "vit",
            val: 1
        },
        c3:{
            type: "spd",
            val: 1
        },
        c4:{
            type: "atk",
            val: 1
        },
        c5:{
            type: "defPre",
            val: 2
        },
        c6:{
            type: "def",
            val: 1
        },
        c7:{
            type: "def",
            val: 2
        },
        c8:{
            type: "vit",
            val: 1
        },
        c9:{
            type: "def",
            val: 1
        },
        c10:{
            type: "defPre",
            val: 2
        },
        c11:{
            type: "vit",
            val: 1
        },
        c12:{
            type: "defPre",
            val: 2
        },
        c13:{
            type: "def",
            val: 1
        }
    },
    r13:{
        c1:{
            type: "rof",
            val: 1
        },
        c2:{
            type: "atk",
            val: 1
        },
        c3:{
            type: "rof",
            val: 1
        },
        c4:{
            type: "atk",
            val: 1
        },
        c5:{
            type: "spd",
            val: 1
        },
        c6:{
            type: "spd",
            val: 1
        },
        c7:{
            type: "spd",
            val: 1
        },
        c8:{
            type: "spd",
            val: 1
        },
        c9:{
            type: "spdPre",
            val: 1
        },
        c10:{
            type: "spdPre",
            val: 1
        },
        c11:{
            type: "spdPre",
            val: 1
        },
        c12:{
            type: "eva",
            val: 3
        },
        c13:{
            type: "vit",
            val: 1
        }
    },
    r14:{
        c1:{
            type: "wis",
            val: 1
        },
        c2:{
            type: "rof",
            val: 2
        },
        c3:{
            type: "vitPre",
            val: 2
        },
        c4:{
            type: "start",
            val: "jugg"
        },
        c5:{
            type: "lootPre",
            val: 1
        },
        c6:{
            type: "hp",
            val: 5
        },
        c7:{
            type: "mp",
            val: 5
        },
        c8:{
            type: "hpPre",
            val: 1
        },
        c9:{
            type: "mpPre",
            val: 1
        },
        c10:{
            type: "start",
            val: "adep"
        },
        c11:{
            type: "atk",
            val: 2
        },
        c12:{
            type: "def",
            val: 2
        },
        c13:{
            type: "defPre",
            val: 3
        }
    },
    r15:{
        c1:{
            type: "def",
            val: 1
        },
        c2:{
            type: "defPre",
            val: 1
        },
        c3:{
            type: "vit",
            val: 1
        },
        c4:{
            type: "atk",
            val: 1
        },
        c5:{
            type: "dex",
            val: 1
        },
        c6:{
            type: "spd",
            val: 1
        },
        c7:{
            type: "def",
            val: 1
        },
        c8:{
            type: "vit",
            val: 1
        },
        c9:{
            type: "wis",
            val: 1
        },
        c10:{
            type: "hp",
            val: 5
        },
        c11:{
            type: "mp",
            val: 5
        },
        c12:{
            type: "eva",
            val: 2
        },
        c13:{
            type: "lootPre",
            val: 1
        }
    }
}