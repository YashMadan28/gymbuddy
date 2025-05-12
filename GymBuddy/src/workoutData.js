export const workoutData = {
    splits: [
        {
          name: "Upper/Lower Split",
          days: [
            {
              dayName: "Day 1: Upper Body",
              focus: "Chest, Shoulders, Triceps",
              exercises: ["Bench Press", "Overhead Press", "Tricep Pushdowns"],
            },
            {
              dayName: "Day 2: Lower Body",
              focus: "Legs, Glutes",
              exercises: ["Squats", "Deadlifts", "Leg Press"],
            },
          ],
        },
        {
          name: "Push/Pull/Legs Split",
          days: [
            {
              dayName: "Push Day",
              focus: "Chest, Shoulders, Triceps",
              exercises: [
                "Bench Press",
                "Dumbell Fly",
                "Incline Bench Press",
                "Shoulder Press",
                "Tricep Extensions",
              ],
            },
            {
              dayName: "Pull Day",
              focus: "Chest Shoulders, Triceps",
              exercises: [
                "Incline Dumbbell Press",
                "Lat Pulldown",
                "Cable Crossovers",
                "Bicep Curls",
                "Deadlift",
              ],
            },
            {
              dayName: "Leg Day",
              focus: "Quads, Hamstrings, Glutes",
              exercises: ["Leg Extentions", "Romanian Deadlifts", "Calf Raises"],
            },
          ],
        },
      ],
      muscleGroups: [
        {
          groupName: "Chest",
          exercises: [
            "Push-ups",
            "Cable Flyes",
            "Dumbbell Press",
            "Decline Bench Press",
          ],
        },
        {
          groupName: "Back",
          exercises: ["Pull-ups", "Lat Pulldowns", "Face Pulls", "Deadlifts"],
        },
        {
          groupName: "Legs",
          exercises: ["Leg Extensions", "Leg Press", "Walking Lunges", "Squats"],
        },
        {
          groupName: "Shoulders",
          exercises: [
            "Dumbell Lateral Raise",
            "Dumbell Shoulder Press",
            "Face Pull",
            "Rear Delt Flys",
          ],
        },
        {
          groupName: "Arms",
          exercises: [
            "Hammer Curl",
            "Cable Curl",
            "Tricep Pulldown",
            "Skull Crushers",
          ],
        },
      ],
}