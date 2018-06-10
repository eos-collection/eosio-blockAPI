//can't use ES6 imports without babel-node

const Eos = require('eosjs') // Eos = require('./src')
const env = require('./env');
const req = require('request-promise');
const fs = require('fs')
const util = require('util')

//set up output file for tests
const outfile = fs.createWriteStream(__dirname + '/api-tests-output.txt', { flags: 'a' })

// redirect stdout / stderr by overloading console.log
console.log = function(d) { //
    outfile.write(util.format(d) + '\n');
    outfile.write(util.format(d) + '\n');
  };

//API server url = env.API_SERVER

//eos config options
const config = {
    chainId: null, // 32 byte (64 char) hex string
    httpEndpoint: env.EOSNODE,
    mockTransactions: () => 'pass', // or 'fail'
        transactionHeaders: (expireInSeconds, callback) => {
        callback(null/*error*/, headers)
    },
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true
}

const eos = Eos.Localnet(config)


// eos = Eos({keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'})

// returns Promise
// setInterval(
//     eos.transaction({
//     actions: [
//       {
//         account: 'eosio.token',
//         name: 'transfer',
//         authorization: [{
//           actor: 'inita',
//           permission: 'active'
//         }],
//         data: {
//           from: 'inita',
//           to: 'initb',
//           quantity: '7 SYS',
//           memo: ''
//         }
//       }
//     ]
//   }), 50)

const lastBlockQuery = 
`lastBlock{
    id
    timestamp
    txn_count
    block_num
  }`;

const multiBlockQuery = 
`blocks(numbers:[1, 5]) {
    id
    timestamp
    txn_count
    block_num
  }`

let options = {
    method: 'POST',
    uri: env.API_SERVER,
    body: {
        query: "{ " + lastBlockQuery + " }"
    },
    json: true // Automatically stringifies the body to JSON
};

req(options)
    .then(function (parsedBody) {
        // POST succeeded...
        console.log(parsedBody)
    })
    .catch(function (err) {
        // POST failed...
        console.log(err)
    });