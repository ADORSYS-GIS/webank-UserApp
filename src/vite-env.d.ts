/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite/client" />

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface ShareData {
  files?: File[];
  title?: string;
  text?: string;
  url?: string;
}

interface Navigator {
  share?: (data: ShareData) => Promise<void>;
}

declare interface Window {
  sharedFiles?: File[];
}
