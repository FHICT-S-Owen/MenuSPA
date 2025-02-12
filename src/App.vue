<template>
  <div v-if="$route.meta.requiresNavBar" id="app" class="h-screen">
    <NavBar />
    <div>
      <Error />
      <div>
        <router-view />
        <ul class="pop-up-position">
          <PopUp v-for="popUp of popUps" :key="popUp" :popUp="popUp" />
        </ul>
        <DeleteConfirmDialog v-if="isConfirmDialogOpen" :key="isConfirmDialogOpen" />
      </div>
    </div>
  </div>
  <div v-else id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue'
import Error from './components/Error.vue'
import DeleteConfirmDialog from './components/dialogs/DeleteConfirmDialog.vue'
import PopUp from './components/PopUp.vue'
import store from '@/store'
import { computed, onMounted, inject, defineComponent } from 'vue'
import { AuthPlugin } from '@/auth'
import { Client } from '@stomp/stompjs'

export default defineComponent({
  components: {
    NavBar,
    DeleteConfirmDialog,
    Error,
    PopUp
  },
  setup() {
    const popUps = computed(() => store.state.popUps)
    const isConfirmDialogOpen = computed(() => store.state.isConfirmDialogOpen)
    const auth = inject<AuthPlugin>('Auth')
    var client: Client

    const getToken = () => {
      if (!!auth && auth.isAuthenticated.value)
        auth.getTokenSilently().then(res => {
          store.commit('setToken', res)
        })
    }

    function connectAsLiveView() {
      client = new Client({
        brokerURL: process.env.VUE_APP_WS_URL,
        onConnect: () => {
          console.log('connected as live-view')
          client.subscribe('/topic/live-view', message => { //TODO: add filter to confirm an order that can be made
            store.commit('addOrder', JSON.parse(message.body))
          })
        }
      })
      console.log(client.brokerURL)
      client.activate()
    }

    function connectAsWaiter() {
      client = new Client({
        brokerURL: process.env.VUE_APP_WS_URL,
        onConnect: () => {
          console.log('connected as waiter')
          client.subscribe('/topic/update-table-status', message => {
            store.commit('setTableInUse', message.body)
          })
        }
      })
      console.log(client.brokerURL)
      client.activate()
    }

    onMounted(() => {
      store.commit('setCategories')
      store.commit('setDishes')
      store.commit('setIngredients')
      store.commit('setRestaurants')
      store.commit('setTables')
      getToken()
      if (!!auth && auth.isAuthenticated.value && auth.user.value.roles.includes('RestaurantOwner')) //TODO: switch to KitchenStaff
        connectAsLiveView()
      if (!!auth && auth.isAuthenticated.value && auth.user.value.roles.includes('Waiter'))
        connectAsWaiter()
    })
    
    return { popUps, isConfirmDialogOpen }
  }
})
</script>

<style>
.pop-up-position {
  position: fixed;
  bottom: 5%;
  right: 2%;
  transform: translate(-50%, -50%);
}

:root {
  --primary-color: #FFA825;
}
</style>