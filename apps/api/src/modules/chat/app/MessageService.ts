import { supabase } from "../../../config/supabase.js";
import { Message } from "@qupid/core";

export class MessageService {
    // Save message to database
    async saveMessage(
        conversationId: string,
        message: Message,
    ): Promise<void> {
        const { error } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            sender_type: message.sender === "user" ? "user" : "ai",
            content: message.text,
            timestamp: (message as any).timestamp
                ? new Date((message as any).timestamp).toISOString()
                : new Date().toISOString(),
        });

        if (error) {
            console.error("Failed to save message:", error);
            // Don't throw - continue chat even if save fails
        }
    }

    // Get conversation messages from database
    async getMessages(conversationId: string): Promise<Message[]> {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("timestamp", { ascending: true });

        if (error) {
            console.error("Failed to load conversation history:", error);
            return [];
        }

        return (
            data?.map((msg) => ({
                sender: msg.sender_type as "user" | "ai",
                text: msg.content,
                timestamp:
                    typeof msg.timestamp === "number" ? msg.timestamp : Date.now(),
            })) || []
        );
    }
}
