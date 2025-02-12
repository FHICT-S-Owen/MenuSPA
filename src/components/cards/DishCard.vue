<template>
  <div class="flex flex-col">
    <div
      class="flex flex-row bg-white rounded-3xl h-24 mt-3 ring-1 ring-gray-200 cursor-pointer" @click="toggleDishDetails">
      <div
        class="relative rounded-3xl m-1 bg-blend-normal bg-cover bg-no-repeat"
        :style="{ background: dish.image, minHeight: imgSize, minWidth: imgSize }">
        <div v-if="countOccurrences() > 0"
          class="z-10 px-9 py-7 rounded-3xl text-2xl bg-opacity-60 text-white align-self-center">
          {{countOccurrences()}}
        </div>
        <div 
        class="absolute bottom-0 right-0 shadow-lg pr-2 pl-1 rounded-full text-green-500 capitalize italic bg-white text-sm">
          €{{(dish.prize < 0 ? 0.00 : dish.prize).toFixed(2)}}
        </div>
      </div>
      <div class="relative flex-1 m-1">
        <!-- <div class="absolute right-0 -top-4 shadow-lg py-1 px-4 rounded-full text-green-500 capitalize italic bg-white text-sm font-semibold">
          Vegan
        </div> -->
        <h5 v-if="lang == 'en' " class="font-medium text-lg">{{ dish.name }}</h5>
        <h5 v-else-if="lang == 'nl' " class="font-medium text-lg">{{ dish.name_NL }}</h5>
        <p v-if="lang == 'en' " class="text-gray-400" style="font-size: 0.85rem; line-height: 1rem">
          {{ dish.description }}
        </p>
        <p v-else-if="lang == 'nl' " class="text-gray-400" style="font-size: 0.85rem; line-height: 1rem">
          {{ dish.description_NL }}
        </p>
      </div>
    </div>
    <div v-if="isInSession" class="flex flex-row justify-around rounded-3xl mt-1.5 h-10">
      <button 
        @click="addDishToCurrentOrder"
        class="text-white font-medium text-sm w-2/5 rounded-3xl p-1 my-1 ml-1 mr-0.5" style="background-color: rgb(255, 168, 37)">
        {{$t('add')}}
      </button>
      <button 
        @click="removeDishFromCurrentOrder"
        class="bg-red-500 text-white font-medium text-sm w-2/5 rounded-3xl p-1 my-1 ml-0.5 mr-1">
        {{$t('remove')}}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { Dish } from '@/types'
import { Dish as DishClass } from '@/classes'
import { computed, defineComponent, PropType, ref, onMounted } from 'vue'

export default defineComponent({
  props: {
    dish: {
      type: Object as PropType<Dish>,
      required: true,
    },
  },
  setup(props) {
    const dishes = computed(() => store.state.currentOrder.dishes)
    const isInSession = computed(() => !!store.state.currentSession)
    let isDishDetailsOpen = ref(false)
    let currentDishDetails = ref(new DishClass())

    const countOccurrences = () => 
      dishes.value.reduce((a, v) => (v === props.dish.name ? a + 1 : a), 0)

    const toggleDishDetails = () => {
      store.commit('toggleDishDetails', props.dish)
    }

    const addDishToCurrentOrder = () => 
      store.commit('addDishToOrder', props.dish)

    const removeDishFromCurrentOrder = () => 
      store.commit('removeDishFromOrder', props.dish)

    let lang = ref('')
    onMounted(() => {
      lang.value = localStorage.getItem('lang') || 'en'
    })

    return { 
      lang,
      imgSize: ref('88px'), 
      isInSession,
      isDishDetailsOpen,
      currentDishDetails,
      countOccurrences,
      addDishToCurrentOrder,
      removeDishFromCurrentOrder,
      toggleDishDetails
    }
  },
})
</script>
