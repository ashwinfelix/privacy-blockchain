import React, { useState } from 'react';
import * as paillierBigint from 'paillier-bigint';
import * as bigintConversion from 'bigint-conversion';
import BlockVisualizer from './BlockVisualizer.jsx';

function App() {
  const [keys, setKeys] = useState(null);
  const [status, setStatus] = useState('');

  async function genKeys() {
    setStatus('Generating keys...');
    const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(2048);
    setKeys({ publicKey, privateKey });
    setStatus('Keys generated.');
  }

  async function encryptAndSend(text) {
    if (!keys) return alert('Generate keys first');
    const m = bigintConversion.textToBigint(text);
    const c = keys.publicKey.encrypt(m);
    const hex = bigintConversion.bigintToHex(c);
    const res = await fetch('http://localhost:4000/api/send-ciphertext', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciphertextHex: hex })
    });
    const j = await res.json();
    setStatus(JSON.stringify(j));
  }

  async function homomorphicDemo() {
    if (!keys) return alert('Generate keys first');
    const a = 42n, b = 7n;
    const ca = keys.publicKey.encrypt(a);
    const cb = keys.publicKey.encrypt(b);
    const sumCipher = keys.publicKey.addition(ca, cb);
    const sumPlain = keys.privateKey.decrypt(sumCipher);
    alert(`homomorphic add: ${a} + ${b} = ${sumPlain}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>MERN + HE Demo</h1>
      <button onClick={genKeys}>Generate Paillier keypair</button>
      <button onClick={() => encryptAndSend('hello from alice')}>Encrypt & Send</button>
      <button onClick={homomorphicDemo}>Homomorphic add demo</button>
      <div>Status: {status}</div>
      <hr/>
      <BlockVisualizer />
    </div>
  );
}

export default App;
