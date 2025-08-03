using FluentValidation;
using WorkoutTracker.Application.Commands;

namespace WorkoutTracker.Application.Validators
{
    public class CreateExerciseCommandValidator : AbstractValidator<CreateExerciseCommand>
    {
        public CreateExerciseCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Exercise name is required")
                .MaximumLength(100).WithMessage("Exercise name cannot exceed 100 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

            RuleFor(x => x.MuscleGroup)
                .IsInEnum().WithMessage("Valid muscle group is required");
        }

    }
}