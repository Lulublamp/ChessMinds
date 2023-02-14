// import {windowContext} from '../../client/src/renderer'
import { MainRenderer } from './renderer'

const root = document.getElementById('root') as HTMLElement



document.addEventListener('DOMContentLoaded', () => {
  MainRenderer(root , null);
})

// MainRenderer(root , null)

