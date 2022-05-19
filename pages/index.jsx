import abi from '../utils/researchplus.json';
import { ethers } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'


export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x31356c9DA942A9820E8199D4C61e3e281e8aCF23";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [discordid, setDiscordID] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
  }

  const onDiscordIDChange = (event) => {
    setDiscordID(event.target.value);
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const SubmitForm = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const researchplus = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("Submitting Form..")
        const FormTxn = await researchplus.SubmitForm(
          name ? name : "Talha",
          discordid ? discordid : "taserx#3488!",
        );

        await FormTxn.wait();

        console.log("mined ", FormTxn.hash);

        console.log("Form Submitted!");

        // Clear the form fields.
        setName("");
        setDiscordID("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getSubmissions = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const researchplus = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        console.log("fetching submissions from the blockchain..");
        const submissions = await researchplus.getSubmissions();
        console.log("fetched!");
        setSubmissions(submissions);
      } else {
        console.log("Metamask is not connected");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    let researchplus;
    isWalletConnected();
    getSubmissions();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewSubmission = (from, timestamp, name, discordid) => {
      console.log("Submission received: ", from, timestamp, name, discordid);
      setSubmissions((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          discordid,
          name
        }
      ]);
    };

    const {ethereum} = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      researchplus = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      researchplus.on("NewSubmission", onNewSubmission);
    }

    return () => {
      if (researchplus) {
        researchplus.off("NewSubmission", onNewSubmission);
      }
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Welcome to Research Plus!</title>
        <meta name="description" content="ResearchPlus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Research Plus!
        </h1>
        
        {currentAccount ? (
          <div>
            <form>
              <div>
                <label>
                  Name
                </label>
                <br/>
                
                <input
                  id="name"
                  type="text"
                  placeholder="Enter Your Name"
                  onChange={onNameChange}
                  />
              </div>
              <br/>
              <div>
                <label>
                  Discord ID
                </label>
                <br/>

                <textarea
                  rows={3}
                  placeholder="Enter Your Discord ID!"
                  id="message"
                  onChange={onDiscordIDChange}
                  required
                >
                </textarea>
              </div>
              <div>
                <button
                  type="button"
                  onClick={SubmitForm}
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}> Connect your wallet </button>
        )}
      </main>

      {currentAccount && (<h1>Form Submissions</h1>)}

      {currentAccount && (submissions.map((submission, idx) => {
        return (
          <div key={idx} style={{border:"2px solid", "borderRadius":"5px", padding: "5px", margin: "5px"}}>
            <p style={{"fontWeight":"bold"}}>"{submission.discordid}"</p>
            <p>From: {submission.name} at {submission.timestamp.toString()}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href="https://alchemy.com/?a=roadtoweb3weektwo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by @taserx for Xord's Blockchain Bootcamp
        </a>
      </footer>
    </div>
  )
}
