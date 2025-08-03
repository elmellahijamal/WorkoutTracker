using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Interfaces;
using WorkoutTracker.Domain.Exceptions;

namespace WorkoutTracker.Application.Handlers
{
    public class UpdateExerciseHandler : IRequestHandler<UpdateExerciseCommand, bool>
    {
        private readonly IExerciseRepository _exerciseRepository;

        public UpdateExerciseHandler(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<bool> Handle(UpdateExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id);

            if (exercise == null)
                throw new NotFoundException($"Exercise with ID {request.Id} was not found.");

            exercise.Name = request.Name;
            exercise.Description = request.Description;
            exercise.MuscleGroup = request.MuscleGroup;

            await _exerciseRepository.UpdateAsync(exercise);
            return true;
        }
    }
}
