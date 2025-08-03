using MediatR;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class GetExercisesHandler : IRequestHandler<GetExercisesQuery, List<ExerciseDto>>
    {
        private readonly IExerciseRepository _exerciseRepository;

        public GetExercisesHandler(IExerciseRepository exerciseRepository)
        {
            _exerciseRepository = exerciseRepository;
        }

        public async Task<List<ExerciseDto>> Handle(GetExercisesQuery request, CancellationToken cancellationToken)
        {
            var exercises = await _exerciseRepository.GetAllAsync();

            return exercises.Select(e => new ExerciseDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                MuscleGroup = e.MuscleGroup,
                Sets = 0,
                Reps = 0,
                Weight = null,
                Notes = ""
            }).ToList();
        }
    }
}