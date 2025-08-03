using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Infrastructure.Repositories
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly WorkoutTrackerDbContext _context;

        public ExerciseRepository(WorkoutTrackerDbContext context)
        {
            _context = context;
        }

        public async Task<Exercise> GetByIdAsync(int id)
        {
            return await _context.Exercises.FindAsync(id);
        }

        public async Task<IEnumerable<Exercise>> GetAllAsync()
        {
            try
            {
                return await _context.Exercises.ToListAsync();
            }
            catch (Exception ex)
            {
                // Log the exception to see what's happening
                Console.WriteLine($"Error in GetAllAsync: {ex.Message}");
                throw;
            }
        }


        public async Task<IEnumerable<Exercise>> GetByMuscleGroupAsync(MuscleGroup muscleGroup)
        {
            return await _context.Exercises
                .Where(e => e.MuscleGroup == muscleGroup)
                .ToListAsync();
        }

        public async Task<Exercise> AddAsync(Exercise exercise)
        {
            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<Exercise> UpdateAsync(Exercise exercise)
        {
            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync();
            return exercise;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null) return false;

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Exercises.AnyAsync(e => e.Id == id);
        }
    }
}