import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";

import myNFT from './utils/MyNFT.json';
import Notification from './components/Notification.jsx';
// Constants
const TWITTER_HANDLE = 'juansevillano';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const CONTRACT_ADDRESS = "0xd6aA449D3889edB8b4729c05bc3B7e59545B6972";

const App = () => {

  const [currentAccount, setCurrentAccount] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [txn, setTxn] = useState('');
  const [token, setToken] = useState(0);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask installed');
      return
    } else {
      console.log('We have ether obj', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    // if there's a user account conencted
    if (accounts.length !== 0) {
      const account = accounts[0];
      setupEventListeners();
      setCurrentAccount(account);
      console.log('User auth account', account);
    } else {
      console.log('Not auth found yet');
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Falta metamask');
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log('Connected', accounts[0]);

      setCurrentAccount(accounts[0]);
      setupEventListeners();

    } catch (error) {
      console.log(error);
    }
  }

  const setupEventListeners = async () => {
    try {

      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFT.abi, signer);

        connectedContract.on("NewNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());

          setShow(true);
          setToken(tokenId.toNumber());

        });

      } else {
        console.log('Not ethereum obj found.');
      }

    } catch (error) {
      console.log(error)
    }
  }


  const askContractToMintNFT = async () => {



    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myNFT.abi, signer);

        console.log('Going to pop wallet now to pay and pass');
        let nftTxn = await connectedContract.makeAnNFT();
        await nftTxn.wait();

        setShow(true);
        setTxn(nftTxn.hash);
        console.log(`Minted, see trxn https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log('Not ethereum obj found');
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <Notification
          isActive={show}
          message={error ? "an error has occured" : `Minted properly, click to see on Opensea <= `}
          uri={`https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${token}`}
          onClose={() => setShow(false)}
        />
        <div className="header-container">
          <p className="header gradient-text">Sevi NFT ERC721</p>
          <p className="sub-text">
            Random svg image generated on-chain, test develop by juansevillano
            for IoBuilders
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : (
              /** Add askContractToMintNft Action for the onClick event **/
              <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
                Mint NFT
      </button>
            )
          }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;