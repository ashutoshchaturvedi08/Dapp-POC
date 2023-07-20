import React, { useState } from 'react';
import './button.css';
const { Web3 } = require('web3');
const usdtAb = require('./usdtAbi.js')
const usdcABI = require('./usdcAbi.js')
const abi = require('./preSaleAbi')



const USDTApproval = () => {
  const [status, setStatus] = useState('');
  const [usdtAmount, setUsdtAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const tokenValue = 0.13; // 13 cents

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    setUsdtAmount(amount);
  };

  const calculateTokenAmount = () => {
    return (usdtAmount / tokenValue).toFixed(18);
  };

  const preSaleAddress = '0xd9898976b1133258e476878B24c31F53b1627f01';

  const approve = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts)


        const radio_button = document.getElementById("usdt");

        if (radio_button.checked) {

          const usdtContractAddress = "0x03091df2aA8DcC503dC54600376c817052038fA8";
          const stringUsdtAmount = usdtAmount.toString()
          const finalUSDTAmount = web3.utils.toWei(stringUsdtAmount, 'ether');
          console.log("finalUSDTAmount", finalUSDTAmount)
          const usdtContractInstance = new web3.eth.Contract(usdtAb, usdtContractAddress);
          const result = await usdtContractInstance.methods.approve(preSaleAddress, finalUSDTAmount).send({ from: accounts[0] });
          const allowance = await usdtContractInstance.methods.allowance(accounts[0], preSaleAddress).call();
          setIsApproved(parseInt(allowance) >= parseInt(finalUSDTAmount));
          console.log(result);
          setStatus('Approval successful!');
          setIsApproved(true);
        }
        else {
          const usdcContractAddress = "0xD6112D2cE0A4C3462025Ee46F20A59Af74d69EFa";
          const stringUsdtAmount = usdtAmount.toString()
          const finalUSDCAmount = web3.utils.toWei(stringUsdtAmount, 'ether');
          console.log("finalUSDCAmount", finalUSDCAmount)
          const usdcContractInstance = new web3.eth.Contract(usdcABI, usdcContractAddress);
          const result = await usdcContractInstance.methods.approve(preSaleAddress, finalUSDCAmount).send({ from: accounts[0] });
          const allowance = await usdcContractInstance.methods.allowance(accounts[0], preSaleAddress).call();
          setIsApproved(parseInt(allowance) >= parseInt(finalUSDCAmount));
          console.log(result);
          setStatus('Approval successful!');
          setIsApproved(true);
        }


      } catch (error) {
        console.error(error);
        setStatus('Approval failed!');
      }
    }
    else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
      window.open('https://metamask.io/download.html', '_blank');
    }

  };


  const callPresaleContractFunction = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      const contractAddress = preSaleAddress;
      // const contractABI = abi;
      const contractInstance = new web3.eth.Contract(abi, contractAddress);
      const stringUsdtAmount = usdtAmount.toString()
      const finalUSDTAmount = web3.utils.toWei(stringUsdtAmount, 'ether');
      console.log("finalUSDTAmount", finalUSDTAmount)

      const radio_button = document.getElementById("usdt");

      if (radio_button.checked) {

        const result = await contractInstance.methods.buyWithUSTD(finalUSDTAmount).send({ from: accounts[0] });
        console.log(result);
        setStatus('Buy successfully!');
      }
      else {
        const result = await contractInstance.methods.buyWithUSDC(finalUSDTAmount).send({ from: accounts[0] });
        console.log(result);
        setStatus('Buy successfully!');
      }

    } catch (error) {
      console.error(error);
      setStatus('Failed to Buy Token');
    }
  };


  const handleButtonClick = async () => {
    if (!isApproved) {
      await approve();
    } else {
      callPresaleContractFunction();
    }
  };


  return (
    <div style={{padding :'10px'} }  >

      <p>
        Choose Payment Option 
        <label>
          <input type="radio" name="myRadio" id='usdt' value="option1" defaultChecked  />
          USDT
        </label>
        <label>
          <input type="radio" name="myRadio" id='usdc' value="option2" />
          USDC
        </label>

      </p>

      <div className='input'>

        <label>Enter Amount </label>
        <input type="number" value={usdtAmount} onChange={handleAmountChange} />



        <label>PZAP tokens</label>
        <input type="text" value={calculateTokenAmount()} readOnly />

      </div>
      <div>
        <h5>Please click the button twice. First time to approve and second time to buy.</h5>
        <button className='button' onClick={handleButtonClick}>{isApproved ? 'Buy Now' : 'Approve'}</button>
     
        <p>{status}</p>
      </div>
    </div>
  );
};

export default USDTApproval;
