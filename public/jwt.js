import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, CheckCircle, AlertTriangle, Key, Shield, ExternalLink, Eye, EyeOff } from 'lucide-react';

const JWTSecretGenerator = () => {
  const [jwtSecret, setJwtSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [secretStrength, setSecretStrength] = useState('');

  // Generate a cryptographically secure JWT secret
  const generateSecret = () => {
    // Use crypto.getRandomValues for cryptographically secure random bytes
    const array = new Uint8Array(64); // 64 bytes = 512 bits
    crypto.getRandomValues(array);
    
    // Convert to base64 for easier handling
    const secret = btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    setJwtSecret(secret);
    evaluateStrength(secret);
  };

  // Evaluate secret strength
  const evaluateStrength = (secret) => {
    if (secret.length < 32) {
      setSecretStrength('weak');
    } else if (secret.length < 64) {
      setSecretStrength('medium');
    } else {
      setSecretStrength('strong');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text, label = '') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(`${label} copied!`);
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  // Generate initial secret on component mount
  useEffect(() => {
    generateSecret();
  }, []);

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'strong': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
          <Key className="h-8 w-8 text-blue-600" />
          <span>JWT Secret Generator</span>
        </h1>
        <p className="text-gray-600">
          Generate and configure a secure JWT secret for your Cloudflare Workers authentication
        </p>
      </div>

      {/* Secret Generator */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Your JWT Secret</span>
          </h2>
          <button
            onClick={generateSecret}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Generate New</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">JWT Secret</label>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded border ${getStrengthColor(secretStrength)}`}>
                  {secretStrength.toUpperCase()} ({jwtSecret.length} chars)
                </span>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono break-all">
                {showSecret ? jwtSecret : '•'.repeat(Math.min(jwtSecret.length, 50))}
              </code>
              <button
                onClick={() => copyToClipboard(jwtSecret, 'JWT Secret')}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center space-x-1"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {copyStatus && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{copyStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cloudflare Workers Setup */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <ExternalLink className="h-5 w-5 text-orange-600" />
            <span>Cloudflare Workers Setup</span>
          </h3>
          
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded p-3">
              <h4 className="font-medium text-orange-800 mb-2">Step 1: Dashboard Method</h4>
              <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://dash.cloudflare.com" className="underline" target="_blank" rel="noopener noreferrer">Cloudflare Dashboard</a></li>
                <li>Navigate to Workers & Pages</li>
                <li>Click on your worker: <code>nonprofit-management-api</code></li>
                <li>Go to Settings → Variables</li>
                <li>Click "Add variable"</li>
                <li>Name: <code>JWT_SECRET</code></li>
                <li>Value: <em>(paste your generated secret)</em></li>
                <li>Check "Encrypt" for security</li>
                <li>Click "Save and deploy"</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="font-medium text-blue-800 mb-2">Step 2: Wrangler CLI Method</h4>
              <div className="space-y-2">
                <button
                  onClick={() => copyToClipboard(`wrangler secret put JWT_SECRET`, 'Wrangler command')}
                  className="w-full bg-gray-900 text-green-400 p-2 rounded text-sm font-mono text-left hover:bg-gray-800 flex items-center justify-between"
                >
                  <span>wrangler secret put JWT_SECRET</span>
                  <Copy className="h-3 w-3" />
                </button>
                <p className="text-xs text-blue-600">Run this command, then paste your secret when prompted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Workers Code Implementation */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Workers Code Update</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <h4 className="font-medium text-green-800 mb-2">JWT Implementation</h4>
              <button
                onClick={() => copyToClipboard(`// In your Workers code
import { SignJWT, jwtVerify } from 'jose';

export default {
  async fetch(request, env, ctx) {
    // Access your JWT secret
    const jwtSecret = env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    // Convert string to Uint8Array for jose library
    const secret = new TextEncoder().encode(jwtSecret);
    
    // Sign a JWT
    const jwt = await new SignJWT({ userId: 123, email: 'user@example.com' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
    
    // Verify a JWT
    try {
      const { payload } = await jwtVerify(jwt, secret);
      console.log('Valid token:', payload);
    } catch (error) {
      console.error('Invalid token:', error);
    }
    
    return new Response('OK');
  }
};`, 'JWT Workers code')}
                className="w-full bg-gray-900 text-green-400 p-3 rounded text-xs font-mono text-left hover:bg-gray-800 relative overflow-auto max-h-32"
              >
                <Copy className="absolute top-2 right-2 h-3 w-3" />
                <pre className="whitespace-pre-wrap">{`// In your Workers code
import { SignJWT, jwtVerify } from 'jose';

export default {
  async fetch(request, env, ctx) {
    // Access your JWT secret
    const jwtSecret = env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }
    
    // Convert string to Uint8Array
    const secret = new TextEncoder().encode(jwtSecret);
    
    // Sign a JWT
    const jwt = await new SignJWT({ 
      userId: 123, 
      email: 'user@example.com' 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
    
    return new Response('OK');
  }
};`}</pre>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>Security Best Practices</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <h4 className="font-medium mb-2">✅ Do:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use the generated 64+ character secret</li>
              <li>Store as encrypted environment variable</li>
              <li>Set reasonable token expiration (1-24h)</li>
              <li>Use HTTPS only in production</li>
              <li>Rotate secrets periodically</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">❌ Don't:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Store secrets in code or git</li>
              <li>Use weak/short secrets</li>
              <li>Set very long expiration times</li>
              <li>Share secrets between environments</li>
              <li>Log JWT secrets in console</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Test */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🧪 Quick Test Commands</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 w-32">Test deployment:</span>
            <button
              onClick={() => copyToClipboard('wrangler deploy && curl https://nonprofit-management-api.traveldata.workers.dev/api/health', 'Test command')}
              className="flex-1 bg-gray-900 text-green-400 p-2 rounded text-sm font-mono text-left hover:bg-gray-800 flex justify-between items-center"
            >
              <span>wrangler deploy && curl https://nonprofit-management-api.traveldata.workers.dev/api/health</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 w-32">Check variables:</span>
            <button
              onClick={() => copyToClipboard('wrangler secret list', 'List command')}
              className="flex-1 bg-gray-900 text-green-400 p-2 rounded text-sm font-mono text-left hover:bg-gray-800 flex justify-between items-center"
            >
              <span>wrangler secret list</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 w-32">View logs:</span>
            <button
              onClick={() => copyToClipboard('wrangler tail nonprofit-management-api', 'Logs command')}
              className="flex-1 bg-gray-900 text-green-400 p-2 rounded text-sm font-mono text-left hover:bg-gray-800 flex justify-between items-center"
            >
              <span>wrangler tail nonprofit-management-api</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTSecretGenerator;