import type { Cookies } from "@sveltejs/kit";
import dotenv from "dotenv";
import { getSessionToken, redirectToLogin, AuthenticationError, fetchJsonAuthenticated } from "$lib/server/auth";

dotenv.config();
const SD_API_URL = process.env.VITE_SD_API_URL;

export async function load({ params, cookies, url }: { params: { articleId: string }, cookies: Cookies, url: URL }) {
    try {
        let session_token = getSessionToken(cookies);

        let archive = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/archive`);
        let desks = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/desks`);
        let stages = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/stages`);
        let subscribers = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/subscribers`);

        return {
            archive, desks, stages, subscribers
        };
    } catch (e) { // If authentication fails, redirect to login page
        if (e instanceof AuthenticationError) redirectToLogin(url.origin+url.pathname);
        else throw e;
    }
}
