<template>
  <div>
    <h1>This is the index page</h1>
    <div>
      <h2>Current Count: {{ count }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const count = useState('count', () => 0)

const addCount = (num: number) => {
  count.value += num
  return count.value
}

// only run on the client side since the transport requires a browser environment
// which is not available on the server side (ssr)
if (import.meta.client) {
  const { server, isCountToolsRegistered } = await useMcpServer();
  if (!isCountToolsRegistered.value) {
    console.log('Registering count tools...');
    server.tool('addCount', 'Adds a number to the count', {
      num: z.number()
    }, async ({ num }) => {
      addCount(num)
      return {
        content: [{ type: 'text', text: `Added ${num} to the count! New count: ${count.value}` }]
      }
    });

    server.tool('subtractCount', 'Subtracts a number from the count', {
      num: z.number()
    }, async ({ num }) => {
      addCount(-num)
      return {
        content: [{ type: 'text', text: `Subtracted ${num} from the count! New count: ${count.value}` }]
      }
    });

    server.tool('getCount', 'Gets the current count', {}, async () => ({
      content: [{ type: 'text', text: `The current count is ${count.value}` }]
    }));
    isCountToolsRegistered.value = true;
  } else {
    console.log('Count tools already registered, skipping...');
  }
}

</script>