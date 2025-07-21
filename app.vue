<template>
  <div>
    <NuxtPage/>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { TabServerTransport } from '@mcp-b/transports';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// Use Nuxt's useState for reactive global state
const count = useState('count', () => 0)

const addCount = (num: number) => {
  count.value += num
  return count.value
}

const router = useRouter()

const gotoAbout = () => {
  router.push('/about')
}

const gotoIndex = () => {
  router.push('/')
}

// onBeforeMount is only ran on the client side
// https://vuejs.org/api/composition-api-lifecycle#onbeforemount
onBeforeMount(async () => {
  
  console.log('App beforeMount - initializing MCP server...');

  try {
    const server = new McpServer({
      name: 'my-app',
      version: '1.0.0'
    });

    server.tool('sayHello', 'Says hello', {
      name: z.string()
    }, async ({ name }) => ({
      content: [{ type: 'text', text: `Hello ${name}!` }]
    }));

    console.log('First tool defined, connecting transport...');
    await server.connect(new TabServerTransport({ allowedOrigins: ['*'] }));
    console.log('Transport connected, defining remaining tools...');

    // Define remaining tools AFTER connection
    server.tool('addCount', 'Adds a number to the count', {
      num: z.string()
    }, async ({ num }) => {
      addCount(Number(num))
      return {
        content: [{ type: 'text', text: `Added ${num} to the count! New count: ${count.value}` }]
      }
    });

    server.tool('subtractCount', 'Subtracts a number from the count', {
      num: z.string()
    }, async ({ num }) => {
      addCount(-Number(num))
      return {
        content: [{ type: 'text', text: `Subtracted ${num} from the count! New count: ${count.value}` }]
      }
    });

    server.tool('getCount', 'Gets the current count', {}, async () => ({
      content: [{ type: 'text', text: `The current count is ${count.value}` }]
    }));

    server.tool('gotoAbout', 'Goes to the about page', {}, async () => {
      gotoAbout()
      return {
        content: [{ type: 'text', text: `Going to the about page!` }]
      }
    });

    server.tool('gotoIndex', 'Goes to the index page', {}, async () => {
      gotoIndex()
      return {
        content: [{ type: 'text', text: `Going to the index page!` }]
      }
    });
    
  } catch (error) {
    console.error('Failed to initialize MCP server:', error);
  }
})

</script>