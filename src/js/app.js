const App = {
    web3Provider: null,
    contracts: {},
    asyncProcess: false,
    currentAccount: null,

    initWeb3: async function(){
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
            // Request account access
            await ethereum.request({method: 'eth_requestAccounts'});
            } catch (error) {
            // User denied account access...
            console.error("User denied account access")
            alert('Please connect MetaMask to use HBO Wallet')
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

    initContract: function(){
        $.getJSON('Token.json', function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            const artifact = data;
            App.contracts.Token = TruffleContract(artifact);
          
            // Set the provider for contract
            App.contracts.Token.setProvider(App.web3Provider);

            // Use contract to retrieve blockchain data
            return App.loadData();
        });
    },
    
    loadData: async function(){
        // Get user accounts
        try{
            const accts = await ethereum.request({method: 'eth_accounts'});

            if (accts.length === 0) {
                // MetaMask is locked or the user has not connected any accounts
                console.log('Please connect to MetaMask.');
            } else if (accts[0] !== App.currentAccount) {
                App.currentAccount = accts[0];
                //load blockchain data
                const instance = await App.contracts.Token.deployed();
                const balance = await instance.balanceOf(App.currentAccount);
                //display balance
                $('#tkn-balance').html(Number(balance));
            }
        } catch (error) {
            console.error(error);
        }
    }

}


$(document).ready(function() {
    //Initialize web3 on button click
    $('#connect-web3').click( function (event) {
        event.preventDefault();
        // App.initWeb3();
    });
});