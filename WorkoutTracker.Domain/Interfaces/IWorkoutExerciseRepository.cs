using WorkoutTracker.Domain.Entities;

namespace WorkoutTracker.Domain.Interfaces
{
    public interface IWorkoutExerciseRepository
    {
        Task<WorkoutExercise> GetByIdAsync(int id);
        Task<IEnumerable<WorkoutExercise>> GetByWorkoutIdAsync(int workoutId);
        Task<IEnumerable<WorkoutExercise>> GetAllAsync();
        Task<WorkoutExercise> AddAsync(WorkoutExercise workoutExercise);
        Task<WorkoutExercise> UpdateAsync(WorkoutExercise workoutExercise);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}