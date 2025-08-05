using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Domain.Entities;

namespace WorkoutTracker.Infrastructure
{
    public class WorkoutTrackerDbContext : DbContext
    {
        public WorkoutTrackerDbContext(DbContextOptions<WorkoutTrackerDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Role).HasConversion<int>();
            });

            modelBuilder.Entity<Exercise>()
                .Property(e => e.MuscleGroup)
                .HasConversion<int>();

            modelBuilder.Entity<Workout>(entity =>
            {
                entity.HasOne(w => w.User)
                    .WithMany(u => u.Workouts)
                    .HasForeignKey(w => w.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(w => w.AssignedByCoach)
                    .WithMany()
                    .HasForeignKey(w => w.AssignedByCoachId)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<WorkoutExercise>(entity =>
            {
                entity.HasOne(we => we.Workout)
                    .WithMany(w => w.WorkoutExercises)
                    .HasForeignKey(we => we.WorkoutId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(we => we.Exercise)
                    .WithMany()
                    .HasForeignKey(we => we.ExerciseId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}