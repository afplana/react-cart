import axios from 'axios'
import React, { useContext, useReducer, FC, useEffect } from 'react'
import { cartItems } from './data'
import reducer from './reducer'
import { CartItemType } from './types'

const url = 'https://course-api.com/react-useReducer-cart-project'

export const initialState = {
    loading: false,
    cart: cartItems,
    total: 0,
    amount: 0,
}

type GlobalContextState = {
    loading: boolean,
    cart: CartItemType[],
    total: number,
    amount: number,
    clearCart: () => void,
    remove: (id: number) => void,
    increment: (id: number) => void,
    decrement: (id: number) => void,

}

const AppContext = React.createContext<GlobalContextState>({
    loading: false,
    cart: cartItems,
    total: 0,
    amount: 0,
    clearCart: () => { },
    remove: () => { },
    increment: () => { },
    decrement: () => { }
})



const AppProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' })
    }

    const remove = (id: number) => {
        dispatch({ type: 'REMOVE', payload: id })
    }

    const increment = (id: number) => {
        dispatch({ type: 'INCREMENT', payload: id })
    }

    const decrement = (id: number) => {
        dispatch({ type: 'DECREMENT', payload: id })
    }

    const fetchItems = async () => {
        dispatch({ type: 'LOADING' })
        const response = await axios.get<CartItemType[]>(url)
        const cart = response.data
        dispatch({ type: 'DISPLAY_ITEM', payload: cart })
    }

    useEffect(() => {
        fetchItems()
    }, [])

    useEffect(() => {
        dispatch({ type: 'GET_TOTALS' })
    }, [state.cart])

    return (
        <AppContext.Provider
            value={{
                loading: state.loading,
                cart: state.cart,
                total: state.total,
                amount: state.amount,
                clearCart,
                remove,
                increment,
                decrement
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppContext, AppProvider }