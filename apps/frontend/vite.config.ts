import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

/*
// Read SSL certificate files
const privateKey = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
*/
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
})

//HTTPS config
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: privateKey,
//       cert: certificate,
//     },
//   },
// })