<template>
  <div class="alert alert-danger alert-dismissible" v-if="msg">
    {{ msg }}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  inject: ['Auth'],
  computed: {
    msg () {
      return this.Auth.error
    }
  }
})
</script>
