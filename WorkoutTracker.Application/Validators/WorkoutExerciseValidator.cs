using FluentValidation;
using WorkoutTracker.Application.Commands;

namespace WorkoutTracker.Application.Validators
{
    public class AddExerciseToWorkoutCommandValidator : AbstractValidator<AddExerciseToWorkoutCommand>
    {
        public AddExerciseToWorkoutCommandValidator()
        {
            RuleFor(x => x.ExerciseId).GreaterThan(0).WithMessage("Valid exercise ID is required");
            RuleFor(x => x.Sets).GreaterThan(0).WithMessage("Sets must be greater than 0").LessThanOrEqualTo(20);
            RuleFor(x => x.Reps).GreaterThan(0).WithMessage("Reps must be greater than 0").LessThanOrEqualTo(500);
            RuleFor(x => x.Weight).GreaterThanOrEqualTo(0).When(x => x.Weight.HasValue).WithMessage("Weight cannot be negative");
            RuleFor(x => x.Notes).MaximumLength(500).WithMessage("Notes cannot exceed 500 characters");
        }
    }

    public class UpdateWorkoutExerciseCommandValidator : AbstractValidator<UpdateWorkoutExerciseCommand>
    {
        public UpdateWorkoutExerciseCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid workout exercise ID is required");
            RuleFor(x => x.Sets).GreaterThan(0).WithMessage("Sets must be greater than 0").LessThanOrEqualTo(20);
            RuleFor(x => x.Reps).GreaterThan(0).WithMessage("Reps must be greater than 0").LessThanOrEqualTo(500);
            RuleFor(x => x.Weight).GreaterThanOrEqualTo(0).When(x => x.Weight.HasValue).WithMessage("Weight cannot be negative");
            RuleFor(x => x.Notes).MaximumLength(500).WithMessage("Notes cannot exceed 500 characters");
        }
    }
}