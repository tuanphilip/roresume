// SPA session lookup. This stays in apps/web because @reactive-resume/auth is server-only.

import type { AuthSession } from "@reactive-resume/auth/types";
import { authClient } from "./client";

export const getSession = async (): Promise<AuthSession | null> => {
	const { data, error } = await authClient.getSession();
	if (error) {
		// HTTP 401 or 404 explicitly denotes an unauthenticated state, expired session, or unmounted endpoint.
		if (error.status === 401 || error.status === 404) return null;
		// For transient errors (e.g. 429 Too Many Requests, 5xx server/DB errors, network drops),
		// throw so callers can differentiate between unauthenticated and transient failures.
		throw new Error(error.message || `Session check failed with status ${error.status}`);
	}
	return (data as AuthSession) ?? null;
};
