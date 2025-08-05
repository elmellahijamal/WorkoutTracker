using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WorkoutTracker.Application.DTOS
{
    public class WorkoutDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public bool IsCompleted { get; set; }
        public int? UserId { get; set; }
        public int? CoachId { get; set; }
        public string? CoachName { get; set; }
        public List<ExerciseDto> Exercises { get; set; } = new();
    }
}
