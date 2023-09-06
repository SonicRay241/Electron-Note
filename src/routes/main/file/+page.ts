import type { PageLoad } from "./$types";

export const load = (async ({ params, url }) => {
    const path = url.searchParams.get('path')
    if (path){
        return { path }
    }
    return { path: "" }
}) satisfies PageLoad