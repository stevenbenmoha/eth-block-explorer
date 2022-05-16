import './App.css';
import React, { Component } from 'react';
import {
  Card,
  CardContent
} from '@mui/material';

const ethers = require('ethers');

let blockNumber: any[] = [];
let blockDifficulty = 0;
let transactions: any[] = [];
let loaded = false;

class App extends Component {

  interval;

  render() {
    if (loaded) {
      return <div className="App">
        <div className="App-header">
          <Card className="rounded-border" elevation={20}>
            <CardContent className="unified-style card-header">
              <h2>Block Number: </h2>
              {blockNumber}
              <h2>Block Difficulty: </h2>
              {blockDifficulty}
              <h2>Transaction Hashes: </h2>
              <p>
                  {transactions.map(function (data, idx) {
                    return (<li className="tiny-item" key={idx}><a target="_blank" rel="noreferrer" href={'https://rinkeby.etherscan.io/tx/' + data }>{data}</a></li>)
                  })}
                </p>
            </CardContent>
          </Card>
        </div>
      </div>
    }
  }

  async componentDidMount() {
     this.interval = setInterval(() => this.makeCalls(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    }

  async makeCalls() {
    await this.getBlockNumber();
    loaded = true;
    this.setState({
      blockDifficulty: blockDifficulty,
      blockNumber: blockNumber,
      transactions: transactions
    });
  }

  async getBlockNumber() {
    // Alchemy/Infura HTTP endpoint URL
    const url = process.env.REACT_APP_RINKEBY_ALCHEMY_URL;

    // hook up ethers provider
    const provider = new ethers.providers.JsonRpcProvider(url);

    blockNumber = await provider.getBlockNumber();
    await provider.getBlock().then((block: { difficulty: number; transactions: any[]; }) => {
      console.log(block);
      blockDifficulty = block.difficulty;
      transactions = block.transactions;
    })
  }

}

export default App;
