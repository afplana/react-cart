import { initialState } from './context'

const reducer = (state: typeof initialState, action: any) => {
    const excludeById = (cid: number) => state.cart.filter((item) => item.id !== cid)

    switch (action.type) {
        case 'CLEAR_CART':
            return {
                ...state,
                cart: []
            }
        case 'REMOVE':
            return {
                ...state,
                cart: excludeById(action.payload)
            }
        case 'INCREMENT':
            return {
                ...state,
                cart: state.cart.map((item) => {
                    if (item.id === action.payload) {
                        return { ...item, amount: item.amount + 1 }
                    }
                    return item
                })
            }
        case 'DECREMENT':
            return {
                ...state,
                cart: state.cart.map((item) => {
                    if (item.id === action.payload) {
                        return { ...item, amount: item.amount >= 0 ? item.amount - 1 : 0 }
                    }
                    return item
                }).filter((item) => item.amount > 0)
            }
        case 'GET_TOTALS': {
            let { total, amount } = state.cart.reduce((cartTotal, cartItem) => {
                const { price, amount } = cartItem
                const itemTotal = price * amount
                cartTotal.total += itemTotal
                cartTotal.amount += amount
                return cartTotal
            }, { total: 0, amount: 0, }
            )
            total = parseFloat(total.toFixed(2))
            return {
                ...state,
                total,
                amount,
            }
        }
        case 'LOADING':
            return { ...state, loading: true }
        case 'DISPLAY_ITEM':
            return { ...state, cart: action.payload, loading: false }

    }
    return state
}

export default reducer