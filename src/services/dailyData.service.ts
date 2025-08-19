import Habit from "../models/habit.model";
import Todo from "../models/todo.model";
import Reminder from "../models/reminder.model";
import EmotionalState from "../models/emotionalstate.model";
import Transcript from "../models/transcript.model";

export const getDailyDataInRange = async (
    userId: string,
    start: string,
    end: string,
    timezone?: string
) => {
    const [
        habitsByDay,
        todosByDay,
        remindersByDay,
        emotionsByDay,
        transcriptsByDay,
    ] = await Promise.all([
        Habit.findByRangeGrouped(userId, start, end, timezone),
        Todo.findCompletedByRangeGrouped(userId, start, end, timezone),
        Reminder.findByRangeGrouped(userId, start, end, timezone),
        EmotionalState.findByRangeGrouped(userId, start, end, timezone),
        Transcript.findByRangeGrouped(userId, start, end, timezone),
    ]);

    const dailyData: { [date: string]: any } = {};

    const merge = (items: any[], key: string) => {
        items.forEach(item => {
            const date = item._id;
            if (!dailyData[date]) {
                dailyData[date] = {
                    habits: [],
                    todos: [],
                    reminders: [],
                    emotions: [],
                    transcripts: [],
                };
            }
            dailyData[date][key] = item[key];
        });
    };

    merge(habitsByDay, "habits");
    merge(todosByDay, "todos");
    merge(remindersByDay, "reminders");
    merge(emotionsByDay, "emotions");
    merge(transcriptsByDay, "transcripts");

    // Sort by date ascending
    const sortedDailyData: { [date: string]: any } = {};
    Object.keys(dailyData)
        .sort()
        .forEach(date => {
            sortedDailyData[date] = dailyData[date];
        });

    return sortedDailyData;
};


export const getDailyData = async (
    userId: string,
    day: string,
    timezone?: string
) => {

    const start = day, end = day
    const [
        habits,
        todos,
        emotions,
        transcripts,
    ] = await Promise.all([
        Habit.findByRangeGrouped(userId, start, end, timezone),
        Todo.findCompletedByRangeGrouped(userId, start, end, timezone),
        EmotionalState.findByRangeGrouped(userId, start, end, timezone),
        Transcript.findByRangeGrouped(userId, start, end, timezone),
    ]);


    const dailyData: { [date: string]: any } = {};

    const merge = (items: any[], key: string) => {
        items.forEach(item => {
            const date = item._id;
            if (!dailyData[date]) {
                dailyData[date] = {
                    habits: [],
                    todos: [],
                    emotions: [],
                    transcripts: [],
                };
            }
            dailyData[date][key] = item[key];
        });
    };

    merge(habits, "habits");
    merge(todos, "todos");
    merge(emotions, "emotions");
    merge(transcripts, "transcripts");

    // Sort by date ascending
    const sortedDailyData: { [date: string]: any } = {};
    Object.keys(dailyData)
        .sort()
        .forEach(date => {
            sortedDailyData[date] = dailyData[date];
        });

    return sortedDailyData;
};


export const getTodaysData = async (
    userId: string,
    day: string,
    timezone?: string
) => {
    const start = day, end = day;

    const [
        habits,
        todos,
        upcomingReminders,
        emotions,
        transcripts,
    ] = await Promise.all([
        Habit.findActiveHabitsByUserId(userId),
        Todo.findIncompleteTodoByUserId(userId),
        Reminder.findUpcomingByUserId(userId),
        EmotionalState.findByRangeFlat(userId, start, end, timezone),
        Transcript.findByRangeFlat(userId, start, end, timezone),
    ]);

    // 🔹 Flattened structure
    const dailyData = {
        habits,
        todos,
        reminders: upcomingReminders,
        emotions,
        transcripts,
    };

    return dailyData;
};