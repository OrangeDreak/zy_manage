import Vuex from 'vuex'
import common from './modules/common'
import tags from './modules/tags'
import logistics from './modules/logistics'
import order from './modules/order'
import getters from './getters'

const store = new Vuex.Store({
    modules: {
        common,
        tags,
        logistics,
        order
    },
    getters,
})

export default store
