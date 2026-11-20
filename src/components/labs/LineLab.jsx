/* Chapter 1 labs: one activity per level, chosen by the level's `mode` (see src/data/content.js). */
import PredictLab from './linear/PredictLab.jsx';
import TwoPointsLab from './linear/TwoPointsLab.jsx';
import MatchLab from './linear/MatchLab.jsx';
import ResidualLab from './linear/ResidualLab.jsx';
import FitLab from './linear/FitLab.jsx';
import NormalLab from './linear/NormalLab.jsx';

const BY_MODE = {
  predict: PredictLab, // 1. What is a prediction?
  twopoints: TwoPointsLab, // 2. Drawing a line
  match: MatchLab, // 3. Slope and intercept
  residuals: ResidualLab, // 4. Measuring the error
  fit: FitLab, // 5. Fit the best line
  normal: NormalLab, // 6. Least squares
};

export default function LineLab(props) {
  const Lab = BY_MODE[props.level.mode] || FitLab;
  return <Lab {...props} />;
}
