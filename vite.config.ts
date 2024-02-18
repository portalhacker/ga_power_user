import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api-ga4-admin': {
                target: 'https://analyticsadmin.googleapis.com/v1beta',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-ga4-admin/, ''),
            },
            '/api-ga4-data': {
                target: 'https://analyticsdata.googleapis.com/v1beta',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-ga4-data/, ''),
            },
        },
},
});
