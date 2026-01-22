import type { Cookies } from "@sveltejs/kit";
import dotenv from "dotenv";
import { getSessionToken, redirectToLogin, AuthenticationError, fetchJsonAuthenticated } from "$lib/server/auth";

dotenv.config();
const SD_API_URL = process.env.VITE_SD_API_URL;

export async function load({ params, cookies, url }: { params: { articleId: string }, cookies: Cookies, url: URL }) {
    try {
        let session_token = getSessionToken(cookies);

        let content = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/archive/${params.articleId}`);
        let desk = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/desks/${content.task.desk}`);
        let stage = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/stages/${content.task.stage}`);
        let type = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/content_types/${content.type}`);
        let vocabularies = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/vocabularies`);

        return {
            content, desk, stage, type, vocabularies
        };
    } catch (e) { // If authentication fails, redirect to login page
        if (e instanceof AuthenticationError) redirectToLogin(url.origin+url.pathname);
        else throw e;
    }
}

export const actions = {
    default: async ({ request, params, cookies, url }: { request: Request, params: { articleId: string }, cookies: Cookies, url: URL }) => {
        try {
            let session_token = getSessionToken(cookies);

            let content_item = await request.formData();
            let etag = content_item.get("_etag") as string;
            let content_type: any = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/content_types/${content_item.get("_type")}`);

            let bodyObj: any = {};
            content_item.forEach((val, key) => {
                if (val && key != "_etag" && key != "_type") {
                    let jsonVal = JSON.parse(val as string);
                    if (content_type.schema[key].type == "list") {
                        if (bodyObj[key]) bodyObj[key] = [...bodyObj[key], jsonVal];
                        else bodyObj[key] = [jsonVal];
                    }
                    else if (jsonVal) bodyObj[key] = jsonVal;
                }
            });

            let res = await fetchJsonAuthenticated(session_token, `${SD_API_URL}/archive/${params.articleId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "If-Match": etag },
                body: JSON.stringify(bodyObj)
            });
        } catch (e) { // If authentication fails, redirect to login page
            if (e instanceof AuthenticationError) redirectToLogin(url.origin+url.pathname);
            else throw e; // TODO: handle potential errors here
        }
    }
}
