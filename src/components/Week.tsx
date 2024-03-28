import { useState, useEffect } from "react";
import GoalList from "./Goals.tsx"

export default function Week({goals, title, onSubmit, onEditing, onGoalDelete, newGoalEditing}) {

  return (
    <div className="week-container">
      <div className="week-title" dir="auto">
        {title}
      </div>

      <GoalList
        goals={goals}
        onSubmit={onSubmit}
        onEditing={onEditing}
        onGoalDelete={onGoalDelete}
        newGoalEditing={newGoalEditing}
      />
    </div>
    )
}
