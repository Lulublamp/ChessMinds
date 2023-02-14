import { MainRenderer } from "@TRPI/frontend";
import { windowContext } from "./renderer";

document.getElementById('web').remove();//supprimer le script qui est nécessaire pour la version web
// console.clear();//supprimmer l'erreur du script qu'il ne trouve pas

const root = document.getElementById('root') as HTMLElement

document.addEventListener('DOMContentLoaded', () => {
    MainRenderer(root , windowContext);
})



