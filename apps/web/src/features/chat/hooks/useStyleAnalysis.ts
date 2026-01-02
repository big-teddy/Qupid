import { useMutation } from "@tanstack/react-query";
import { Message } from "@qupid/core";
import { api } from "../../../shared/lib/api-client";

interface StyleAnalysis {
  currentStyle: {
    type: string;
    characteristics: string[];
    strengths: string[];
    weaknesses: string[];
  };
  recommendations: {
    category: string;
    tips: string[];
    examples: string[];
  }[];
}

interface StyleAnalysisResponse {
  ok: boolean;
  data: StyleAnalysis;
}

export const useStyleAnalysis = () => {
  return useMutation<StyleAnalysis, Error, Message[]>({
    mutationFn: async (messages) => {
      const response = await api.post<StyleAnalysisResponse>(
        "/chat/style-analysis",
        { messages },
      );
      return response.data;
    },
  });
};
