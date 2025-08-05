using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkoutTracker.Application.DTOs;

namespace WorkoutTracker.Application.Commands
{
    public class CreateWorkoutCommand : IRequest<int>
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public int CoachId { get; set; }

        public List<AddExerciseToWorkoutDto> Exercises { get; set; } = new();
    }

}
