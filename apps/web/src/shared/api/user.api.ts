import { UserProfile } from "@qupid/core";
import { api } from "../lib/api-client";

class UserApi {
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<{ data: UserProfile }>(`/users/${userId}`);
    return response.data;
  }

  async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.post<{ data: UserProfile }>("/users", profile);
    return response.data;
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>,
  ): Promise<UserProfile> {
    const response = await api.patch<{ data: UserProfile }>(
      `/users/${userId}`,
      updates,
    );
    return response.data;
  }

  async completeTutorial(userId: string): Promise<void> {
    await api.post(`/users/${userId}/tutorial/complete`);
  }

  async getFavorites(userId: string): Promise<string[]> {
    const response = await api.get<{ data: string[] }>(
      `/users/${userId}/favorites`,
    );
    return response.data;
  }

  async toggleFavorite(userId: string, personaId: string): Promise<boolean> {
    const response = await api.post<{ data: boolean }>(
      `/users/${userId}/favorites/${personaId}`,
    );
    return response.data;
  }

  async getUserBadges(userId: string): Promise<any[]> {
    const response = await api.get<{ data: any[] }>(`/users/${userId}/badges`);
    return response.data;
  }

  async uploadAvatar(userId: string, imageFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.post<{ data: { avatarUrl: string } }>(
      `/users/${userId}/avatar`,
      formData,
    );
    return response.data.avatarUrl;
  }
}

export const userApi = new UserApi();
