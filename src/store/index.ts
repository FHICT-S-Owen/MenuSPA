import { createStore, useStore as baseUseStore, Store, Commit } from 'vuex'
import categoryDataService from '@/services/CategoryDataService'
import dishDataService from '@/services/DishDataService'
import tableDataService from '@/services/TableDataService'
import ingredientDataService from '@/services/IngredientDataService'
import { Dish, Order, Restaurant } from '../classes'
import { InjectionKey } from '@vue/runtime-dom'
import orderDataService from '@/services/OrderDataService'
import SessionDataService from '@/services/SessionDataService'
import restaurantDataService from '@/services/RestaurantDataService'

export interface State {
  categories: Category[]
  selectedCategory: string[]
  
  dishes: Dish[]
  currentDish: Dish

  restaurants: Restaurant[]
  
  ingredients: Ingredient[]

  totalPrice: number
  orders: Order[]
  currentOrder: Order

  tables: Table[]
  selectedTableIds: number[]
  
  isDishDialogOpen: boolean
  isEditDialog: boolean

	isTableDialogOpen: boolean

  isConfirmDialogOpen: boolean
  currentConfirmDialogObject: Object
  confirmDeleteFunction: Function

  popUps: PopUp[]

  sessions: Session[]
  sessionId: string

  apiToken: string
  filter: number
}

export const key: InjectionKey<Store<State>> = Symbol()

