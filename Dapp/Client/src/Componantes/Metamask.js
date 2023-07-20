import { useEffect, useState } from "react";
import './button.css';



function Metamask() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isTokenImported , setIsTokenImported] = useState(false);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        /* MetaMask is installed */
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");

        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
      window.open('https://metamask.io/download.html', '_blank');
    }
  };


  const importToken = async () => {
    try {
      const tokenAddress = '0x3bF1F53f1c756Dc0AFa7C9336f43F49ec438C208'; // Replace with the actual token address
  
      // Add your logic for importing or adding the token here
      const addedToken = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: 'PZAP',
            decimals: 18,
            // image: 'https://.ae/assets/images/logo.png',
          },
        },
      });
  
      if (addedToken) {
        console.log('Token imported successfully!');
        setIsTokenImported(true);
      } else {
        isTokenImported(false)
        console.log('Token import canceled.');
      }
    } catch (error) {
      console.log('Token import error:', error);
    }
  };
  
  return (
    <div style={{padding :'10px' } }>
      <nav className="navbar">
        <div className="container">
          <div  id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                        0,
                        6
                      )}...${walletAddress.substring(38)}`
                    : "Connect Wallet For Join"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section>

      <button className="button" onClick={importToken}>
                    ADD TOKENS
                  </button>

      </section>

      
    </div>
  );
}

export default Metamask;