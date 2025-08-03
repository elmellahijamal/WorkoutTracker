using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WorkoutTracker.Domain.ValueObjects;

namespace WorkoutTracker.Application.Commands
{
    public class CreateExerciseCommand : IRequest<int>
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public MuscleGroup MuscleGroup { get; set; }
    }
}
