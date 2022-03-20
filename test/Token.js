const Token = artifacts.require('Token');

let instance;

//create contract instance before each test 
beforeEach(async function (){
    instance = await Token.deployed()
});

contract('Token Contract', async function(accounts){
    //set up accounts
    const deployer = accounts[0];
    const user = accounts[1];

    //test token supply
    it('deploy', async function(){ 
        const balance = await instance.balanceOf(deployer);
        balance = Number(balance);
        assert.equal(balance, 100000000000000000000n);
    });
});