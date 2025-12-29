import React, { useState, useEffect, useMemo } from "react";
import {
  Dumbbell,
  Calendar,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  History,
  FileText,
  Info,
  CheckCircle2,
  RefreshCw,
  Clock,
  Calculator,
  X,
  Lightbulb,
  ArrowUpCircle,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  Copy,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- DATA STRUCTURES (Fully Populated Weeks 1-12) ---

const BLOCKS = {
  1: { name: "Bloco 1 (Semanas 1-4)", weeks: [1, 2, 3, 4] },
  2: { name: "Bloco 2 (Semanas 5-8)", weeks: [5, 6, 7, 8] },
  3: { name: "Bloco 3 (Semanas 9-12)", weeks: [9, 10, 11, 12] },
};

const DAYS = ["Upper", "Lower", "Push", "Pull", "Legs"];

const createExercise = (
  name,
  sets,
  reps,
  rpe,
  rest,
  warmup,
  note,
  substitutes = []
) => ({
  name,
  sets,
  reps,
  rpe,
  rest,
  warmup,
  note,
  substitutes,
});

const PROGRAM_DATA = {
  1: {
    // Weeks 1-4
    Upper: [
      createExercise(
        "Flat DB Press (Heavy)",
        1,
        "4-6",
        "8-9",
        "~3 min",
        2,
        "Foco na força. Aumente o peso ou reps a cada semana.",
        ["Machine Chest Press", "Weighted Dip"]
      ),
      createExercise(
        "Flat DB Press (Back off)",
        1,
        "8-10",
        "9-10",
        "~3 min",
        0,
        "Foco na conexão mente-músculo. Reduza o peso e foque no alongamento!",
        ["Machine Chest Press", "Weighted Dip"]
      ),
      createExercise(
        "2-Grip Lat Pulldown",
        2,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "1ª série pegada aberta (1.5x ombros), 2ª série supinada (1x ombros).",
        ["2-Grip Pull-up", "Machine Pulldown"]
      ),
      createExercise(
        "Seated DB Shoulder Press",
        2,
        "10-12",
        "9-10",
        "~2 min",
        1,
        "Desça os halteres até o fim, mantenha o tronco ereto.",
        ["Machine Shoulder Press", "Standing DB Arnold Press"]
      ),
      createExercise(
        "Seated Cable Row",
        2,
        "10-12",
        "9-10",
        "~2 min",
        1,
        "Foque em espremer as escápulas. Cotovelos para baixo e para trás. Dropset na última série.",
        ["Incline Chest-Supported DB Row", "Chest-Supported T-Bar Row"]
      ),
      createExercise(
        "A1: EZ Bar Skull Crusher",
        2,
        "12-15",
        "10",
        "0 min",
        1,
        "Arqueie a barra atrás da cabeça, tensão constante.",
        ["Overhead Cable Triceps Extension", "DB French Press"]
      ),
      createExercise(
        "A2: EZ Bar Curl",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Arqueie a barra 'para fora' e não 'para cima'.",
        ["DB Curl", "Cable EZ Curl"]
      ),
    ],
    Lower: [
      createExercise(
        "Hack Squat (Heavy)",
        1,
        "4-6",
        "8-9",
        "~3 min",
        2,
        "Foco na força. Mantenha a forma consistente.",
        ["Machine Squat", "Leg Press"]
      ),
      createExercise(
        "Hack Squat (Back off)",
        1,
        "8-10",
        "8-9",
        "~3 min",
        0,
        "Reduza o peso e controle a negativa.",
        ["Machine Squat", "Leg Press"]
      ),
      createExercise(
        "Seated Hamstring Curl",
        1,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Se possível faça sentado. Dropset na última série.",
        ["Nordic Ham Curl", "Lying Leg Curl"]
      ),
      createExercise(
        "A1: Standing Calf Raise",
        2,
        "10-12",
        "9-10",
        "0 min",
        1,
        "Alongue bem em baixo, não salte.",
        ["Seated Calf Raise", "Leg Press Toe Press"]
      ),
      createExercise(
        "A2: Hanging Leg Raise",
        2,
        "10-12",
        "9-10",
        "~1.5 min",
        1,
        "Joelhos no peito, controle o movimento.",
        ["Roman Chair Crunch", "Reverse Crunch"]
      ),
    ],
    Push: [
      createExercise(
        "Machine Shoulder Press",
        3,
        "8-10",
        "9-10",
        "~2 min",
        2,
        "Tensão constante nos deltoides, sem paragens.",
        ["Seated DB Shoulder Press", "Standing DB Arnold Press"]
      ),
      createExercise(
        "Cable Chest Press",
        2,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "Pode ser feito sentado ou em pé. Dropset na última série.",
        ["Weighted Dip", "Flat DB Press"]
      ),
      createExercise(
        "Triceps Pressdown",
        2,
        "12-15",
        "9-10",
        "~1.5 min",
        1,
        "Foco em espremer o tríceps. Dropset na última série.",
        ["Cable Triceps Kickback", "DB Triceps Kickback"]
      ),
      createExercise(
        "Close-Grip Push Up",
        1,
        "Falha",
        "10",
        "~1.5 min",
        1,
        "Mãos ligeiramente mais fechadas que os ombros.",
        ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"]
      ),
      createExercise(
        "DB Lateral Raise",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Levante para 'fora', não para 'cima'.",
        ["Cable Lateral Raise", "Machine Lateral Raise"]
      ),
    ],
    Pull: [
      createExercise(
        "1-Arm Half-Kneeling Lat Pulldown",
        1,
        "10-12",
        "7-8",
        "~1.5 min",
        1,
        "Peito alto, cotovelo junto ao tronco.",
        ["Cable Lat Pullover", "1-Arm Lat Pull-in"]
      ),
      createExercise(
        "Weighted Pullup",
        3,
        "6-8",
        "9-10",
        "~2 min",
        2,
        "Pegada 1.5x largura dos ombros. Peito na barra.",
        ["Lat Pulldown", "Neutral-Grip Pullup"]
      ),
      createExercise(
        "Pendlay Row",
        2,
        "8-10",
        "9-10",
        "~2 min",
        2,
        "Puxe para o peito inferior, evite momentum.",
        ["T-Bar Row", "Seated Cable Row"]
      ),
      createExercise(
        "Bayesian Cable Curl",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Cotovelo atrás do tronco. Tensão constante.",
        ["DB Incline Curl", "DB Curl"]
      ),
      createExercise(
        "Rope Facepull",
        2,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Puxe cotovelos para cima e para fora. Dropset na última série.",
        ["Reverse Pec Deck", "Reverse Cable Flye"]
      ),
    ],
    Legs: [
      createExercise(
        "Romanian Deadlift",
        2,
        "10-12",
        "8-9",
        "~2 min",
        2,
        "Mantenha a lombar neutra, jogue a anca para trás.",
        ["DB Romanian Deadlift", "45 Hyperextension"]
      ),
      createExercise(
        "Leg Press",
        3,
        "10-12",
        "8-9",
        "~2 min",
        2,
        "Pés largura média. Não arredonde a lombar.",
        ["Goblet Squat", "DB Walking Lunge"]
      ),
      createExercise(
        "Leg Extension",
        1,
        "10-12",
        "9-10",
        "~1.5 min",
        1,
        "Aperte os quadríceps no topo. Dropset na última.",
        ["Goblet Squat", "DB Step-Up"]
      ),
      createExercise(
        "A1: Seated Calf Raise",
        2,
        "12-15",
        "10",
        "0 min",
        1,
        "Alongue bem em baixo.",
        ["Standing Calf Raise", "Leg Press Toe Press"]
      ),
      createExercise(
        "A2: Cable Crunch",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Arredonde as costas ao contrair.",
        ["Machine Crunch", "Plate-Weighted Crunch"]
      ),
    ],
  },
  2: {
    // Weeks 5-8
    Upper: [
      createExercise(
        "2-Grip Pullup",
        2,
        "8-10",
        "9-10",
        "~2 min",
        1,
        "1ª set 1.5x ombros, 2ª set 1.0x ombros.",
        ["Machine Pulldown", "2-Grip Lat Pulldown"]
      ),
      createExercise(
        "Weighted Dip (Heavy)",
        1,
        "6-8",
        "8-9",
        "~3 min",
        2,
        "Cotovelos a 45º, incline o tronco 15º.",
        ["Machine Chest Press", "Flat DB Press"]
      ),
      createExercise(
        "Weighted Dip (Back off)",
        1,
        "10-12",
        "9-10",
        "~3 min",
        0,
        "Cotovelos a 45º, incline o tronco 15º.",
        ["Machine Chest Press", "Flat DB Press"]
      ),
      createExercise(
        "Incline Chest-Supported DB Row",
        2,
        "8-10",
        "9-10",
        "~2 min",
        1,
        "Puxe em direção ao umbigo. Cotovelos ~30º.",
        ["Chest-Supported T-Bar Row", "Seated Cable Row"]
      ),
      createExercise(
        "Standing DB Arnold Press",
        2,
        "8-10",
        "9-10",
        "~2 min",
        1,
        "Comece com palmas para dentro, rode ao subir.",
        ["Machine Shoulder Press", "Seated DB Shoulder Press"]
      ),
      createExercise(
        "A1: DB Incline Curl",
        2,
        "15-20",
        "10",
        "0 min",
        1,
        "Costas no banco, ombros para trás.",
        ["Cable EZ Curl", "EZ Bar Curl"]
      ),
      createExercise(
        "A2: DB French Press",
        2,
        "15-20",
        "10",
        "~1.5 min",
        1,
        "Pode ser feito sentado ou em pé.",
        ["Overhead Cable Triceps Extension", "EZ Bar Skull Crusher"]
      ),
    ],
    Lower: [
      createExercise(
        "Single-Leg Leg Press (Heavy)",
        1,
        "6-8",
        "8-9",
        "~3 min",
        2,
        "Pés altos e largos. Comece com a perna fraca.",
        ["Machine Squat", "Hack Squat"]
      ),
      createExercise(
        "Single-Leg Leg Press (Back off)",
        1,
        "10-12",
        "8-9",
        "~3 min",
        0,
        "Pés altos e largos. Comece com a perna fraca.",
        ["Machine Squat", "Hack Squat"]
      ),
      createExercise(
        "Glute-Ham Raise",
        1,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Mantenha a anca estendida (a direito).",
        ["Nordic Ham Curl", "Lying Leg Curl"]
      ),
      createExercise(
        "A1: Roman Chair Crunch",
        2,
        "12-15",
        "9-10",
        "0 min",
        1,
        "Não balance as pernas. Minimize o balanço.",
        ["Reverse Crunch", "Hanging Leg Raise"]
      ),
      createExercise(
        "A2: Seated Calf Raise",
        2,
        "12-15",
        "9-10",
        "~1.5 min",
        1,
        "Alongue bem em baixo, sem saltar.",
        ["Standing Calf Raise", "Leg Press Toe Press"]
      ),
    ],
    Push: [
      createExercise(
        "Machine Chest Press",
        2,
        "8-10",
        "9-10",
        "~2 min",
        2,
        "Foco em espremer o peitoral.",
        ["Weighted Dip", "Flat DB Press"]
      ),
      createExercise(
        "Seated DB Shoulder Press",
        3,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "Dumbbells até baixo, tronco direito.",
        ["Machine Shoulder Press", "Standing DB Arnold Press"]
      ),
      createExercise(
        "Cable Triceps Kickback",
        2,
        "12-15",
        "9-10",
        "~1.5 min",
        1,
        "Incline-se um pouco, trave o cotovelo atrás. Dropset na última.",
        ["DB Triceps Kickback", "Triceps Pressdown"]
      ),
      createExercise(
        "Close-Grip Push Up",
        1,
        "Falha",
        "10",
        "~1.5 min",
        1,
        "Mãos mais fechadas que ombros. Cotovelos juntos ao corpo.",
        ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"]
      ),
      createExercise(
        "Cable Lateral Raise",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Incline-se para longe do cabo. Foco no deltoide lateral.",
        ["Machine Lateral Raise", "DB Lateral Raise"]
      ),
    ],
    Pull: [
      createExercise(
        "1-Arm Half-Kneeling Lat Pulldown",
        1,
        "10-12",
        "7-8",
        "~1.5 min",
        1,
        "Peito alto, cotovelo junto ao tronco.",
        ["Cable Lat Pullover", "1-Arm Lat Pull-in"]
      ),
      createExercise(
        "T-Bar Row",
        2,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "Esprema as escápulas. Ombros para baixo.",
        ["Seated Cable Row", "Pendlay Row"]
      ),
      createExercise(
        "Lat Pulldown",
        3,
        "8-10",
        "9-10",
        "~2 min",
        2,
        "Puxe cotovelos 'para baixo' e 'para dentro'. Dropset na última.",
        ["Neutral-Grip Lat Pulldown", "Weighted Pullup"]
      ),
      createExercise(
        "Reverse Pec Deck",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Balance o peso para 'fora', não para 'trás'. Dropset na última.",
        ["Reverse Cable Flye", "Rope Facepull"]
      ),
      createExercise(
        "Spider Curl",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Peito no banco inclinado. Dropset na última.",
        ["DB Preacher Curl", "Bayesian Cable Curl"]
      ),
    ],
    Legs: [
      createExercise(
        "DB Bulgarian Split Squat",
        3,
        "10-12",
        "8-9",
        "~2 min",
        2,
        "Comece com a perna mais fraca. Agache fundo.",
        ["Goblet Squat", "Leg Press"]
      ),
      createExercise(
        "DB Romanian Deadlift",
        2,
        "10-12",
        "8-9",
        "~2 min",
        2,
        "Enfatize o alongamento. Não arredonde a lombar.",
        ["Romanian Deadlift", "45 Hyperextension"]
      ),
      createExercise(
        "Goblet Squat",
        1,
        "12-15",
        "9-10",
        "~1.5 min",
        1,
        "Segure o peso no queixo. Joelhos para fora.",
        ["Leg Extension", "Step-Up"]
      ),
      createExercise(
        "A1: Leg Press Toe Press",
        2,
        "15-20",
        "10",
        "0 min",
        1,
        "Empurre até à ponta dos pés, alongue em baixo.",
        ["Standing Calf Raise", "Seated Calf Raise"]
      ),
      createExercise(
        "A2: Machine Crunch",
        2,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Use os abs para mover o peso, não os braços.",
        ["Plate-Weighted Crunch", "Cable Crunch"]
      ),
    ],
  },
  3: {
    // Weeks 9-12
    Upper: [
      createExercise(
        "Machine Chest Press (Heavy)",
        1,
        "4-6",
        "8-9",
        "~3 min",
        2,
        "Foco na força. Aumente carga ou reps.",
        ["Flat DB Press", "Weighted Dip"]
      ),
      createExercise(
        "Machine Chest Press (Back off)",
        1,
        "8-10",
        "9-10",
        "~3 min",
        0,
        "Foco na força. Mantenha a forma.",
        ["Flat DB Press", "Weighted Dip"]
      ),
      createExercise(
        "Machine Pulldown",
        2,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "Cotovelos para baixo e para dentro. Dropset na última.",
        ["2-Grip Lat Pulldown", "Weighted Pullup"]
      ),
      createExercise(
        "Cable Shoulder Press",
        2,
        "12-15",
        "9-10",
        "~2 min",
        1,
        "Cabos até à altura dos ombros. Dropset na última.",
        ["Machine Shoulder Press", "Seated DB Shoulder Press"]
      ),
      createExercise(
        "Helms DB Row",
        2,
        "10-12",
        "9-10",
        "~2 min",
        1,
        "Forma ultra estrita. Cotovelos a 45 graus.",
        ["Chest-Supported T-Bar Row", "Machine Row"]
      ),
      createExercise(
        "A1: Overhead Cable Triceps Ext",
        2,
        "12-15",
        "10",
        "0 min",
        1,
        "Ambos os braços ao mesmo tempo. Resista à negativa.",
        ["EZ Bar Skull Crusher", "DB French Press"]
      ),
      createExercise(
        "A2: Cable EZ Curl",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Foco em espremer os bíceps. Controle a descida.",
        ["EZ Bar Curl", "DB Curl"]
      ),
    ],
    Lower: [
      createExercise(
        "Machine Squat (Heavy)",
        1,
        "4-6",
        "8-9",
        "~3 min",
        2,
        "Foco na força. Adicione carga ou reps.",
        ["Hack Squat", "Leg Press"]
      ),
      createExercise(
        "Machine Squat (Back off)",
        1,
        "8-10",
        "8-9",
        "~3 min",
        0,
        "Reduza o peso, controle a descida.",
        ["Hack Squat", "Leg Press"]
      ),
      createExercise(
        "Nordic Ham Curl",
        1,
        "8-10",
        "10",
        "~1.5 min",
        1,
        "Mantenha a anca estendida.",
        ["Lying Leg Curl", "Glute-Ham Raise"]
      ),
      createExercise(
        "A1: Seated Calf Raise",
        2,
        "10-12",
        "9-10",
        "0 min",
        1,
        "Alongue bem em baixo, sem saltar.",
        ["Standing Calf Raise", "Leg Press Toe Press"]
      ),
      createExercise(
        "A2: Two-Arms Two-Legs Dead Bug",
        2,
        "10-12",
        "9-10",
        "~1.5 min",
        1,
        "Faça devagar. Lombar colada ao chão.",
        ["Reverse Crunch", "Roman Chair Crunch"]
      ),
    ],
    Push: [
      createExercise(
        "Standing DB Arnold Press",
        2,
        "10-12",
        "9-10",
        "~2 min",
        1,
        "Comece palmas para dentro, rode ao subir.",
        ["Seated DB Shoulder Press", "Machine Shoulder Press"]
      ),
      createExercise(
        "Cable Chest Press",
        2,
        "10-12",
        "9-10",
        "~2 min",
        1,
        "Pode fazer sentado ou em pé. Dropset na última.",
        ["Weighted Dip", "Flat DB Press"]
      ),
      createExercise(
        "DB Triceps Kickback",
        2,
        "10-12",
        "9-10",
        "~1.5 min",
        1,
        "Trave o cotovelo atrás do tronco. Dropset na última.",
        ["Triceps Pressdown", "Cable Triceps Kickback"]
      ),
      createExercise(
        "Close-Grip Push Up",
        1,
        "Falha",
        "10",
        "~1.5 min",
        1,
        "Mãos fechadas. O máximo de reps possível!",
        ["Incline Close-Grip Push Up", "Kneeling Modified Push Up"]
      ),
      createExercise(
        "Machine Lateral Raise",
        2,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Foco no deltoide lateral para mover o peso.",
        ["DB Lateral Raise", "Cable Lateral Raise"]
      ),
    ],
    Pull: [
      createExercise(
        "1-Arm Half-Kneeling Lat Pulldown",
        1,
        "10-12",
        "7-8",
        "~1.5 min",
        1,
        "Peito alto, cotovelo junto ao tronco.",
        ["Cable Lat Pullover", "1-Arm Lat Pull-in"]
      ),
      createExercise(
        "Neutral-Grip Lat Pulldown",
        3,
        "8-10",
        "9-10",
        "~2 min",
        2,
        "Puxe cotovelos para baixo. Dropset na última.",
        ["Weighted Pullup", "Lat Pulldown"]
      ),
      createExercise(
        "Meadows Row",
        2,
        "10-12",
        "9-10",
        "~2 min",
        2,
        "Apoie a mão não ativa no joelho. Mantenha a forma.",
        ["Single-Arm DB Row", "Pendlay Row"]
      ),
      createExercise(
        "Inverse Zottman Curl",
        2,
        "10-12",
        "10",
        "~1.5 min",
        1,
        "Martelo a subir, palma para cima a descer. Dropset na última.",
        ["Hammer Curl", "DB Curl"]
      ),
      createExercise(
        "Bent-Over Reverse DB Flye",
        2,
        "15-20",
        "10",
        "~1.5 min",
        1,
        "Conexão com deltoide posterior. Varra para fora.",
        ["Reverse Cable Flye", "Rope Facepull"]
      ),
    ],
    Legs: [
      createExercise(
        "Romanian Deadlift",
        2,
        "10-12",
        "8-9",
        "~2 min",
        2,
        "Mantenha a lombar neutra, anca para trás.",
        ["Romanian Deadlift", "45 Hyperextension"]
      ),
      createExercise(
        "DB Walking Lunge",
        3,
        "8-10",
        "8-9",
        "~2 min",
        2,
        "Passadas médias. Minimize o impulso da perna de trás.",
        ["DB Step-Up", "DB Bulgarian Split Squat"]
      ),
      createExercise(
        "Leg Extension",
        1,
        "12-15",
        "9-10",
        "~1.5 min",
        1,
        "Aperte os quads. Dropset na última.",
        ["Goblet Squat", "DB Step-Up"]
      ),
      createExercise(
        "A1: Standing Calf Raise",
        2,
        "15-20",
        "10",
        "0 min",
        1,
        "Alongue bem em baixo, sem saltar.",
        ["Seated Calf Raise", "Leg Press Toe Press"]
      ),
      createExercise(
        "A2: Plate-Weighted Crunch",
        2,
        "12-15",
        "10",
        "~1.5 min",
        1,
        "Segure anilha ou halter no peito. Esmague!",
        ["Cable Crunch", "Machine Crunch"]
      ),
    ],
  },
};

const getExercisesForDay = (block, day) => {
  if (
    PROGRAM_DATA[block] &&
    PROGRAM_DATA[block][day] &&
    PROGRAM_DATA[block][day].length > 0
  ) {
    return PROGRAM_DATA[block][day];
  }
  return [];
};

const getBlockForWeek = (week) => {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  return 3;
};

// --- LOGIC: SUGGESTION ENGINE ---

const getProgressionSuggestion = (prevSet, targetRepsStr, targetRpeStr) => {
  if (!prevSet || !prevSet.weight || !prevSet.reps) return null;

  const prevReps = parseFloat(prevSet.reps);
  const prevRpe = parseFloat(prevSet.rpe) || 0;

  let maxTargetReps = 0;
  if (
    targetRepsStr.toLowerCase().includes("fail") ||
    targetRepsStr.toLowerCase().includes("falha")
  ) {
    maxTargetReps = 999;
  } else if (targetRepsStr.includes("-")) {
    const parts = targetRepsStr.split("-");
    maxTargetReps = parseFloat(parts[1]);
  } else {
    maxTargetReps = parseFloat(targetRepsStr);
  }

  let maxTargetRpe = 10;
  if (targetRpeStr.includes("-")) {
    const parts = targetRpeStr.split("-");
    maxTargetRpe = parseFloat(parts[1]);
  } else {
    maxTargetRpe = parseFloat(targetRpeStr);
  }

  if (prevReps >= maxTargetReps && maxTargetReps < 999) {
    if (prevRpe > maxTargetRpe + 0.5) {
      return {
        type: "hold",
        msg: "Manter Carga (Melhorar RPE)",
        detail: `Bateu as reps, mas RPE ${prevRpe} foi acima do alvo (${targetRpeStr}).`,
      };
    }
    return {
      type: "increase_weight",
      msg: "Aumentar Carga (+1-2kg)",
      detail: `Você bateu o topo das reps (${prevReps}) com bom RPE.`,
    };
  } else {
    return {
      type: "increase_reps",
      msg: `Tentar +1-2 Reps`,
      detail: `Mantenha a carga e tente chegar em ${Math.min(
        prevReps + 2,
        maxTargetReps
      )} reps.`,
    };
  }
};

// --- NEW COMPONENTS FOR DAILY USE ---

const RestTimer = ({ initialSeconds, isOpen, onClose }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (isOpen) {
      setSeconds(initialSeconds);
      setIsActive(true);
    }
  }, [isOpen, initialSeconds]);

  if (!isOpen) return null;

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const addTime = (amount) => setSeconds((s) => s + amount);

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-5 w-[90%] max-w-sm border border-slate-700">
      <div className="flex flex-col items-center min-w-[80px]">
        <div
          className={`text-3xl font-mono font-bold tracking-wider ${
            seconds === 0 ? "text-red-400 animate-pulse" : "text-white"
          }`}
        >
          {formatTime(seconds)}
        </div>
        <div className="text-[10px] text-slate-400 uppercase font-bold">
          Descanso
        </div>
      </div>

      <div className="flex gap-2 flex-grow justify-center">
        <button
          onClick={() => addTime(-30)}
          className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 hover:bg-slate-700"
        >
          -30s
        </button>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`p-3 rounded-full ${
            isActive ? "bg-amber-500 text-white" : "bg-green-600 text-white"
          } shadow-lg transform active:scale-95 transition-all`}
        >
          {isActive ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
        <button
          onClick={() => addTime(30)}
          className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 hover:bg-slate-700"
        >
          +30s
        </button>
      </div>

      <button
        onClick={onClose}
        className="p-2 text-slate-500 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
};

