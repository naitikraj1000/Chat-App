import { configureStore } from '@reduxjs/toolkit'
import Informationreducer from './informationslice'


export default configureStore({
    reducer: {
        information: Informationreducer,
    }
})