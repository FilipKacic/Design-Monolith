import { resolve } from '$app/paths';

// Strip trailing slash to get bare base prefix for assets
export const assetBase = resolve('/').replace(/\/$/, '');