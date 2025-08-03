using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Infrastructure.Repositories
{
    public class WorkoutExerciseRepository : IWorkoutExerciseRepository
    {
        private readonly WorkoutTrackerDbContext _context;

        public WorkoutExerciseRepository(WorkoutTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<WorkoutExercise> GetByIdAsync(int id)
        {
            return await _context.WorkoutExercises
                .Include(we => we.Exercise)
                .Include(we => we.Workout)
                .FirstOrDefaultAsync(we => we.Id == id);
        }

        public async Task<IEnumerable<WorkoutExercise>> GetByWorkoutIdAsync(int workoutId)
        {
            return await _context.WorkoutExercises
                .Include(we => we.Exercise)
                .Where(we => we.WorkoutId == workoutId)
                .ToListAsync();
        }

        public async Task<IEnumerable<WorkoutExercise>> GetAllAsync()
        {
            return await _context.WorkoutExercises
                .Include(we => we.Exercise)
                .Include(we => we.Workout)
                .ToListAsync();
        }

        public async Task<WorkoutExercise> AddAsync(WorkoutExercise workoutExercise)
        {
            _context.WorkoutExercises.Add(workoutExercise);
            await _context.SaveChangesAsync();
            return workoutExercise;
        }

        public async Task<WorkoutExercise> UpdateAsync(WorkoutExercise workoutExercise)
        {
            _context.WorkoutExercises.Update(workoutExercise);
            await _context.SaveChangesAsync();
            return workoutExercise;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var workoutExercise = await _context.WorkoutExercises.FindAsync(id);
            if (workoutExercise == null) return false;

            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.WorkoutExercises.AnyAsync(we => we.Id == id);
        }
    }
}