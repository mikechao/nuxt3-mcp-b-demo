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

// Use the same global state defined in app.vue
const count = useState('count', () => 0)

const addCount = (num: number) => {
  count.value += num
  return count.value
}

onBeforeMount( async () => {
  try {
    console.log('Index page beforeMount');
    const { server, isCountToolsRegistered } = await useMcpServer();

    if (isCountToolsRegistered.value) {
      console.log('Count tools already registered, skipping...');
      return;
    }
    console.log('Index page beforeMount - initializing count tools...');
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
  } catch (error) {
    console.error('Error during beforeMount:', error);
  }
})

</script>