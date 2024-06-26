import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

export const SUI_CONNECTION = getFullnodeUrl('devnet');

export const getSuiProvider = () =>
  new SuiClient({
    url: SUI_CONNECTION,
  });
