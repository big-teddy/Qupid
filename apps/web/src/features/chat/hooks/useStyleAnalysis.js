import { useMutation } from "@tanstack/react-query";
import { api } from "../../../shared/lib/api-client";
export const useStyleAnalysis = () => {
    return useMutation({
        mutationFn: async (messages) => {
            const response = await api.post("/chat/style-analysis", { messages });
            return response.data;
        },
    });
};
