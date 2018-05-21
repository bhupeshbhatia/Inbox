const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //upperCase because Web3 = constructor function
// const web3 = new Web3(ganache.provider()); //web3 = instance of Web3 -
//ganache.provider() --> local test network. When connecting to Rinkeby or main network - this will change
const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

// class Car {
//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }

// let car;
// beforeEach(() => {
//     car = new Car();
// });

// describe('Car could be anything', () =>{
//     it('park should return a string', () => {
//         // const car = new Car(); //Using beforeEach to create new instance of car
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () =>{
//         // const car = new Car(); //Using beforeEach to create new instance of car
//         assert.equal(car.drive(), 'vroom');
//     });
// });

// beforeEach(() => {
//     //Every function called with web3 is asynchronous in nature - always returns a promise

//     //Get a list of all accounts
//     web3.eth.getAccounts() //accessing eth module of web3 library - always returns a promise - that's why using .then()
//         .then(fetchedAccounts => {
//             console.log(fetchedAccounts);
//         });

//     //Use one of those account to deploy the contract
// });

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there';
//Improving beforeEach using async/Await
beforeEach(async () => {
    //List of all accounts
    accounts = await web3.eth.getAccounts();

    //Use one fo those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [INITIAL_STRING]
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
    inbox.setProvider(provider);
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        // console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call(); //methods - property that contains methods - message because of global variable
        assert.equal(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});