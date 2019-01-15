var express = require('express');
var mongoose = require('mongoose')
var tNode = require('../models/tree-node.js')

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










	/*User.findOne({$or: [{email: newUser.email}, {usrName: newUser.usrName} ]}, function (err, dbUser) {
		if (err) {
			return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
		}
		if (dbUser) {
			if(dbUser.email == newUser.email){
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.EMAIL_ALREADY_EXISTS } }));
			}else{
				return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.USERNAME_ALREADY_EXISTS } }));
			}
		} else {
			newUser.save(function (err, dbUser) {
				if (err) {
					return callback(err, new ApiRes({ success: false, extras: { msg: ApiMsg.DB_ERROR } }));
				}

				var userProfileModel = new UserProfileModel({
					id: dbUser.id,
					usrName: dbUser.usrName,
					email: dbUser.email,
					firstName: dbUser.firstName,
					lastName: dbUser.lastName
				});

				return callback(err, new ApiRes({
					success: true, extras: {
						userProfileModel: userProfileModel
					}
				}));             
			});
		}
	});*/
}

function onInsert(err, docs) {
	if (err) {
		// TODO: handle error
	} else {
		console.info('%d potatoes were successfully stored.', docs.length);
	}
}