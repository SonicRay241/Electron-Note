import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    moveToApp: async ({request}) => {
        throw redirect(302, '/app')
    }
} satisfies Actions;