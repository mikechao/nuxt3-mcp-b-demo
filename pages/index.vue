<template>
  <div>
    <h1>This is the index page</h1>
    <div>
      <h2>Current Count: {{ count }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
// Access the same global state defined in app.vue
const count = useState('count', () => 0)

</script>