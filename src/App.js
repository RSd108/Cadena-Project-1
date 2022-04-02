import './App.css';
import abi from "./contracts/MemberVotes.json"
import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";

function App() {
  const [isProposalOwner, setIsProposalOwner] = useState(false);
  const [currentProposalName, setCurrentProposalName] = useState(null);
  const [totalVotes, setTotalVotes] = useState(null);
  //const [ownerAddress, setOwnerAddress] = useState(null);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState({ proposalName: "", newMember: "" });

  const contractAddress = '0x3AAde74602a9Dc85442AC26A06BE144042931eFC';
  const contractABI = abi.abi;

  const getVoteCount = async () => {
    try {
      window.ethereum.enable(); 
      if (window.ethereum) {
 
        //read data 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        let cnt = await contract.totalvotes();
        setTotalVotes(parseInt(cnt));
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getProposalName = async () => {
    try {
      window.ethereum.enable(); 
      if (window.ethereum) {
 
        //read data 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        let name = await contract.proposalName();
        setCurrentProposalName(utils.parseBytes32String(name));
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setProposalNameHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await contract.setProposalName(utils.formatBytes32String(inputValue.proposalName));
        console.log("Setting Proposal Name...");
        await txn.wait();
        console.log("Proposal Name Changed", txn.hash);
        getProposalName();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addMemberHandler = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await contract.addMember(inputValue.newMember);
        console.log("Adding member");
        await txn.wait();
        console.log("Added Member ", txn.hash);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const voteHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        //write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await contract.vote();
        console.log("voting...");
        await txn.wait();
        console.log("voting done", txn.hash);
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await contract.owner();
       // setOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (owner.toLowerCase() === account.toLowerCase()) {
          setIsProposalOwner(true);
        }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }


  useEffect(() => {
   // checkIfWalletIsConnected();
    getProposalName();
    getOwnerHandler();
    getVoteCount();
  } //[isWalletConnected]
  )

  return (
    <main className="App">

      {currentProposalName === "" && isProposalOwner ?
            <p>"Setup the name of your proposal." </p> :
            <h2 className="App-header"><span className="headline-gradient">Vote for {currentProposalName}</span></h2>
      }
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-5">
        </div>
        <div>
        <p className="text-3xl font-bold">{totalVotes} votes so far</p>
        </div>
        
        <div className="mt-7 mb-9">
          <form className="form-style">
            <button
              className="btn-purple"
              onClick={voteHandler}>Place your vote</button>
          </form>
        </div>
      </section>
      
      {isProposalOwner ?
      <section className="proposal-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Proposal Admin Panel</h2>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="proposalName"
                  placeholder="Enter a Name for Your Proposal"
                  value={inputValue.proposalName}
                />
                <button
                  className="btn-grey"
                  onClick={setProposalNameHandler}>
                  Set Proposal Name
                </button>
              </form>
            </div>
            <div className="p-10">
              <form className="form-style">
                <input
                  type="text"
                  className="input-style"
                  onChange={handleInputChange}
                  name="newMember"
                  placeholder="Enter a member's address"
                  value={inputValue.newMember}
                />
                <button
                  className="btn-grey"
                  onClick={addMemberHandler}>
                  Add member
                </button>
              </form>
            </div>
          </section>
      : <div></div>}
    </main>
  );
}

export default App;
