import type { Cookies } from "@sveltejs/kit";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const SD_API_URL = process.env.SD_API_URL;

export async function load({ params, cookies }: { params: { articleId: string }, cookies: Cookies }) {
    // The Superdesk client stores a JWT containing the backend auth token.
    // We don't need to validate it as the only claim is itself a token that is validated on the backend.
    // Try to get 'session' cookie with JWT
    let session = cookies.get("session");
    if (session) {
        let token_data = jwt.decode(session, { complete: true });
        // @ts-ignore // Honestly this should be in the payload (not causing a type error) but idk Superdesk is weird
        let auth_token = token_data?.header?.session_token;
        // TODO: Run a test API call, and if authentication fails, redirect to login page
        let content = await fetch(`${SD_API_URL}/archive/${params.articleId}`,
                { headers: { "Authorization": `Bearer ${auth_token}` } })
            .then((res) => res.json());
        let desk = await fetch(`${SD_API_URL}/desks/${content.task.desk}`,
                { headers: { "Authorization": `Bearer ${auth_token}` } })
            .then((res) => res.json());
        let stage = await fetch(`${SD_API_URL}/stages/${content.task.stage}`,
                { headers: { "Authorization": `Bearer ${auth_token}` } })
            .then((res) => res.json());
        return {
            content, desk, stage
        };
    } else { // TODO: If doesn't exist, redirect to login page
    }
}

export const actions = {
    default: async ({ request, params, cookies }: { request: Request, params: { articleId: string }, cookies: Cookies }) => {
        let content_item = await request.formData();
        let etag = content_item.get("_etag") as string;
        let body_html = content_item.get("body_html") as string;
        // Try to get 'session' cookie containing JWT
        let session = cookies.get("session");
        if (session) {
            let token_data = jwt.decode(session, { complete: true });
            // @ts-ignore // Honestly this should be in the payload (not causing a type error) but idk Superdesk is weird
            let auth_token = token_data?.header?.session_token;
            // Send API request with authentication to patch the content item
            let res = await fetch(`${SD_API_URL}/archive/${params.articleId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${auth_token}`, "Content-Type": "application/json",
                    "If-Match": etag
                },
                body: `{
                    "body_html": "${body_html?.replace(/"/g, '\\"')}",
                    "headline": "${content_item.get("headline")}"
                }`
            })
                .then((res) => res.json());
            console.log(res);
            // TODO: handle potential errors here
        }
    }
}
