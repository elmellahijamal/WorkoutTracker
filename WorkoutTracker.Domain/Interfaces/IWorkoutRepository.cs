using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkoutTracker.Domain.Entities;

namespace WorkoutTracker.Domain.Interfaces
{
    public interface IWorkoutRepository
    {
        Task<Workout> GetByIdAsync(int id);
        Task<IEnumerable<Workout>> GetByUserIdAsync(int userId);
        Task<IEnumerable<Workout>> GetAllAsync();
        Task<Workout> AddAsync(Workout workout);
        Task<Workout> UpdateAsync(Workout workout);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

}
