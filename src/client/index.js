import { handleInput } from './js/app'
import './styles/main.scss'
import { init } from './js/app'
import { setEndDate } from './js/app'
import { postDetails } from './js/app'
import { getDetailsAndUpdateUI } from './js/app'

//Calling init() on completion of DOM load
init()

export { handleInput }
export { init }
export { setEndDate }
export { postDetails }
export { getDetailsAndUpdateUI }