export default createStore<State>({
  state: {
    categories: [],
    selectedCategory: [],
    
    dishes: [],
    currentDish: new Dish(),
    
    restaurants: [],

    ingredients: [],

    totalPrice: 0,
    orders: [],
    currentOrder: new Order(1, [], '', 0),

    tables: [] as Table[],
    selectedTableIds: [] as number[],

    isDishDialogOpen: false,
    isEditDialog: false,

    isTableDialogOpen: false,

    isConfirmDialogOpen: false,
    currentConfirmDialogObject: {},
    confirmDeleteFunction: new Function(),

    popUps: [],

    sessions: [] as Session[],
    sessionId: 's',

    apiToken: '',
    filter: 0
  },
  mutations: {
    setCategories: async (state) => {
      state.categories = await categoryDataService.getAllCategories()
      state.selectedCategory = state.categories
        .filter((c) => state.dishes.find((d) => d.category == c.name))
        .map((c) => c.name)
    },
    addCategory: async (state, payload) => {
      categoryDataService.createCategory(payload)
        .then(category => state.categories.push(category))
    },
    editCategory: async (state, payload) => {
      categoryDataService.editCategory(payload)
        .then(() => {
          const elementIndex = state.categories.findIndex(obj => obj.id == payload.id)
          Object.assign(state.categories[elementIndex], payload)
        })
    },
    addDish: async (state, payload) => {
      dishDataService.createDish(payload)
        .then(dish => state.dishes.push(dish))
    },
    editDish: async (state, payload) => {
      dishDataService.editDish(payload)
        .then(dish => {
          const elementIndex = state.dishes.findIndex(obj => obj.id == dish.id)
          Object.assign(state.dishes[elementIndex], dish)
        })
    },
    addIngredient: async (state, payload) => {
      ingredientDataService.createIngredient(payload)
        .then(ingredient => state.ingredients.push(ingredient))
    },
    editIngredient: async (state, payload) => {
      ingredientDataService.editIngredient(payload)
        .then(ingredient => {
          const elementIndex = state.ingredients.findIndex(obj => obj.id == ingredient.id)
          Object.assign(state.ingredients[elementIndex], ingredient)
        })
    },
    addOrder: async (state, payload) => {
      orderDataService.createOrder(payload)
        .then(order => state.orders.push(order))
    },
    editOrder: async (state, payload ) => {
      orderDataService.editOrder(payload)
        .then(order => {
          const elementIndex = state.orders.findIndex(obj => obj.id == order.id)
          Object.assign(state.orders[elementIndex], order)
        })
    },
    addTable: async (state, payload) => {
      tableDataService.createTable(payload)
        .then(table => state.tables.push(table))
    },
    editTable: async (state, payload) => {
      tableDataService.editTable(payload)
        .then(table => {
          const elementIndex = state.tables.findIndex(obj => obj.id == table.id)
          Object.assign(state.tables[elementIndex], table)
        })
    },
    addRestaurant: async (state, payload) => {
      restaurantDataService.createRestaurant(payload)
        .then(restaurant => state.restaurants.push(restaurant))
    },
    editRestaurant: async (state, payload) => {
      restaurantDataService.editRestaurant(payload)
        .then(() => {
          const elementIndex = state.restaurants.findIndex(obj => obj.id == payload.id)
          Object.assign(state.restaurants[elementIndex], payload)
        })
    },
    setDishes: async (state) => state.dishes = await dishDataService.getAllDishes(),
    setIngredients: async (state) => state.ingredients = await ingredientDataService.getAllIngredients(),
    setRestaurants: async (state) => state.restaurants = await restaurantDataService.getAllRestaurants(),
    setOrders: async (state) => state.orders = await orderDataService.getAllOrders(),
    setTables: async (state) => state.tables = await tableDataService.getAllTables(),
    setSessions: async (state) => state.sessions = await SessionDataService.getAllSessions(),
    toggleDialog: (state, payload) => {
      state.isDishDialogOpen = !state.isDishDialogOpen
      state.isEditDialog = payload
    },
    toggleTableDialog: (state) => {
      state.isTableDialogOpen = !state.isTableDialogOpen
    },
    closeDishDialog: (state) => state.isDishDialogOpen = false,
    setSelectedCategory: (state, payload: string) => {
      if (payload.trim().toLowerCase() === 'all')
        state.selectedCategory = state.categories
          .filter((c) => state.dishes.find((d) => d.category == c.name))
          .map((c) => c.name)
      else {
        state.selectedCategory = []
        state.selectedCategory.push(payload.trim())
      }
    },
    toggleConfirmDialog: (state, payload) => {
      state.isConfirmDialogOpen = !state.isConfirmDialogOpen
      state.currentConfirmDialogObject = payload.object
      state.confirmDeleteFunction = payload.function
    },
    closeConfirmDialog: (state) => state.isConfirmDialogOpen = false,
    setCurrentDish: (state, payload) => state.currentDish = payload,
    createNewDish: (state) => state.isDishDialogOpen = !state.isDishDialogOpen,
    setToken: (state, payload) => state.apiToken = payload,
    setSessionId: (state, payload) => state.sessionId = payload,
    addDishToOrder: (state, payload) => {
      state.currentOrder.dishes.push(payload.name)
      state.totalPrice += payload.prize
    },
    removeDishFromOrder: (state, payload) => { 
      const index = state.currentOrder.dishes.indexOf(payload.name)
      if (index != -1){
        state.currentOrder.dishes.splice(index, 1)
        state.totalPrice -= payload.prize
      }
    },
    setFilter: (state, payload) => state.filter = payload
  },
  actions: {
    
    deleteObject({ state }) {
      state.confirmDeleteFunction()
      state.isConfirmDialogOpen = false
    },
    deleteDish({ commit }, dish: Dish) {
      dishDataService.deleteDish(dish).then(() => commit('setDishes'))
    },
    deleteCategory({ commit }, category: Category) {
      categoryDataService
        .deleteCategory(category)
        .then(() => commit('setCategories'))
    },
    deleteRestaurant({ commit }, restaurant: Restaurant) {
      restaurantDataService
        .deleteRestaurant(restaurant)
        .then(() => commit('setRestaurants'))
    },
    deleteIngredient({ commit }, ingredient: Ingredient) {
      ingredientDataService
        .deleteIngredient(ingredient)
        .then(() => commit('setIngredients'))
    },

    toggleDialog: ({ commit }, payload) => commit('toggleDialog', payload),

    setCurrentDish: ({ commit }, payload) => commit('setCurrentDish', payload),
    removeIngredientFromCurrentDish: ({ state }, payload) =>
      state.currentDish.ingredients.splice(
        state.currentDish.ingredients.indexOf(payload),
        1
      ),
    removeTableFromSelectedTableIds: ({ state }, payload) =>
      state.selectedTableIds.splice(
        state.selectedTableIds.indexOf(payload),
        1
      ),
  },
  modules: {},
})
export function useStore() {
  return baseUseStore(key)
}
