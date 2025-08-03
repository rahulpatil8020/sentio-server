import mongoose from "mongoose";
import EmotionalState, { IEmotionalState } from "../models/emotionalstate.model";
import { EmotionalStateError } from "../utils/errors/errors";

// Create a new emotional state entry
export const createEmotionalState = async (
    userId: string,
    data: Partial<IEmotionalState>
): Promise<IEmotionalState> => {
    return EmotionalState.createEmotionalState({
        ...data,
        userId: new mongoose.Types.ObjectId(userId),
    });
};

// Get all emotional states for a user
export const getEmotionalStatesByUserId = async (
    userId: string
): Promise<IEmotionalState[]> => {
    return EmotionalState.findByUser(new mongoose.Types.ObjectId(userId));
};


export const getEmotionsByDate = async (
    userId: string,
    date: string
): Promise<IEmotionalState[]> => {
    return EmotionalState.getByDate(new mongoose.Types.ObjectId(userId), "2025-07-28");

};

// Get last 7 days of emotional state data
export const getLast7DaysByUserId = async (
    userId: string
): Promise<IEmotionalState[]> => {
    return EmotionalState.getLast7DaysByUserId(new mongoose.Types.ObjectId(userId));
};

// Delete an emotional state entry
export const deleteEmotionalStateById = async (
    id: string
): Promise<IEmotionalState | null> => {
    const deleted = await EmotionalState.deleteById(id);
    if (!deleted) throw new EmotionalStateError("Emotional state not found");
    return deleted;
};

export const getEmotionsByRange = async (
    userId: string,
    start: Date,
    end: Date
): Promise<IEmotionalState[]> => {
    return EmotionalState.findByRange(userId, start, end);
};