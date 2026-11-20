/* Chapter 4: Logistic Regression. Running example: will a student pass (1) or fail (0)? */
export default [
  // 1. From numbers to yes/no
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'So far the label was a number. Many questions have a yes/no answer instead: will this student pass? Is this email spam? Will the market go up tomorrow? Predicting a category is **classification**; with two categories it is **binary classification**.',
      ],
      [
        'p',
        'We write the two classes as y = 1 (positive: pass, spam, up) and y = 0 (negative). "Positive" just means "the class we are looking for", not "good".',
      ],
      ['h', 'The simplest classifier: a cut-off'],
      ['f', 'predict 1 if x ≥ t, else 0', 'One feature, one threshold t.'],
      [
        'ex',
        'Finding a good cut-off',
        [
          'Hours studied and results: 1 h fail, 2 h fail, 3 h fail, 4 h pass, 5 h fail, 6 h pass, 7 h pass, 8 h pass.',
          'Cut-off t = 4: predicts fail for 1–3 h and pass for 4–8 h. Only the 5-hour student is wrong: 7 / 8 = 87.5% correct.',
          'Cut-off t = 7: the 4-hour and 6-hour students are now predicted to fail: 6 / 8 = 75%. So t = 4 is better here.',
        ],
      ],
      ['h', 'Why not use linear regression?'],
      [
        'p',
        'A line fitted to 0/1 labels predicts values like −0.3 or 1.4, which are not valid answers, and a single extreme point (someone who studied 30 hours) tilts the whole line and moves the cut-off. Logistic regression (next level) fixes both problems.',
      ],
      [
        'warn',
        'Never encode more than two classes as 0, 1, 2 and run a regression on them: it assumes an order and equal spacing between classes that usually do not exist.',
      ],
    ],
    recap: [
      'Classification predicts a category; binary means two classes, coded 1 and 0.',
      'A cut-off on one feature is the simplest classifier.',
      'Linear regression is a poor fit for 0/1 labels.',
    ],
    quiz: [
      {
        q: 'Which task is a binary classification?',
        o: [
          'Predicting a house price',
          'Predicting if a transaction is fraud or not',
          'Predicting tomorrow’s temperature',
          'Grouping customers without labels',
        ],
        a: 1,
        why: 'Fraud / not fraud has exactly two classes.',
      },
      {
        q: 'With the rule "pass if hours ≥ 5", a student who studied 4 hours is predicted to…',
        o: ['pass', 'fail', 'score 4', 'be undecided'],
        a: 1,
        why: '4 is below the cut-off 5, so the prediction is the negative class.',
      },
      {
        q: 'Why is a straight line a poor model for 0/1 labels?',
        o: [
          'It is too slow',
          'It can predict values below 0 or above 1',
          'It needs more features',
          'It cannot be trained',
        ],
        a: 1,
        why: 'A line is unbounded, but a class probability must stay between 0 and 1.',
      },
    ],
  },
  // 2. The sigmoid curve
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'Logistic regression keeps a linear score but passes it through a squashing function, the **sigmoid**, so the output always lies between 0 and 1 and reads as a probability.',
      ],
      [
        'f',
        'z = w·x + b      p = σ(z) = 1 / (1 + e⁻ᶻ)',
        'z can be any number; p = σ(z) is the probability of class 1.',
      ],
      [
        'list',
        [
          'σ(0) = 0.5: a score of zero means "fifty-fifty".',
          'Large positive z → p close to 1. Large negative z → p close to 0.',
          'The curve is an S: steep around z = 0, flat at both ends.',
        ],
      ],
      [
        'ex',
        'Computing a few probabilities',
        [
          'Model: z = 1.2 × hours − 5.',
          '2 hours: z = −2.6 → p = 1 / (1 + e²·⁶) ≈ 1 / 14.5 ≈ 0.07.',
          '4 hours: z = −0.2 → p ≈ 0.45. Almost a coin flip.',
          '6 hours: z = 2.2 → p ≈ 0.90.',
          'The weight w = 1.2 sets how steep the S is; the bias moves where it crosses 0.5 (here at hours = 5 / 1.2 ≈ 4.2).',
        ],
      ],
      [
        'go',
        'The score z is the **log-odds**: z = ln(p / (1 − p)). So each extra hour multiplies the odds of passing by e^w = e¹·² ≈ 3.3. This is how doctors and economists read logistic regression weights.',
      ],
      [
        'warn',
        'A probability of 0.9 is not a promise. Among many students the model gives 0.9, about 1 in 10 should still fail if the model is well calibrated.',
      ],
    ],
    recap: [
      'Logistic regression: a linear score z, then p = σ(z) = 1 / (1 + e⁻ᶻ).',
      'σ maps any number into (0, 1) and σ(0) = 0.5.',
      'The weight controls the steepness, the bias shifts the curve.',
    ],
    quiz: [
      { q: 'What is σ(0)?', o: ['0', '0.5', '1', 'e'], a: 1, why: '1 / (1 + e⁰) = 1 / 2.' },
      {
        q: 'The score z is very negative. The predicted probability is…',
        o: ['close to 1', 'close to 0', 'exactly 0.5', 'negative'],
        a: 1,
        why: 'e⁻ᶻ is huge, so 1 / (1 + e⁻ᶻ) is close to 0.',
      },
      {
        q: 'z = 2·hours − 6. At how many hours is the probability exactly 0.5?',
        o: ['2', '3', '6', '12'],
        a: 1,
        why: 'p = 0.5 when z = 0: 2·hours = 6, so hours = 3.',
      },
    ],
  },
  // 3. Probability and threshold
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'The model outputs a probability. A decision needs a class, so we compare the probability with a **threshold** τ (tau).',
      ],
      ['f', 'ŷ = 1 if p ≥ τ, else 0', 'τ = 0.5 by default, but it is a choice, not a law.'],
      [
        'ex',
        'One model, two thresholds',
        [
          'Four students get probabilities 0.92, 0.61, 0.48 and 0.15.',
          'τ = 0.5: predictions pass, pass, fail, fail.',
          'τ = 0.4: the 0.48 student is now predicted to pass. Lower threshold = more positives.',
          'τ = 0.7: only the 0.92 student passes. Higher threshold = fewer, more confident positives.',
        ],
      ],
      ['h', 'Choosing the threshold'],
      [
        'p',
        'The right threshold depends on what a mistake costs. A cancer screening test should rather raise a false alarm than miss a case, so it uses a low threshold. A spam filter should rather let a spam through than hide an important email, so it uses a high threshold. Chapter 6 measures this with precision and recall.',
      ],
      [
        'warn',
        'The threshold is chosen after training, on validation data. Changing τ does not change the model, only how its probabilities are turned into decisions.',
      ],
    ],
    recap: [
      'Class = 1 when the probability reaches the threshold τ.',
      'Lower τ → more positives; higher τ → fewer, surer positives.',
      'Pick τ according to the cost of each kind of mistake.',
    ],
    quiz: [
      {
        q: 'p = 0.62 and τ = 0.7. The prediction is…',
        o: ['positive', 'negative', '0.62', '0.7'],
        a: 1,
        why: '0.62 is below 0.7, so the class is 0.',
      },
      {
        q: 'Lowering the threshold from 0.5 to 0.3 will…',
        o: ['predict more positives', 'predict fewer positives', 'retrain the model', 'change the weights'],
        a: 0,
        why: 'More probabilities clear a lower bar.',
      },
      {
        q: 'For a disease screening test where missing a sick patient is very costly, you would rather use…',
        o: ['a high threshold', 'a low threshold', 'τ = 1', 'no threshold'],
        a: 1,
        why: 'A low threshold flags more people, so fewer sick patients are missed.',
      },
    ],
  },
  // 4. The decision boundary
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'With two features, say hours studied x₁ and hours slept x₂, the score is z = w₁x₁ + w₂x₂ + b. The probability is exactly 0.5 where z = 0, and that set of points is a straight line in the (x₁, x₂) plane: the **decision boundary**.',
      ],
      ['f', 'w₁·x₁ + w₂·x₂ + b = 0', 'One side: z > 0, predicted 1. Other side: z < 0, predicted 0.'],
      [
        'ex',
        'Which side is this student on?',
        [
          'Model: z = 1.0 × study + 0.5 × sleep − 6.',
          'Student A: 4 h of study, 6 h of sleep → z = 4 + 3 − 6 = 1 > 0 → pass (p = σ(1) ≈ 0.73).',
          'Student B: 3 h of study, 4 h of sleep → z = 3 + 2 − 6 = −1 < 0 → fail (p ≈ 0.27).',
          'The boundary: study = 6 − 0.5 × sleep. With 8 h of sleep, 2 h of study is enough to sit on the line.',
        ],
      ],
      [
        'p',
        'The weights set the direction of the line and the bias moves it. The bigger the weights, the faster the probability changes as you move away from the line.',
      ],
      [
        'go',
        'Logistic regression always draws a straight boundary (a hyperplane with more features). Your SVM project also separates "up" days from "down" days with a hyperplane, but it places it to maximise the margin to the nearest points instead of maximising a likelihood.',
      ],
      [
        'warn',
        'If the classes are arranged in a circle or a spiral, no straight boundary separates them. You then need new features (x₁², x₁·x₂…) or another model, such as KNN in chapter 5.',
      ],
    ],
    recap: [
      'The decision boundary is where z = 0 (p = 0.5).',
      'For logistic regression it is a straight line, or a hyperplane.',
      'Non-linear patterns need extra features or other models.',
    ],
    quiz: [
      {
        q: 'z = 2·x₁ − x₂ − 1. Is the point (1, 0) predicted positive?',
        o: ['Yes, z = 1 > 0', 'No, z = −1', 'It is on the boundary', 'It cannot be computed'],
        a: 0,
        why: '2 × 1 − 0 − 1 = 1 > 0.',
      },
      {
        q: 'What probability does the model give to points exactly on the decision boundary?',
        o: ['0', '0.5', '1', 'It depends on the point'],
        a: 1,
        why: 'On the boundary z = 0, and σ(0) = 0.5.',
      },
      {
        q: 'What shape is the decision boundary of logistic regression with two raw features?',
        o: ['A circle', 'A straight line', 'A spiral', 'Any shape'],
        a: 1,
        why: 'z = w₁x₁ + w₂x₂ + b = 0 is the equation of a line.',
      },
    ],
  },
  // 5. Log loss
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'To train logistic regression we need a loss that measures how good the **probabilities** are. MSE is a poor choice here: combined with the sigmoid it gives a bumpy, non-convex landscape. The standard choice is **log loss** (binary cross-entropy).',
      ],
      [
        'f',
        'L = −(1/n) Σ [ yᵢ·ln(pᵢ) + (1 − yᵢ)·ln(1 − pᵢ) ]',
        'Only one of the two terms is active for each example.',
      ],
      [
        'list',
        [
          'If y = 1, the cost is −ln(p): small when p is near 1.',
          'If y = 0, the cost is −ln(1 − p): small when p is near 0.',
          'Confident mistakes are punished without limit: −ln(p) → ∞ as p → 0.',
        ],
      ],
      [
        'ex',
        'What each prediction costs',
        [
          'A student who passed (y = 1), predicted p = 0.9: cost −ln(0.9) ≈ 0.11.',
          'Same student, predicted p = 0.6: cost −ln(0.6) ≈ 0.51. Correct side, but unsure: it costs more.',
          'A student who failed (y = 0), predicted p = 0.99: cost −ln(0.01) ≈ 4.6, forty times the first case.',
        ],
      ],
      [
        'p',
        'Log loss with the sigmoid is **convex**, so gradient descent finds the single best (w, b). It also comes from statistics: minimising it is the same as maximising the likelihood of the observed labels.',
      ],
      [
        'warn',
        'Accuracy cannot be used as a training loss: it only changes when a point crosses the threshold, so its gradient is zero almost everywhere. Train on log loss, report accuracy.',
      ],
    ],
    recap: [
      'Log loss = −average of y·ln(p) + (1 − y)·ln(1 − p).',
      'Confident wrong predictions cost the most.',
      'With the sigmoid it is convex, so training finds the best weights.',
    ],
    quiz: [
      {
        q: 'y = 1 and p = 1. What is the log loss for this example?',
        o: ['0', '1', '∞', '0.5'],
        a: 0,
        why: '−ln(1) = 0: a perfect, confident prediction costs nothing.',
      },
      {
        q: 'Which prediction costs the most?',
        o: ['p = 0.55 for a positive', 'p = 0.02 for a positive', 'p = 0.3 for a negative', 'p = 0.5 for a negative'],
        a: 1,
        why: '−ln(0.02) ≈ 3.9 is the largest: confident and wrong.',
      },
      {
        q: 'Why not train logistic regression directly on accuracy?',
        o: [
          'Accuracy is too slow to compute',
          'Its gradient is zero almost everywhere',
          'Accuracy is always 1',
          'It is not allowed',
        ],
        a: 1,
        why: 'Accuracy jumps in steps, so small weight changes give no slope to follow.',
      },
    ],
  },
  // 6. Train a classifier
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'Everything comes together: a model (sigmoid of a linear score), a loss (log loss) and an optimiser (gradient descent from chapter 3). The recipe is the same as for linear regression; only the model and the loss change.',
      ],
      [
        'f',
        '∂L/∂w = (1/n) Σ (pᵢ − yᵢ)·xᵢ      ∂L/∂b = (1/n) Σ (pᵢ − yᵢ)',
        'The same shape as the linear regression gradient: error times feature.',
      ],
      [
        'ex',
        'One gradient step by hand',
        [
          'Two students: (2 h, failed) and (6 h, passed). Start with w = 0, b = 0, so both get p = 0.5.',
          'Errors p − y: 0.5 − 0 = 0.5 and 0.5 − 1 = −0.5.',
          '∂L/∂w = (0.5 × 2 + (−0.5) × 6) / 2 = (1 − 3) / 2 = −1. ∂L/∂b = (0.5 − 0.5) / 2 = 0.',
          'With η = 0.5: w ← 0 − 0.5 × (−1) = 0.5, b stays 0. New probabilities: σ(1) ≈ 0.73 and σ(3) ≈ 0.95. The 6-hour student moved the right way; the 2-hour one will be fixed by the bias in later steps.',
        ],
      ],
      [
        'list',
        [
          'Scale the features first, exactly as for linear regression.',
          'Watch the log loss go down; stop when it flattens.',
          'Then choose the threshold and measure accuracy on test data.',
        ],
      ],
      [
        'go',
        'With many features, add an L2 penalty λ‖w‖² to the loss to keep weights small and avoid overfitting. This is the same idea as the penalisation in your least-squares course and is on by default in scikit-learn’s LogisticRegression.',
      ],
      [
        'warn',
        'If the training data is perfectly separable, plain logistic regression keeps growing the weights forever (the loss never reaches 0). Regularisation or early stopping keeps them finite.',
      ],
    ],
    recap: [
      'Model + loss + optimiser: sigmoid, log loss, gradient descent.',
      'Gradient = average of (p − y) × feature, just like linear regression.',
      'Scale features, watch the loss, regularise if needed.',
    ],
    quiz: [
      {
        q: 'What is the gradient of log loss with respect to w (logistic regression)?',
        o: ['(1/n) Σ (pᵢ − yᵢ)·xᵢ', '(1/n) Σ pᵢ', 'Σ yᵢ²', 'σ(w)'],
        a: 0,
        why: 'Error (p − y) times the feature, averaged over the examples.',
      },
      {
        q: 'p = 0.8 for a student who passed (y = 1). The error p − y is…',
        o: ['0.8', '−0.2', '0.2', '1.8'],
        a: 1,
        why: '0.8 − 1 = −0.2: the prediction is a bit too low.',
      },
      {
        q: 'What does adding λ‖w‖² to the loss do?',
        o: [
          'Makes the weights larger',
          'Keeps the weights small to reduce overfitting',
          'Changes the sigmoid',
          'Removes the bias',
        ],
        a: 1,
        why: 'Large weights are penalised, which gives a smoother, more general model.',
      },
    ],
  },
];
