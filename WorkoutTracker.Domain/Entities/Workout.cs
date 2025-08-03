using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkoutTracker.Domain.Entities
{
    public class Workout
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public bool IsCompleted { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }
        public List<WorkoutExercise> WorkoutExercises { get; set; } = new();
    }

}
