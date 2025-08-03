using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Entities;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class CreateExerciseHandler : IRequestHandler<CreateExerciseCommand, int>
    {
        private readonly IExerciseRepository _exerciseRepository;

        public CreateExerciseHandler(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<int> Handle(CreateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = new Exercise
            {
                Name = request.Name,
                Description = request.Description,
                MuscleGroup = request.MuscleGroup
            };

            var createdExercise = await _exerciseRepository.AddAsync(exercise);
            return createdExercise.Id;
        }
    }
}