var express = require('express');
var router  = express.Router();

var async = require('async');
var Web3  = require('web3');

router.get('/:account', function(req, res, next) {

    var config = req.app.get('config');
    var web3 = new Web3();
    web3.setProvider(config.provider);

    var db = req.app.get('db');

    var data = {};

    async.waterfall([
            function(callback) {
                /*web3.eth.getBlock(req.params.account, false, function(err, result) {
                    callback(err, result);
                });*/
                web3.eth.getBlock("latest", false, function(err, result) {
                    callback(err, result);
                });
            },
            function(lastBlock, callback) {
                /*console.log(" lastBlock >>>>>>>>>>>>>>>>>>>>>> ");
                console.log(lastBlock);*/
                data.lastBlock = lastBlock.number;
                
                // 如果块计数大于1000，则将块从块限制到1000个块之前。
                // limits the from block to -1000 blocks ago if block count is greater than 1000
                
                if(data.lastBlock > 0x3E8){
                    data.fromBlock = data.lastBlock - 0x3e8;
                }else{
                    data.fromBlock = 0x00;
                }

                /*if(data.lastBlock > 0xeeee){
                    console.log("data.lastBlock > 0xeeee");
                    data.fromBlock = data.lastBlock - 0xeeee;
                }else{
                    data.fromBlock = 0xeeee;
                }*/

                web3.eth.getBlockNumber(function(error, _result){ // 返回当前区块号
                    /*console.log("|| === result === ||>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log(result);*/
                    web3.eth.getBlockTransactionCount("0x7b72a9ee2b52ec8e3d68091d630ccf5bc2d187641092ced0cbf9dd6b7d0f84b5", function(err, number) { // 返回指定区块的交易数量
                        /*console.log("================== 指定区块的交易数量 ==================");
                        console.log("=== err ===");
                        console.log(err);
                        console.log("=== number ===");*/
                        console.log(number);
                    });
                });

                // 获得在指定区块时给定地址的余额。
                web3.eth.getBalance(req.params.account, function(err, balance) {
                    /*console.log(" balance >>>>>>>>>>>>>>>>>>>>>>");
                    console.log(balance);*/
                    callback(err, balance);
                });
            },
            function(balance, callback) {
                data.balance = balance;
                // 获取指定地址的代码
                web3.eth.getCode(req.params.account, function(err, code) {
                    /*console.log(" code >>>>>>>>>>>>>>>>>>>>>>");
                    console.log(code);*/
                    callback(err, code);
                });
            },
            function(code, callback) {
                data.code = code;
                if (code !== "0x") {
                    data.isContract = true;
                }

                db.get(req.params.account.toLowerCase(), function(err, value) {
                    /*console.log(" err >>>>>>>>>>>>>>>>>>>>>> ");
                    console.log(err);
                    console.log(" value >>>>>>>>>>>>>>>>>>>>>> ");
                    console.log(value);*/
                    callback(null, value);
                });
            },
            function(source, callback) {

                if (source) {
                    data.source = JSON.parse(source);

                    var abi = JSON.parse(data.source.abi);
                    var contract = web3.eth.contract(abi).at(req.params.account);

                    data.contractState = [];

                    async.eachSeries(abi, function(item, eachCallback) {
                        if (item.type === "function" && item.inputs.length === 0 && item.constant) {
                            try {
                                contract[item.name](function(err, result) {
                                    data.contractState.push({ name: item.name, result: result });
                                    eachCallback();
                                });
                            } catch(e) {
                                /*console.log(e);*/
                                eachCallback();
                            }
                        } else {
                            eachCallback();
                        }
                    }, function(err) {
                        callback(err);
                    });

                } else {
                    callback();
                }
            },
            function(callback) {
                web3.trace.filter({ "fromBlock": "0x" + data.fromBlock.toString(16), "fromAddress": [ req.params.account ] }, function(err, traces) {
                    /*console.log("||err||>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log(err);
                    console.log("||traces||>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log(traces);
                    console.log(" ====== traces ====== ");
                    console.log(traces);*/
                    callback(err, traces);
                });
            }, 
            function(tracesSent, callback) {
                data.tracesSent = tracesSent;
                web3.trace.filter({ "fromBlock": "0x" + data.fromBlock.toString(16), "toAddress": [ req.params.account ] }, function(err, traces) {
                    callback(err, traces);
                });
            }
        ],
        function(err, tracesReceived) {
            if (err) {
                return next(err);
            }

            data.address = req.params.account;
            data.tracesReceived = tracesReceived;

            console.log(":====== Start tracesReceived ======:");
            console.log(tracesReceived);
            console.log(":>>>>>> End tracesReceived >>>>>>:");
            
            var blocks = {};
            data.tracesSent.forEach(function(trace) {
                if (!blocks[trace.blockNumber]) {
                    blocks[trace.blockNumber] = [];
                }

                blocks[trace.blockNumber].push(trace);
            });
            data.tracesReceived.forEach(function(trace) {
                if (!blocks[trace.blockNumber]) {
                    blocks[trace.blockNumber] = [];
                }

                blocks[trace.blockNumber].push(trace);
            });

            data.tracesSent = null;
            data.tracesReceived = null;

            data.blocks = [];
            var txCounter = 0;
            for (var block in blocks) {
                data.blocks.push(blocks[block]);
                txCounter++;
                /*console.log(":====== Start Block ======:");
                console.log(block);
                console.log(":>>>>>> End Block >>>>>>:");*/
            }

            if (data.source) {
                data.name = data.source.name;
            } else if (config.names[data.address]) {
                data.name = config.names[data.address];
            }

            /*data.blocks = data.blocks.reverse().splice(0, 100);

            data.blocks.forEach(function(item, index){
                item.forEach(function(_itm, ind) {
                    web3.eth.getBlock(_itm.blockNumber, function(err, result) {
                        console.log(":=== result ===:");
                        console.log(result);
                        data.blocks[index][ind].timestamp = result.timestamp;
                    });
                });
                
            }); */

            /*console.log(" : ============== JSON.stringify(data) ==============: >>>>>>>>>>>>>... ");
            console.log(JSON.stringify(data));
            data.str_data = JSON.stringify(data, null, 4);*/

            data.balance = data.balance.toString();

            web3.eth.getBlock(2419164, function(err, result) {
                console.log(":==== err ====:");
                console.log(err);
                console.log(":=== result ===:");
                console.log(result);
            });
            res.render('account', { account: data });
        }
    );

});

module.exports = router;
