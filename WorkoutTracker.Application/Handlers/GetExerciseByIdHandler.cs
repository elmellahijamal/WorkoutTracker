using MediatR;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Exceptions;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class GetExerciseByIdHandler : IRequestHandler<GetExerciseByIdQuery, ExerciseDto>
    {
        private readonly IExerciseRepository _exerciseRepository;

        public GetExerciseByIdHandler(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<ExerciseDto> Handle(GetExerciseByIdQuery request, CancellationToken cancellationToken)
        {
            var exercise = await _exerciseRepository.GetByIdAsync(request.Id);
            if (exercise == null)
                throw new NotFoundException("Exercise not found.");


            return new ExerciseDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                Description = exercise.Description,
                MuscleGroup = exercise.MuscleGroup,
                Sets = 0,
                Reps = 0,
                Weight = null,
                Notes = ""
            };
        }
    }
}