Blockchain + Paillier Demo (MERN + Hardhat)

A demo project showcasing blockchain transactions, homomorphic encryption (Paillier), and a React-based visualizer. Built with a MERN stack + Hardhat local blockchain.

Features

📦 MERN stack: Express backend, React frontend

⛓ Blockchain integration: Smart contract deployed on Hardhat local blockchain

🔐 Paillier homomorphic encryption: Encrypts data before storing on-chain

🖼 Blockchain visualizer: Displays recent blocks and transactions like a chain

Setup Instructions

1. Clone and install
git clone https://github.com/<your-username>/mern-bkt.git
cd mern-bkt
cd blockchain && npm install
cd ../server && npm install
cd ../frontend && npm install


2. Start Hardhat local blockchain
cd blockchain
npx hardhat node
This launches a local blockchain at http://127.0.0.1:8545 with test accounts.

3. Deploy contract to Hardhat
Open a second terminal:
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
Copy the deployed contract address into your .env file.

4. Backend setup
In the root folder:
cd server
npm run server
Runs Express API on http://localhost:4000

5. Frontend setup
cd frontend
npm run dev
Runs React app on http://localhost:5173.

