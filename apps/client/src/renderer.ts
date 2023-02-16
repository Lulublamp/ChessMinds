import './main'
import ClientApi from '../electron/preload'

const windowContext: ClientApi = (window as any).client

export { windowContext }

