const App = {
    web3Provider: null,
    contracts: {},
    asyncProcess: null,
    currentAccount: null,

    initWeb3: async function(){
        App.asyncProcess = true;
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
            // Request account access
            await ethereum.request({method: 'eth_requestAccounts'});
            } catch (error) {
            // User denied account access...
            console.error("User denied account access");
            $('#landing').removeClass('hide');
            alert('Please connect MetaMask to use HBO Wallet');
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
        // Get user accounts and display data to UI
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
                $('.tkn-balance').html(Number(balance).toString());
                $('.user-address').html(`Connected to ${App.currentAccount}`);
                App.asyncProcess = false;
            }
        } catch (error) {
            console.error(error);
        }
    },

    asyncProcessUi: function() {
        const hidden = $('#landing').hasClass('hide');
        if (App.asyncProcess && !hidden) {
            $('#landing').addClass('hide');
            $('#loading').removeClass('hide');
        } else if(App.asyncProcess && hidden) {
            $('#loading').removeClass('hide');
            $('#page').removeClass('hide');
        }
        else if (!App.asyncProcess){
            $('#page').removeClass('hide');
            $('#loading').css('display', 'none');
        }
    },

    transferTkns: async function() {
        App.asyncProcess = true;

    }
}

$(window).on('load', async function(){
    // init web3 on page reload
    App.asyncProcessUi();
    await App.initWeb3();
    App.asyncProcessUi();

    //Initialize web3 on button click
    $('#connect-web3').click( async function (event) {
        event.preventDefault();
        App.asyncProcessUi();
        await App.initWeb3();
        App.asyncProcessUi();
    });
});