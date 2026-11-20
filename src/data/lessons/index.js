/* Course text and per-level quizzes, one file per chapter.
   Each lesson: { minutes, blocks, recap, quiz }.
   blocks is a list of [type, ...] with type one of:
     ['p', text]                 paragraph (supports **bold** and `code`)
     ['h', title]                sub-heading
     ['f', formula, caption?]    formula in a dark box
     ['ex', title, [steps]]      worked example with numbered steps
     ['list', [items]]           bullet list
     ['warn', text]              common mistake
     ['go', text]                going further
   quiz: three { q, o: [options], a: index of the right option, why }.
   Sources checked: Google ML Crash Course, Stanford CS229 notes (Ng & Ma), the scikit-learn user guide,
   and the SUP'COM INDP2 optimisation course "Moindres carrés et régression linéaire". */
import linear from './ch1-linear.js';
import multiple from './ch2-multiple.js';
import descent from './ch3-descent.js';
import logistic from './ch4-logistic.js';
import knn from './ch5-knn.js';
import evaluation from './ch6-evaluation.js';

const BY_CHAPTER = [linear, multiple, descent, logistic, knn, evaluation];

/* The lesson for chapter ci, level li (both from 0), or undefined (e.g. the final project steps). */
export const lessonOf = (ci, li) => BY_CHAPTER[ci]?.[li];
