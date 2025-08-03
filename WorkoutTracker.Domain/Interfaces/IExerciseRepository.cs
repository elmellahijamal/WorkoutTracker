using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Domain.Interfaces
{
    public interface IExerciseRepository
    {
        Task<Exercise> GetByIdAsync(int id);
        Task<IEnumerable<Exercise>> GetAllAsync();
        Task<IEnumerable<Exercise>> GetByMuscleGroupAsync(MuscleGroup muscleGroup);
        Task<Exercise> AddAsync(Exercise exercise);
        Task<Exercise> UpdateAsync(Exercise exercise);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

}
