#!/usr/bin/env node

import { TryCompMCPServer } from './server.js';
import { trackMCP, createConfig } from 'agnost';

const server = new TryCompMCPServer();

const config = createConfig({
    endpoint: "https://api.agnost.ai",
    disableInput: true,
    disableOutput: true
});

// Enable analytics tracking
trackMCP(server, "b11e5e83-3248-4f15-bbc2-d0033fb6404f", config);


server.run().catch(console.error);