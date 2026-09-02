// =========================================================
// REACTION CACHE — persists reaction state across navigation
// =========================================================

const CACHE_KEY = "blogify_reaction_cache";

const getCache = () => {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    } catch {
        return {};
    }
};

/**
 * Read cached reaction for a single post.
 * @param {number|string} postId
 * @returns {{ likeCount: number, dislikeCount: number, currentReaction: string|null } | null}
 */
export const getCachedReaction = (postId) => {
    return getCache()[String(postId)] ?? null;
};

/**
 * Write / overwrite cached reaction for a single post.
 * @param {number|string} postId
 * @param {{ likeCount: number, dislikeCount: number, currentReaction: string|null }} data
 */
export const setCachedReaction = (postId, data) => {
    const cache = getCache();
    cache[String(postId)] = data;
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // localStorage full or blocked — silently skip
    }
};
