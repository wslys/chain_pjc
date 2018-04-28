var express = require('express');
var router  = express.Router();

var async = require('async');
var Web3  = require('web3');
var DbAct = require('../utils/db_act');

router.get('/', function(req, res, next) {

    var config = req.app.get('config');
    var web3 = new Web3();

    var db = new DbAct(req.app);
    web3.setProvider(config.provider);
    /**
     *
     * // TODO 封装 DB   batch | del | find | get | put, 这些方法测试可用, 实际项目需要使用 MySQL

     db.put("wsl", "ttst_value", function(err) {
        console.log(" ||+++ err +++|| >>>>>>>>>>>> ");
        console.log(err);
    });

     db.get("wsl", function(err, result) {
        console.log("--- err--- >>>>>>>>>>>>>>>> ");
        console.log(err);
        console.log("--- result--- >>>>>>>>>>>>> ");
        console.log(result);
    });

     // defaultAccount
     web3.eth.setDefaultAccount('0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0', function (err) {});

     web3.eth.defaultAccount = '0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0';

     web3.eth.getMining(function(error, result){
        console.log(" || result 表示节点是否正在挖掘 || >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(result);
    });

     web3.eth.getGasPrice(function(error, result){
        console.log("|| result || >>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(result);
    });

     web3.eth.getBalance("0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0", function (err, result) {
        console.log("|| result two || >>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(result);
    });

     web3.eth.getTransactionCount("0xd0a6e6c54dbc68db5db3a091b171a77407ff7ccf", function (err, result) {
        console.log("=== err === >>>>>>>>>>>>>>>");
        console.log(err);
        console.log("=== result === >>>>>>>>>>>>>>>");
        console.log(result);
    });
     *
     * */

    async.waterfall([
            function(callback) {
                web3.eth.getBlock("latest", false, function(err, result) {
                    callback(err, result);
                });
            },
            function(lastBlock, callback) {
                var blocks = [];

                var blockCount = 20;

                if (lastBlock.number - blockCount < 0) {
                    blockCount = lastBlock.number + 1;
                }

                async.times(blockCount, function(n, next) {
                    web3.eth.getBlock(lastBlock.number - n, true, function(err, block) {
                        next(err, block);
                    });
                }, function(err, blocks) {
                    callback(err, blocks);
                });
            }
        ],
        function(err, blocks) {
            if (err) {
                return next(err);
            }

            var txs = [];
            blocks.forEach(function(block) {
                block.transactions.forEach(function(tx) {
                    if (txs.length === 2000) {
                        return;
                    }
                    txs.push(tx);
                });
            });
            res.render('index', { blocks: blocks, txs: txs });
        });

});

module.exports = router;

