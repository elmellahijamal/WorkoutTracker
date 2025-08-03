using MediatR;
using WorkoutTracker.Application.DTOs;
using WorkoutTracker.Application.DTOS;
using WorkoutTracker.Application.Queries;
using WorkoutTracker.Domain.Interfaces;

namespace WorkoutTracker.Application.Handlers
{
    public class GetWorkoutByIdHandler : IRequestHandler<GetWorkoutByIdQuery, WorkoutDto>
    {
        private readonly IWorkoutRepository _workoutRepository;

        public GetWorkoutByIdHandler(IWorkoutRepository workoutRepository)
        {
            _workoutRepository = workoutRepository;
        }

        public async Task<WorkoutDto> Handle(GetWorkoutByIdQuery request, CancellationToken cancellationToken)
        {
            var workout = await _workoutRepository.GetByIdAsync(request.Id);
            if (workout == null) return null;

            return new WorkoutDto
            {
                Id = workout.Id,
                Name = workout.Name,
                Date = workout.Date,
                IsCompleted = workout.IsCompleted,
                UserId = workout.UserId,
                Exercises = workout.WorkoutExercises?.Select(we => new ExerciseDto
                {
                    Id = we.Exercise.Id,
                    Name = we.Exercise.Name,
                    Description = we.Exercise.Description,
                    MuscleGroup = we.Exercise.MuscleGroup,
                    Sets = we.Sets,
                    Reps = we.Reps,
                    Weight = we.Weight,
                    Notes = we.Notes
                }).ToList() ?? new List<ExerciseDto>()
            };
        }
    }
}