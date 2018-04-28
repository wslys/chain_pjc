    https://github.com/gobitfly/erc20-explorer

    https://github.com/poanetwork/chain-explorer

    https://github.com/Musicoin/explorer


parity --chain musicoin --tracing=on --fat-db=on --pruning=archive

parity --chain mainnet --tracing=on --fat-db=on --pruning=archive

chain-explorer:
parity --chain=<yourchain> --tracing=on --fat-db=on --pruning=archive

explorer:
parity --chain musicoin --tracing=on --fat-db=on --pruning=archive

erc20-explorer:
parity --warp



0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0
0x89dbd56e0ac511518416fdcf5ccb452c2e89e0d4


https://github.com/poanetwork/chain-explorer

https://github.com/Musicoin/explorer

https://github.com/gobitfly/erc20-explorer


leveldb 读取 parity


返回指定区块的交易数量:
web3.eth.getBlockTransactionCount

{ 
  blockHash: '0x0921f302d3f2c3786046ce04a494dae716ccd345b5ed2f6e9dcd7e0ea72f1b2e',
  blockNumber: 1667165,
  chainId: null,
  condition: null,
  creates: null,
  from: '0x036bb21999f0774abdf5e76dedc523097318ad07',
  gas: 121000,
  gasPrice: BigNumber { s: 1, e: 10, c: [ 20000000000 ] },
  hash: '0x609c4b0fdbaefb7c099f78eaf3737e1c1d37e28b8d5dd7ba0fbd9a1705b9e9fa',
  input: '0x',
  nonce: 979,
  publicKey: '0x66eff5cba070ac4bcf4c81dbd8a51c6002b854d41dc67915b8ce3f7ff80b9e341a6d082b75c2a0a7fcb404a70cf3a0622e35328e1aa85d0ae3610af1cf94d4d2',
  r: '0x98e3f8b644031172ceebc1004a229ecf003382bb5e5df1193efd6640cc67aeb1',
  raw: '0xf8708203d38504a817c8008301d8a894ea62a60b127efd524b6e19791bcb374a49302c71890197d3d87bdba1a800801ba098e3f8b644031172ceebc1004a229ecf003382bb5e5df1193efd6640cc67aeb1a0273bae351d8156765b3a7ee92d15c5869087dc57cfbdc5be3b7627a60fbb9191',
  s: '0x273bae351d8156765b3a7ee92d15c5869087dc57cfbdc5be3b7627a60fbb9191',
  standardV: '0x0',
  to: '0xea62a60b127efd524b6e19791bcb374a49302c71',
  transactionIndex: 0,
  v: '0x1b',
  value: BigNumber { s: 1, e: 19, c: [ 293870, 70020000000000 ]} 
}


[sudo] user 的密码： 
2018-04-26 16:17:52  Starting Parity/v1.9.6-stable-df92977-20180416/x86_64-linux-gnu/rustc1.25.0
2018-04-26 16:17:52  Keys path /home/user/.local/share/io.parity.ethereum/keys/Ethereum Classic
2018-04-26 16:17:52  DB path /home/user/.local/share/io.parity.ethereum/chains/classic/db/906a34e69aec8c0d
2018-04-26 16:17:52  Path to dapps /home/user/.local/share/io.parity.ethereum/dapps
2018-04-26 16:17:52  State DB configuration: archive +Fat +Trace
2018-04-26 16:17:52  Operating mode: active
2018-04-26 16:17:52  Warning: Warp Sync is disabled because Fat DB is turned on.
2018-04-26 16:17:52  Configured for Ethereum Classic using Ethash engine


2018-04-26 16:17:58  Public node URL: enode://87d0c1b57d07a02f4b2ab0104c8d66e155a924ae9131ca90eaf30a862ab2fa91f4bb010e906bdb80f2efd1efd83d0a0b8b8072bd7795383fa232e005a5008683@192.168.1.87:30303



