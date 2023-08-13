import type { LayoutLoad } from './$types.js'

export let csr = true

export const load = (({ url }) => {
    return {
        url: url.pathname
    }
}) satisfies LayoutLoad