const GeneralWarmup = ({ day }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const isLegDay = day === "Lower" || day === "Legs";

  const items = [
    {
      id: "cardio",
      label: "Cardio Baixa Intensidade (5-10 min)",
      note: "Elevar batimentos 100-135 BPM",
    },
    {
      id: "ext_rot",
      label: "Rotação Externa de Ombros (15 reps)",
      note: "Cabo ou Elástico",
    },
    {
      id: "arm_sw",
      label: "Balanço de Braços (12 reps)",
      note: "Cruzar peito e abrir",
    },
    ...(isLegDay
      ? [
          {
            id: "leg_sw_fb",
            label: "Balanço de Perna Frente/Trás (12 reps)",
            note: "Cada perna",
          },
          {
            id: "leg_sw_lat",
            label: "Balanço de Perna Lateral (12 reps)",
            note: "Cada perna",
          },
        ]
      : []),
    {
      id: "foam",
      label: "Foam Rolling (Opcional)",
      note: "Quads, Lats, Panturrilhas",
    },
  ];

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = items.every((i) => checkedItems[i.id]);

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 flex justify-between items-center transition-colors ${
          allChecked ? "bg-green-50" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${
              allChecked
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <RefreshCw
              size={18}
              className={!allChecked ? "animate-spin-slow" : ""}
            />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800">Aquecimento Geral</h3>
            <p className="text-xs text-slate-500">
              {allChecked
                ? "Completo! Pronto para treinar."
                : "Prepare o corpo antes de começar."}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronRight className="transform rotate-90 text-slate-400" />
        ) : (
          <ChevronRight className="text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div
                className={`mt-0.5 ${
                  checkedItems[item.id]
                    ? "text-green-500"
                    : "text-slate-300 group-hover:text-slate-400"
                }`}
              >
                {checkedItems[item.id] ? (
                  <CheckSquare size={20} />
                ) : (
                  <Square size={20} />
                )}
              </div>
              <div>
                <div
                  className={`text-sm font-medium ${
                    checkedItems[item.id]
                      ? "text-slate-500 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-xs text-slate-400">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTS ---

const Header = ({ currentWeek, setCurrentWeek }) => (
  <header className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-lg">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Dumbbell className="text-blue-400" />
        <h1 className="text-xl font-bold">Essentials</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
          className="p-1 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
          disabled={currentWeek === 1}
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <span className="block text-xs text-slate-400 uppercase tracking-wider">
            Semana
          </span>
          <span className="text-xl font-bold">{currentWeek}</span>
        </div>
        <button
          onClick={() => setCurrentWeek(Math.min(12, currentWeek + 1))}
          className="p-1 hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
          disabled={currentWeek === 12}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  </header>
);

const WarmupCalculator = ({ warmupSets, onClose }) => {
  const [workWeight, setWorkWeight] = useState("");

  const calculateWarmups = () => {
    const weight = parseFloat(workWeight);
    if (!weight) return [];

    if (warmupSets === 1) {
      return [{ pct: "60%", weight: Math.round(weight * 0.6) }];
    }
    if (warmupSets === 2) {
      return [
        { pct: "50%", weight: Math.round(weight * 0.5) },
        { pct: "70%", weight: Math.round(weight * 0.7) },
      ];
    }
    if (warmupSets >= 3) {
      return [
        { pct: "45%", weight: Math.round(weight * 0.45) },
        { pct: "65%", weight: Math.round(weight * 0.65) },
        { pct: "85%", weight: Math.round(weight * 0.85) },
      ];
    }
    return [];
  };

  const sets = calculateWarmups();

  return (
    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
          <Calculator size={12} /> Calculadora de Aquecimento
        </h4>
        <button onClick={onClose} className="text-slate-400 hover:text-red-500">
          <X size={14} />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs text-slate-500">Carga de Trabalho:</label>
        <input
          type="number"
          value={workWeight}
          onChange={(e) => setWorkWeight(e.target.value)}
          className="w-20 p-1 text-sm border border-slate-300 rounded text-center font-bold"
          placeholder="kg"
          autoFocus
        />
      </div>
      {sets.length > 0 && (
        <div className="flex gap-2">
          {sets.map((set, idx) => (
            <div
              key={idx}
              className="bg-white border border-blue-200 rounded p-2 text-center flex-1 shadow-sm"
            >
              <div className="text-[10px] text-slate-400 font-bold">
                SET {idx + 1}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {set.weight}kg
              </div>
              <div className="text-[10px] text-slate-400">{set.pct}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SuggestionBox = ({ suggestion }) => {
  if (!suggestion) return null;

  const isIncrease = suggestion.type === "increase_weight";

  return (
    <div
      className={`mb-3 p-3 rounded-lg border flex gap-3 ${
        isIncrease
          ? "bg-purple-50 border-purple-200 text-purple-900"
          : "bg-indigo-50 border-indigo-200 text-indigo-900"
      }`}
    >
      <div
        className={`p-2 rounded-full h-fit ${
          isIncrease
            ? "bg-purple-100 text-purple-600"
            : "bg-indigo-100 text-indigo-600"
        }`}
      >
        {isIncrease ? <ArrowUpCircle size={18} /> : <Lightbulb size={18} />}
      </div>
      <div>
        <div className="text-xs font-bold uppercase opacity-70 mb-0.5">
          Sugestão de Progressão
        </div>
        <div className="font-bold text-sm">{suggestion.msg}</div>
        <div className="text-xs opacity-80 mt-1">{suggestion.detail}</div>
      </div>
    </div>
  );
};

const ExerciseCard = ({
  baseExercise,
  day,
  week,
  data,
  onUpdate,
  history,
  onOpenTimer,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);
  const [selectedExerciseName, setSelectedExerciseName] = useState(
    baseExercise.name
  );

  const currentKey = `${week}-${day}-${selectedExerciseName}`;
  const rawData = data[currentKey] || {};

  // Sets Logic
  const currentSets = useMemo(() => {
    if (rawData.sets && Array.isArray(rawData.sets)) {
      if (rawData.sets.length < baseExercise.sets) {
        return [
          ...rawData.sets,
          ...Array(baseExercise.sets - rawData.sets.length).fill({
            weight: "",
            reps: "",
            rpe: "",
          }),
        ];
      }
      return rawData.sets;
    }
    if (rawData.weight) {
      const migrated = [
        { weight: rawData.weight, reps: rawData.reps, rpe: rawData.rpe },
      ];
      return [
        ...migrated,
        ...Array(baseExercise.sets - 1).fill({ weight: "", reps: "", rpe: "" }),
      ];
    }
    return Array(baseExercise.sets).fill({ weight: "", reps: "", rpe: "" });
  }, [rawData, baseExercise.sets]);

  const notes = rawData.notes || "";

  // Previous Week & Suggestion Logic
  const prevWeek = week - 1;
  const prevData =
    prevWeek > 0 ? history[`${prevWeek}-${day}-${selectedExerciseName}`] : null;

  // Find the BEST set from last week to base suggestion on
  const bestPrevSet = useMemo(() => {
    if (!prevData) return null;
    let best = null;
    const candidates = prevData.sets || (prevData.weight ? [prevData] : []);
    candidates.forEach((s) => {
      if (!s.weight || !s.reps) return;
      if (!best || parseFloat(s.weight) > parseFloat(best.weight)) {
        best = s;
      }
    });
    return best;
  }, [prevData]);

  const suggestion = useMemo(() => {
    return getProgressionSuggestion(
      bestPrevSet,
      baseExercise.reps,
      baseExercise.rpe
    );
  }, [bestPrevSet, baseExercise.reps, baseExercise.rpe]);

  const handleSetChange = (index, field, value) => {
    const newSets = [...currentSets];
    newSets[index] = {
      ...(newSets[index] || { weight: "", reps: "", rpe: "" }),
      [field]: value,
    };
    onUpdate(currentKey, { ...rawData, sets: newSets });
  };

  const handleNotesChange = (value) => {
    onUpdate(currentKey, { ...rawData, notes: value, sets: currentSets });
  };

  const copyPreviousData = () => {
    if (!prevData || !prevData.sets) return;
    // Map previous sets to current sets structure
    const newSets = currentSets.map((curr, i) => {
      const prev = prevData.sets[i];
      if (prev && prev.weight && prev.reps) {
        return { ...curr, weight: prev.weight, reps: prev.reps, rpe: "" }; // Clear RPE as it changes
      }
      return curr;
    });
    onUpdate(currentKey, { ...rawData, sets: newSets });
  };

  const parseRestTime = (restStr) => {
    // Extract number from "~3 min" or "~1.5 min"
    const match = restStr.match(/(\d+(\.\d+)?)/);
    if (match) {
      return Math.ceil(parseFloat(match[0]) * 60);
    }
    return 120; // Default 2 min
  };

  const isStarted = currentSets.some((s) => s.weight && s.reps);
  const isCompleted = currentSets.every((s) => s.weight && s.reps);
  const exerciseOptions = [
    baseExercise.name,
    ...(baseExercise.substitutes || []),
  ];

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4 transition-all ${
        isCompleted
          ? "border-l-4 border-l-green-500"
          : isStarted
          ? "border-l-4 border-l-amber-400"
          : "border-l-4 border-l-blue-500"
      }`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-grow mr-2">
            {exerciseOptions.length > 1 ? (
              <div className="relative group">
                <select
                  className="w-full font-bold text-slate-800 text-lg bg-transparent border-b border-dashed border-slate-300 hover:border-blue-500 focus:outline-none appearance-none cursor-pointer pr-6"
                  value={selectedExerciseName}
                  onChange={(e) => setSelectedExerciseName(e.target.value)}
                >
                  {exerciseOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <RefreshCw
                  size={14}
                  className="absolute right-0 top-1.5 text-slate-400 pointer-events-none"
                />
              </div>
            ) : (
              <h3 className="font-bold text-slate-800 text-lg">
                {baseExercise.name}
              </h3>
            )}

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wide text-slate-500 mt-2">
              <span className="bg-slate-100 px-2 py-1 rounded flex items-center">
                {baseExercise.sets} Séries
              </span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                Alvo: {baseExercise.reps}
              </span>
              <span className="bg-slate-100 px-2 py-1 rounded">
                RPE: {baseExercise.rpe}
              </span>
              <button
                onClick={() => onOpenTimer(parseRestTime(baseExercise.rest))}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer border border-blue-200"
              >
                <Clock size={10} /> {baseExercise.rest}
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${
              showHistory ? "text-blue-600 bg-blue-50" : "text-slate-400"
            }`}
          >
            <TrendingUp size={20} />
          </button>
        </div>

        {/* Suggestion Box */}
        <SuggestionBox suggestion={suggestion} />

        {/* Previous Week Context (Small) */}
        {prevData && !suggestion && (
          <div className="bg-amber-50 border border-amber-100 rounded-md p-2 mb-3 text-sm text-amber-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <History size={14} />
              <span>
                <strong>Semana Anterior:</strong>{" "}
                {bestPrevSet
                  ? `${bestPrevSet.weight}kg x ${bestPrevSet.reps}`
                  : "Dados incompletos"}
              </span>
            </div>
            {/* Quick Fill Button */}
            {!isStarted && (
              <button
                onClick={copyPreviousData}
                className="p-1.5 bg-white rounded border border-amber-200 text-amber-600 hover:bg-amber-100 flex items-center gap-1 text-xs font-bold shadow-sm"
                title="Copiar dados da semana anterior"
              >
                <Copy size={12} /> Copiar
              </button>
            )}
          </div>
        )}

        {/* Warmup Section */}
        {baseExercise.warmup > 0 && (
          <div className="mb-4">
            {!showWarmup ? (
              <button
                onClick={() => setShowWarmup(true)}
                className="text-xs font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md"
              >
                <Calculator size={12} />
                Ver Aquecimento ({baseExercise.warmup} séries)
              </button>
            ) : (
              <WarmupCalculator
                warmupSets={baseExercise.warmup}
                onClose={() => setShowWarmup(false)}
              />
            )}
          </div>
        )}

        {/* Input Rows */}
        <div className="space-y-2 mb-4">
          {currentSets.map((set, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-6 flex-shrink-0 flex justify-center">
                <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 flex-grow">
                <div className="relative">
                  {idx === 0 && (
                    <label className="absolute -top-4 left-0 text-[9px] font-bold text-slate-400 uppercase">
                      Carga (kg)
                    </label>
                  )}
                  <input
                    type="number"
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-1 text-center font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={set.weight || ""}
                    onChange={(e) =>
                      handleSetChange(idx, "weight", e.target.value)
                    }
                  />
                </div>
                <div className="relative">
                  {idx === 0 && (
                    <label className="absolute -top-4 left-0 text-[9px] font-bold text-slate-400 uppercase">
                      Reps
                    </label>
                  )}
                  <input
                    type="number"
                    placeholder="-"
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-1 text-center font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={set.reps || ""}
                    onChange={(e) =>
                      handleSetChange(idx, "reps", e.target.value)
                    }
                  />
                </div>
                <div className="relative">
                  {idx === 0 && (
                    <label className="absolute -top-4 left-0 text-[9px] font-bold text-slate-400 uppercase">
                      RPE
                    </label>
                  )}
                  <input
                    type="number"
                    placeholder="-"
                    className={`w-full border border-slate-200 rounded py-1.5 px-1 text-center font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none ${
                      set.rpe >= 9 ? "bg-red-50 text-red-600" : "bg-slate-50"
                    }`}
                    value={set.rpe || ""}
                    onChange={(e) =>
                      handleSetChange(idx, "rpe", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <textarea
            rows="1"
            placeholder="Notas pessoais..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-600"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
          />
        </div>

        {showHistory && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">
              Evolução de Carga (Melhor Série)
            </h4>
            <HistoryChart
              exerciseName={selectedExerciseName}
              history={history}
              currentWeek={week}
              day={day}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- CHART COMPONENT ---

const HistoryChart = ({ exerciseName, history, currentWeek, day }) => {
  const data = useMemo(() => {
    const points = [];
    for (let i = Math.max(1, currentWeek - 5); i <= currentWeek; i++) {
      const key = `${i}-${day}-${exerciseName}`;
      const entry = history[key];

      if (entry) {
        let bestWeight = 0;
        let bestReps = 0;

        if (entry.sets && Array.isArray(entry.sets)) {
          entry.sets.forEach((s) => {
            const w = parseFloat(s.weight) || 0;
            if (w > bestWeight) {
              bestWeight = w;
              bestReps = parseFloat(s.reps) || 0;
            }
          });
        } else if (entry.weight) {
          bestWeight = parseFloat(entry.weight);
          bestReps = parseFloat(entry.reps);
        }

        if (bestWeight > 0) {
          points.push({
            week: `Sem ${i}`,
            weight: bestWeight,
            reps: bestReps,
          });
        }
      }
    }
    return points;
  }, [history, currentWeek, day, exerciseName]);

  if (data.length < 2)
    return (
      <p className="text-xs text-slate-400 italic">
        Dados insuficientes para gráfico.
      </p>
    );

  return (
    <div className="h-32 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            labelStyle={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "#64748b",
            }}
            formatter={(value, name) => [
              name === "weight" ? `${value}kg` : value,
              name === "weight" ? "Carga" : "Reps",
            ]}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: "#3b82f6" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- MAIN APP ---

const EssentialsTracker = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [activeDay, setActiveDay] = useState("Upper");
  const [workoutData, setWorkoutData] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerOpen, setTimerOpen] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("essentials_program_data_v2");
    if (saved) {
      setWorkoutData(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "essentials_program_data_v2",
        JSON.stringify(workoutData)
      );
    }
  }, [workoutData, loaded]);

  const updateExerciseData = (key, data) => {
    setWorkoutData((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const openTimer = (seconds) => {
    setTimerSeconds(seconds);
    setTimerOpen(true);
  };

  const blockId = getBlockForWeek(currentWeek);
  const currentExercises = getExercisesForDay(blockId, activeDay);
  const blockInfo = BLOCKS[blockId];

  const calculateProgress = () => {
    if (currentExercises.length === 0) return 0;
    let startedCount = 0;

    currentExercises.forEach((ex) => {
      const possibleKeys = [ex.name, ...(ex.substitutes || [])];
      const hasData = possibleKeys.some((name) => {
        const key = `${currentWeek}-${activeDay}-${name}`;
        const entry = workoutData[key];
        return (
          entry && entry.sets && entry.sets.some((s) => s.weight && s.reps)
        );
      });
      if (hasData) startedCount++;
    });
    return Math.round((startedCount / currentExercises.length) * 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Header currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />

      <main className="max-w-4xl mx-auto p-4">
        {/* Block Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            {blockInfo.name}
          </div>
          <div className="text-xs font-bold text-slate-400">
            {calculateProgress()}% INICIADO
          </div>
        </div>

        {/* Day Tabs */}
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 no-scrollbar">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                activeDay === day
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* General Warmup Section (New) */}
        <GeneralWarmup day={activeDay} />

        {/* Exercises List */}
        <div className="space-y-4">
          {currentExercises.length > 0 ? (
            currentExercises.map((exercise, index) => (
              <ExerciseCard
                key={`${currentWeek}-${activeDay}-${index}`}
                baseExercise={exercise}
                day={activeDay}
                week={currentWeek}
                data={workoutData}
                onUpdate={updateExerciseData}
                history={workoutData}
                onOpenTimer={openTimer}
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>Exercícios para {blockInfo.name} carregados!</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
          <Info className="flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold mb-1">Dica de RPE:</p>
            <p className="opacity-90 text-xs">
              RPE 10: Falha total.
              <br />
              RPE 9: Sobra 1 repetição.
              <br />
              RPE 8: Sobram 2 repetições.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Timer (Global) */}
      <RestTimer
        initialSeconds={timerSeconds}
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
      />

      {/* Floating Save Indicator (Auto-save) */}
      <div className="fixed bottom-6 right-6 bg-white p-3 rounded-full shadow-xl border border-slate-100 text-green-500 animate-pulse flex items-center gap-2 z-40">
        <CheckCircle2 size={16} />
        <span className="text-xs font-bold">Salvo</span>
      </div>
    </div>
  );
};

export default EssentialsTracker;
