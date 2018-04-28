var express = require('express');
var router = express.Router();

var async = require('async');
var Web3 = require('web3');

router.get('/:offset?', function(req, res, next) {
    var config = req.app.get('config');
    var web3 = new Web3();
    web3.setProvider(config.provider);

    async.waterfall([
            function(callback) {
                web3.parity.listAccounts(25, req.params.offset, function(err, result) {
                    callback(err, result);
                });
            },
            function(accounts, callback) {

                var data = {};

                if (!accounts) {
                    return callback({name:"FatDBDisabled", message: "Parity FatDB system is not enabled. Please restart Parity with the --fat-db=on parameter."});
                }

                if (accounts.length === 0) {
                    return callback({name:"NoAccountsFound", message: "Chain contains no accounts."});
                }

                var lastAccount = accounts[accounts.length - 1];

                async.eachSeries(accounts, function(account, eachCallback) {
                    web3.eth.getCode(account, function(err, code) {
                        if (err) {
                            return eachCallback(err);
                        }
                        data[account] = {};
                        data[account].address = account;
                        data[account].type = code.length > 2 ? "Contract" : "Account";

                        web3.eth.getBalance(account, function(err, balance) {
                            if (err) {
                                return eachCallback(err);
                            }
                            data[account].balance = balance;
                            eachCallback();
                        });
                    });
                    web3.eth.getGasPrice(function(error, result){
                        if (error) {
                            return eachCallback(error);
                        }
                        data[account].price = result.toString(10);
                    });
                    web3.eth.getBlockNumber(function(error, result){
                        if (error) {
                            return eachCallback(error);
                        }
                        data[account].blockNumber = result;
                    });
                    web3.eth.getBalance(account, function (error, result) {
                        data[account].balance_str = result.toString();
                    });

                    web3.eth.getBlockNumber(function(error, result){

                        web3.eth.getBlockTransactionCount(result, function (error, res) {
                            /*console.log("||| result ||| >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            console.log(result);*/
                        });
                    });
                    web3.eth.getBlockTransactionCount(account, function (err, result) {
                        /*console.log("||| getBlockTransactionCount ||| >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        console.log(result);*/
                    });

                    /* 返回指定地址发起的交易数量 */
                    web3.eth.getTransactionCount(account, function (err, result) {
                        data[account].transactionCount = result.toString();
                    });

                    web3.net.getPeerCount(function(error, result){
                        console.log("||| getPeerCount ||| >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
                        console.log(result);
                    });
                }, function(err) {
                    console.log(data);
                    callback(err, data, lastAccount);
                });
            }
        ],
        function(err, accounts, lastAccount) {
            if (err) {
                return next(err);
            }

            res.render("accounts", { accounts: accounts, lastAccount: lastAccount });
        });
});

module.exports = router;
