import type { RequestEvent, Cookies } from '@sveltejs/kit';
import { redirect } from "@sveltejs/kit";
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import jwt from "jsonwebtoken";
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export class AuthenticationError extends Error {
    constructor() {
        super("Authentication error");
    }
}

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id, username: table.user.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export function redirectToLogin(currentUrl: string) { redirect(307, `/login?redirect=${currentUrl}`); }

// Throws AuthenticationError if can't get token
export function getSessionToken(cookies: Cookies): string {
    // The Superdesk client stores a JWT containing the backend auth token.
    // We don't need to validate it as the only claim is itself a token that is validated on the backend.
    let sessionCookie = cookies.get("session");
    if (sessionCookie) {
        let token_data; // Catch JsonWebTokenError in case value is not in JWT format
        try { token_data = jwt.decode(sessionCookie, { complete: true }); }
        catch (e) {
            if (e instanceof jwt.JsonWebTokenError) throw new AuthenticationError();
            else throw e;
        }
        // @ts-ignore // Honestly token should be in the payload (not causing a type error) but idk Superdesk is weird
        return token_data?.header?.session_token;
    } else throw new AuthenticationError();
}

// Perform fetch and convert to json. If, according to the server API format, there is an auth error, throw AuthenticationError
export async function fetchJsonAuthenticated(
    session_token: string,
    url: string | URL | globalThis.Request,
    init?: RequestInit
): Promise<any> {
    let json = await fetch(url, { ...init, headers: { "Authorization": `Bearer ${session_token}`, ...init?.headers } })
        .then((res) => res.json());
    if (json._status == "ERR") {
        if (json._issues?.auth) throw new AuthenticationError();
        else throw new Error(JSON.stringify(json));
    }
    return json;
}
