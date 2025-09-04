import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Output to dist directory for Netlify deployment
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  
  // Simplified plugins
  plugins: [
    react()
  ],
  
  // Development server configuration
  server: {
    port: 4028,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new'],
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  
  // Preview server configuration (for production testing)
  preview: {
    port: 4029,
    host: "0.0.0.0",
    strictPort: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' data:; object-src 'none'"
    }
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      'recharts',
      'date-fns',
      'clsx'
    ],
    exclude: [
      // Exclude large libraries that should be loaded dynamically
      'html2canvas',
      'jspdf'
    ]
  },
  
  // Environment variables
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '2.1.0'),
    __DEPLOYMENT_STATUS__: JSON.stringify('production-ready'),
    __ADMIN_PANEL_STATUS__: JSON.stringify('working')
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@services': resolve(__dirname, 'src/services')
    }
  },
  
  // CSS processing
  css: {
    devSourcemap: true,
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase'
    }
  },
  
  // Worker configuration for better performance
  worker: {
    format: 'es'
  },
  
  // Experimental features for better performance
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      }
      return { relative: true };
    }
  }
});
