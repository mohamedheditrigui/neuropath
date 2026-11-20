/* Chapter 6 labs (levels 1–5): one spam-filter activity per level, chosen by the level's `mode`.
   Levels 6–7 (overfitting, cross-validation) use OverfitLab. */
import SplitLab from './metrics/SplitLab.jsx';
import ConfusionLab from './metrics/ConfusionLab.jsx';
import PrecisionLab from './metrics/PrecisionLab.jsx';
import RecallLab from './metrics/RecallLab.jsx';
import CurveLab from './metrics/CurveLab.jsx';

const BY_MODE = {
  split: SplitLab, // 1. Train and test
  confusion: ConfusionLab, // 2. Accuracy
  precision: PrecisionLab, // 3. Precision
  recall: RecallLab, // 4. Recall and F1
  curve: CurveLab, // 5. The precision–recall trade-off
};

export default function MetricsLab(props) {
  const Lab = BY_MODE[props.level.mode] || CurveLab;
  return <Lab {...props} />;
}
