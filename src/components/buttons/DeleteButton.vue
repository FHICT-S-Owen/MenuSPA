<template>
  <button 
    class="flex flex-row px-2 py-1 rounded-lg justify-center text-white bg-red-500 hover:bg-red-600">
    <TrashIcon class="w-5 h-5 mt-0.5" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TrashIcon } from '@heroicons/vue/outline'

export default defineComponent({
  components: {
    TrashIcon
  },
  setup() { }
})
</script>
