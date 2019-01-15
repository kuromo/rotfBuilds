var express = require('express');
var mongoose = require('mongoose')
var tNode = require('../models/tree-node.js')


module.exports.getTree = function(res, callback) {
	
	tNode.find({}, function(err, dbTree) {
		var newTree = {}

		for(var x in dbTree){
            if(!newTree[dbTree[x]["r"]]) 
                newTree[dbTree[x]["r"]] = {}

            newTree[dbTree[x]["r"]][dbTree[x]["c"]] = {
                type: dbTree[x]["type"],
                val: dbTree[x]["val"]
            }
        }
		res.send(newTree)
	})


}


module.exports.importNodes = function(nodeList, callback) {
	
/*
	tNode.deleteMany({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("cleared treeNodes from DB")
            }
        }
    );*/


	var bulkOps = [{
		"deleteMany": {
			"filter": {}
		}
	}];
	nodeList = JSON.parse(nodeList)

	for(var row in nodeList){
        for(var col in nodeList[row]){
            var nodeData = {
                tId: row + col,
                r: row,
                c: col,
                type: nodeList[row][col].type,
                val: nodeList[row][col].val
            }

            var newNode = new tNode(nodeData)
            var op = {
            	"insertOne": {
					"document": newNode
	            }
	        }

            bulkOps.push(op)
        }
    }

    console.log(bulkOps)
	//tNode.insertMany(nodeArr, onInsert);

	tNode.bulkWrite(bulkOps).then(res => {
		console.log('in: %s, mod: %s, del: %s',res.insertedCount, res.modifiedCount, res.deletedCount);
	});
}

function onInsert(err, docs) {
	if (err) {
		// TODO: handle error
	} else {
		console.info('%d potatoes were successfully stored.', docs.length);
	}
}