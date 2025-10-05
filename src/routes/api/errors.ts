export const ApiErrorMessages = {
	LIST_FAILED: "Failed to fetch list",
	FETCH_FAILED: "Failed to fetch record",
	CREATE_FAILED: "Failed to create",
	UPDATE_FAILED: "Failed to update",
	DELETE_FAILED: "Failed to delete",
	NOT_FOUND: "Not found",
	DB_UNAVAILABLE: "Database unavailable",
	VALIDATION_FAILED: "Request body validation failed",
} as const;

export type ApiErrorKey = keyof typeof ApiErrorMessages;


