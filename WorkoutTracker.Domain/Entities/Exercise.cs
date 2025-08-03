using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Domain.Entities
{
    public class Exercise
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public MuscleGroup MuscleGroup { get; set; }

        public List<WorkoutExercise> WorkoutExercises { get; set; } = new();
    }

}
