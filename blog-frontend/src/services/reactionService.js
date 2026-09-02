import api from "./api";
import { getCachedReaction, setCachedReaction } from "./reactionCache";

// =========================================================
// HELPER — decide whether API data is "meaningful"
// (non-zero counts OR an active reaction)
// =========================================================
const isMeaningful = (data) =>
    data &&
    (
        (data.likeCount    > 0) ||
        (data.dislikeCount > 0) ||
        !!data.currentReaction
    );

// =========================================================
// LIKE
// =========================================================
export const likePost = async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    // Always cache the authoritative response from the server
    setCachedReaction(postId, response.data);
    return response.data;
};

// =========================================================
// DISLIKE
// =========================================================
export const dislikePost = async (postId) => {
    const response = await api.post(`/posts/${postId}/dislike`);
    setCachedReaction(postId, response.data);
    return response.data;
};

// =========================================================
// REMOVE REACTION
// =========================================================
export const removeReaction = async (postId) => {
    const response = await api.delete(`/posts/${postId}/reaction`);
    setCachedReaction(postId, response.data);
    return response.data;
};

// =========================================================
// GET REACTION INFO
// Strategy:
//   1. Try the backend first.
//   2. If backend returns meaningful data → cache it and return.
//   3. If backend returns all-zeros / null → use the cache.
//   4. If the request fails entirely     → use the cache.
// =========================================================
export const getReactionInfo = async (postId) => {

    try {

        const response = await api.get(`/posts/${postId}/reaction`);
        const apiData  = response.data;

        if (isMeaningful(apiData)) {
            // Fresh, meaningful server data — update cache
            setCachedReaction(postId, apiData);
            return apiData;
        }

        // Server returned zeros / empty — prefer cache if available
        const cached = getCachedReaction(postId);
        return cached ?? apiData;

    } catch {

        // Network / 404 / auth error — fall back to cache
        const cached = getCachedReaction(postId);
        return cached ?? { likeCount: 0, dislikeCount: 0, currentReaction: null };
    }
};
