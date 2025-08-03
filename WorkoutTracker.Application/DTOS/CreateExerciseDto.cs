using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkoutTracker.Application.DTOS
{
    public class CreateExerciseDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string MuscleGroup { get; set; }
    }
}
