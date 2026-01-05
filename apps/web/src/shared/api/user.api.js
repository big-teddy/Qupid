import { api } from "../lib/api-client";
class UserApi {
    async getUserProfile(userId) {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    }
    async createUserProfile(profile) {
        const response = await api.post("/users", profile);
        return response.data;
    }
    async updateUserProfile(userId, updates) {
        const response = await api.patch(`/users/${userId}`, updates);
        return response.data;
    }
    async completeTutorial(userId) {
        await api.post(`/users/${userId}/tutorial/complete`);
    }
    async getFavorites(userId) {
        const response = await api.get(`/users/${userId}/favorites`);
        return response.data;
    }
    async toggleFavorite(userId, personaId) {
        const response = await api.post(`/users/${userId}/favorites/${personaId}`);
        return response.data;
    }
    async getUserBadges(userId) {
        const response = await api.get(`/users/${userId}/badges`);
        return response.data;
    }
    async uploadAvatar(userId, imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await api.post(`/users/${userId}/avatar`, formData);
        return response.data.avatarUrl;
    }
}
export const userApi = new UserApi();
