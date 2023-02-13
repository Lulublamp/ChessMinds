import { MainRenderer } from "@TRPI/frontend";

document.getElementById('web').remove();//supprimer le script qui est nécessaire pour la version web
console.clear();//supprimmer l'erreur du script qu'il ne trouve pas

const root = document.getElementById('root') as HTMLElement
MainRenderer(root);