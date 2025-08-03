using MediatR;
using WorkoutTracker.Application.Commands;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class DeleteExerciseHandler : IRequestHandler<DeleteExerciseCommand, bool>
    {
        private readonly IExerciseRepository _exerciseRepository;

        public DeleteExerciseHandler(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<bool> Handle(DeleteExerciseCommand request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id);
            if (exercise == null)
                throw new NotFoundException($"Exercise with ID {request.Id} was not found.");

            await _exerciseRepository.DeleteAsync(request.Id);
            return true;
        }

    }
}