/* Chapter 2 labs: one activity per level, chosen by the level's `mode` (see src/data/content.js). */
import FeaturesLab from './multi/FeaturesLab.jsx';
import ReadLab from './multi/ReadLab.jsx';
import ScaleLab from './multi/ScaleLab.jsx';
import PlaneLab from './multi/PlaneLab.jsx';
import OneHotLab from './multi/OneHotLab.jsx';

const BY_MODE = {
  features: FeaturesLab, // 1. More than one feature
  read: ReadLab, // 2. Reading coefficients
  scale: ScaleLab, // 3. Feature scaling
  plane: PlaneLab, // 4. Planes, not lines
  balcony: OneHotLab, // 5. Yes/no features
};

export default function MultiLab(props) {
  const Lab = BY_MODE[props.level.mode] || PlaneLab;
  return <Lab {...props} />;
}
