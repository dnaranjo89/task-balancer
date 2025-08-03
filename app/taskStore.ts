import { db, completedTasks } from './db'
import { desc, eq } from 'drizzle-orm'
import type { AppState, CompletedTask } from './types/tasks'
import { PEOPLE } from './data/tasks'

export async function getState(): Promise<AppState> {
  try {
    // Get all completed tasks from the database, ordered by completion time (newest first)
    const dbTasks = await db
      .select()
      .from(completedTasks)
      .orderBy(desc(completedTasks.completedAt))

    // Transform database tasks to match our CompletedTask type
    const tasks: CompletedTask[] = dbTasks.map(task => ({
      id: task.id.toString(),
      taskId: task.taskId,
      personName: task.personId, // Using personId as personName for compatibility
      taskName: '', // We'll need to look this up from TASKS if needed
      points: task.points,
      completedAt: task.completedAt
    }))

    // Calculate total points for each person
    const people = PEOPLE.map(name => {
      const personTasks = tasks.filter(task => task.personName === name)
      const totalPoints = personTasks.reduce((sum, task) => sum + task.points, 0)
      return { name, totalPoints }
    })

    return {
      people,
      completedTasks: tasks
    }
  } catch (error) {
    console.error('Error getting state from database:', error)
    // Return empty state if database fails
    return {
      people: PEOPLE.map(name => ({ name, totalPoints: 0 })),
      completedTasks: []
    }
  }
}

export async function completeTask(
  personName: string,
  taskId: string,
  taskName: string,
  points: number
): Promise<CompletedTask> {
  try {
    // Insert into database
    const [insertedTask] = await db.insert(completedTasks).values({
      taskId,
      personId: personName,
      points
    }).returning()

    // Return the completed task
    return {
      id: insertedTask.id.toString(),
      taskId: insertedTask.taskId,
      personName,
      taskName,
      points: insertedTask.points,
      completedAt: insertedTask.completedAt
    }
  } catch (error) {
    console.error('Error completing task in database:', error)
    throw new Error('Failed to save completed task')
  }
}

export async function resetData(): Promise<void> {
  try {
    await db.delete(completedTasks)
  } catch (error) {
    console.error('Error resetting data in database:', error)
    throw new Error('Failed to reset data')
  }
}
