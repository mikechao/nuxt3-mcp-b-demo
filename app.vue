<template>
  <div>
    <NuxtPage/>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useMcpServer } from './composables/useMcpServer';

const router = useRouter()

const gotoAbout = () => {
  router.push('/about')
}

const gotoIndex = () => {
  router.push('/')
}

// onBeforeMount is only ran on the client side
// https://vuejs.org/api/composition-api-lifecycle#onbeforemount
// The transport used from the McpServer requires a browser environment
// can use onBeforeMount or a check on import.meta.client like in index.vue
// to ensure the code only runs on the client side
onBeforeMount(async () => {
  
  console.log('App beforeMount');

  try {
    const { server } = await useMcpServer();

    console.log('Registering goto tools...');
    // Define remaining tools AFTER connection
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