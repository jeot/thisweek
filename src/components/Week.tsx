import { useState } from "react";
import GoalList from "./Goals.tsx"
import "./Week.css";

export default function Week({goals, title, onSubmit, onEditing, onGoalDelete}) {

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
      />

    </div>
    )
}
