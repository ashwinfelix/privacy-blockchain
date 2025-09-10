require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
const paillierBigint = require('paillier-bigint');
const bigintConversion = require('bigint-conversion');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": false, "internalType": "bytes", "name": "ciphertext", "type": "bytes" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "NewRecord",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "getRecord",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "bytes", "name": "", "type": "bytes" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "records",
    "outputs": [
      { "internalType": "address", "name": "sender", "type": "address" },
      { "internalType": "bytes", "name": "ciphertext", "type": "bytes" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes", "name": "ciphertext", "type": "bytes" }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRecords",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// helper to fix odd-length hex
function fixHex(hex) {
  if (!hex) return hex;
  if (hex.startsWith('0x') && (hex.length - 2) % 2 !== 0) {
    return '0x0' + hex.slice(2);
  }
  return hex;
}

app.get('/api/blocks', async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const latest = await provider.getBlockNumber();
    const blocks = [];

    for (let i = latest; i > latest - count && i >= 0; i--) {
      const b = await provider.getBlockWithTransactions(i);
      blocks.push({
        number: b.number,
        timestamp: b.timestamp,
        hash: fixHex(b.hash),
        txs: b.transactions.map(t => ({
          hash: fixHex(t.hash),
          from: fixHex(t.from),
          to: fixHex(t.to),
          data: fixHex(t.data)
        }))
      });
    }

    res.json({ ok: true, blocks });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/api/send-ciphertext', async (req, res) => {
  try {
    const { ciphertextHex } = req.body;
    if (!ciphertextHex) return res.status(400).json({ ok: false, error: 'ciphertextHex missing' });

    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const hex = ciphertextHex.startsWith('0x') ? ciphertextHex : '0x' + ciphertextHex;
    const tx = await contract.store(ethers.utils.arrayify(fixHex(hex)), { gasLimit: 3000000 });
    const receipt = await tx.wait();
    res.json({ ok: true, txHash: receipt.transactionHash, blockNumber: receipt.blockNumber });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on ${port}`));
