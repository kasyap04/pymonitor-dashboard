/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COLLECTOR_URL: string
  readonly VITE_SERVICE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
