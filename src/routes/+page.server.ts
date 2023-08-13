import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    moveToNew: async ({request}) => {
        throw redirect(302, '/new')
    }
} satisfies Actions;