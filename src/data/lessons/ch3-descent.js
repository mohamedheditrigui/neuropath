/* Chapter 3: Gradient Descent. Running example: J(w) = (w − 3)², minimum at w = 3. */
export default [
  // 1. The loss landscape
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Least squares has an exact formula, but most models do not: logistic regression, neural networks, even linear regression with millions of features. For all of them we use one general tool: **gradient descent**.',
      ],
      ['h', 'Loss as a landscape'],
      [
        'p',
        'Compute the loss J(w) for every possible value of the weight and plot it: you get a curve, the **loss landscape**. Training means finding the lowest point of that landscape. With two weights the landscape is a surface; with a million weights you cannot draw it, but the idea is the same.',
      ],
      ['f', 'w* = argmin J(w)', '"The weight that makes the loss smallest."'],
      [
        'ex',
        'A tiny landscape',
        [
          'Take J(w) = (w − 3)². At w = 0, J = 9. At w = 2, J = 1. At w = 3, J = 0. At w = 5, J = 4.',
          'The curve is a parabola with its bottom at w = 3: that is the best weight.',
          'Here you can see the answer, but a real model has too many weights to draw. Gradient descent finds the bottom by feeling the slope locally, like walking down a hill in fog.',
        ],
      ],
      [
        'list',
        [
          '**Convex** landscapes (one bowl, like linear and logistic regression) have a single minimum: any good descent finds it.',
          '**Non-convex** landscapes (neural networks) have several valleys: where you start matters.',
        ],
      ],
      [
        'warn',
        'Gradient descent does not see the whole landscape; it only knows the slope where it stands. On non-convex losses it can stop in a local valley that is not the lowest one.',
      ],
    ],
    recap: [
      'The loss landscape shows the loss for every value of the weights.',
      'Training = finding its lowest point.',
      'Gradient descent finds it using only local slope information.',
    ],
    quiz: [
      {
        q: 'For J(w) = (w − 5)², what is the best weight?',
        o: ['0', '5', '25', '−5'],
        a: 1,
        why: 'The square is smallest (0) when w − 5 = 0.',
      },
      {
        q: 'Why do we need gradient descent if we can plot the loss?',
        o: [
          'Plots are inaccurate',
          'Real models have too many weights to plot or search exhaustively',
          'It is more beautiful',
          'We never need it',
        ],
        a: 1,
        why: 'With thousands of weights the landscape cannot be drawn or scanned.',
      },
      {
        q: 'What is special about a convex loss?',
        o: ['It has a single minimum', 'It has no minimum', 'It is always zero', 'It cannot be optimised'],
        a: 0,
        why: 'A convex bowl has one lowest point, so descent cannot get stuck elsewhere.',
      },
    ],
  },
  // 2. Taking a step
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'The **gradient** is the derivative of the loss: J′(w) tells how fast the loss changes when w moves a little. Its sign says which way is uphill. To go down, step in the opposite direction.',
      ],
      ['f', 'w ← w − η · J′(w)', 'η (eta) is the learning rate: the size of the step.'],
      [
        'ex',
        'Three steps on J(w) = (w − 3)² with η = 0.1',
        [
          'The derivative is J′(w) = 2(w − 3).',
          'Start at w = 0: J′ = −6 (negative: downhill is to the right). New w = 0 − 0.1 × (−6) = 0.6.',
          'At w = 0.6: J′ = −4.8 → w = 0.6 + 0.48 = 1.08.',
          'At w = 1.08: J′ = −3.84 → w = 1.464. Each step closes 20% of the gap to 3, and the steps shrink as the slope flattens.',
        ],
      ],
      ['h', 'The gradient of the MSE'],
      ['p', 'For linear regression ŷ = w·x + b with MSE, the derivatives are:'],
      [
        'f',
        '∂J/∂w = −(2/n) Σ xᵢ (yᵢ − ŷᵢ)     ∂J/∂b = −(2/n) Σ (yᵢ − ŷᵢ)',
        'Each point pushes the weights in proportion to its error.',
      ],
      [
        'p',
        'Read it: if predictions are too low (yᵢ − ŷᵢ > 0), the gradient is negative and the update raises w and b. Points with a big error push the hardest.',
      ],
      [
        'warn',
        'Moving **with** the gradient (w + η·J′) climbs the hill. The minus sign is the whole point of the method.',
      ],
    ],
    recap: [
      'The gradient points uphill; the update steps the opposite way.',
      'Update rule: w ← w − η·J′(w).',
      'Steps shrink naturally near the minimum, where the slope is small.',
    ],
    quiz: [
      {
        q: 'At w = 2, J′(w) = 4 and η = 0.5. What is the next w?',
        o: ['0', '2', '4', '−2'],
        a: 0,
        why: 'w − η·J′ = 2 − 0.5 × 4 = 0.',
      },
      {
        q: 'The gradient is negative at the current weight. The update will…',
        o: ['decrease w', 'increase w', 'leave w unchanged', 'stop training'],
        a: 1,
        why: 'w − η × (negative) = w + something: the weight increases.',
      },
      {
        q: 'Why do steps get smaller near the minimum, even with a fixed η?',
        o: ['The data shrinks', 'The gradient gets close to zero', 'η decreases automatically', 'They do not'],
        a: 1,
        why: 'The step is η × gradient, and the slope flattens near the bottom.',
      },
    ],
  },
  // 3. The learning rate
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'The learning rate η is a **hyperparameter**: you choose it, the model does not learn it. It is the most important knob of gradient descent.',
      ],
      [
        'ex',
        'Four learning rates on J(w) = (w − 3)², starting at w = 0',
        [
          'For this loss, each step multiplies the gap (w − 3) by (1 − 2η).',
          'η = 0.01: factor 0.98. Very safe, very slow: about 280 steps to get within 0.01.',
          'η = 0.1: factor 0.8. Smooth and reasonably fast (26 steps for 0.01).',
          'η = 0.5: factor 0. One single step lands exactly on 3: for this quadratic it is the optimal step.',
          'η = 1: factor −1. The weight bounces between 0 and 6 forever. η = 1.1: factor −1.2, the gap grows every step and training explodes.',
        ],
      ],
      [
        'list',
        [
          '**Too small**: correct but painfully slow.',
          '**Just right**: fast, steady decrease of the loss.',
          '**Too big**: overshoots the valley, oscillates or diverges (the loss grows).',
        ],
      ],
      [
        'p',
        'In practice: try values spaced by factors of 10 (0.001, 0.01, 0.1, 1), plot the loss against the steps, and keep the biggest η that still decreases the loss smoothly.',
      ],
      [
        'go',
        'Your INDP2 exercise compares a fixed step with the **optimal step**, which picks η at every iteration by minimising J along the gradient direction (a line search). On a quadratic J(x) = ½xᵀAx − bᵀx it has a closed form: η = (gᵀg) / (gᵀAg), with g the gradient.',
      ],
      [
        'warn',
        'If your loss goes up or becomes NaN after a few steps, the learning rate is almost always too big. Divide it by 10 before suspecting anything else.',
      ],
    ],
    recap: [
      'η sets the step size; it is a hyperparameter you choose.',
      'Too small = slow, too big = oscillation or divergence.',
      'Try values by powers of 10 and watch the loss curve.',
    ],
    quiz: [
      {
        q: 'The loss grows larger at every step. What should you try first?',
        o: ['A bigger learning rate', 'A smaller learning rate', 'More data', 'Fewer features'],
        a: 1,
        why: 'A growing loss is the classic sign of steps that overshoot.',
      },
      {
        q: 'On J(w) = (w − 3)², which η reaches w = 3 in one step from anywhere?',
        o: ['0.1', '0.5', '1', '2'],
        a: 1,
        why: 'The gap is multiplied by 1 − 2η, which is 0 for η = 0.5.',
      },
      {
        q: 'Is the learning rate learned by gradient descent?',
        o: [
          'Yes, like the weights',
          'No, it is a hyperparameter you choose',
          'Only in linear regression',
          'Only for big datasets',
        ],
        a: 1,
        why: 'Hyperparameters such as η are set before training (or tuned by search).',
      },
    ],
  },
  // 4. Knowing when to stop
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Gradient descent approaches the minimum but rarely lands on it exactly. We need a rule to stop: a **stopping criterion** with a tolerance ε.',
      ],
      [
        'list',
        [
          '**Small gradient**: stop when |J′(w)| < ε (the slope is almost flat).',
          '**Small improvement**: stop when the loss changes by less than ε between two steps.',
          '**Budget**: stop after a maximum number of iterations, whatever happens.',
        ],
      ],
      [
        'p',
        'When the loss stops improving we say training has **converged**. Real code combines a tolerance with a maximum number of steps, so it always finishes.',
      ],
      [
        'ex',
        'How many steps for a given precision?',
        [
          'Same loss J(w) = (w − 3)², η = 0.1, start at w = 0. After k steps the gap is 3 × 0.8ᵏ.',
          'Gap < 10⁻²: 0.8ᵏ < 1/300 → k = 26 steps.',
          'Gap < 10⁻³: k = 36 steps. Gap < 10⁻⁴: k = 47 steps.',
          'Each extra digit of precision costs about 10 more steps: this is **linear convergence**, typical of gradient descent with a fixed step.',
        ],
      ],
      [
        'go',
        'This is exactly the comparison asked in your INDP2 exercise: count iterations for ε ∈ {10⁻², 10⁻³, 10⁻⁴} for fixed step, optimal step and conjugate gradient, and present them in a table. Expect the conjugate gradient to need by far the fewest.',
      ],
      [
        'warn',
        'A tolerance that is too strict wastes time: the last digits of the training loss do not improve predictions on new data. For ML, "close enough" is usually enough.',
      ],
    ],
    recap: [
      'Stop when the gradient or the improvement falls under ε, or after a step budget.',
      'Converged = the loss no longer improves meaningfully.',
      'Fixed-step gradient descent gains roughly one digit of precision per constant number of steps.',
    ],
    quiz: [
      {
        q: 'Which is a valid stopping criterion?',
        o: [
          'The gradient is below a tolerance ε',
          'The learning rate is 0.1',
          'The data is sorted',
          'The weight is positive',
        ],
        a: 0,
        why: 'A nearly flat slope means we are close to a minimum.',
      },
      {
        q: 'Why also set a maximum number of iterations?',
        o: [
          'To make training slower',
          'So training always ends, even if the tolerance is never reached',
          'To change the learning rate',
          'It is required by Python',
        ],
        a: 1,
        why: 'With a bad η the criterion may never be met; a budget guarantees termination.',
      },
      {
        q: 'The gap shrinks by a factor 0.8 each step. Roughly how many more steps to go from ε = 10⁻² to 10⁻³?',
        o: ['1', 'About 10', 'About 100', 'Infinitely many'],
        a: 1,
        why: '0.8ᵏ = 0.1 gives k ≈ 10.3: about 10 more steps per digit.',
      },
    ],
  },
  // 5. Two weights at once
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'Real models have many weights. The gradient becomes a **vector** with one partial derivative per weight, and every step updates all weights at the same time.',
      ],
      ['f', '∇J = (∂J/∂w₁, ∂J/∂w₂)      w ← w − η·∇J'],
      [
        'p',
        'Seen from above, a two-weight loss looks like a contour map: rings of equal loss around the minimum. The gradient is always perpendicular to the rings, pointing uphill.',
      ],
      [
        'ex',
        'A narrow valley: J(w₁, w₂) = w₁² + 10·w₂²',
        [
          'Gradient: ∇J = (2w₁, 20w₂). The loss is 10 times steeper along w₂ than along w₁.',
          'Each step multiplies w₁ by (1 − 2η) and w₂ by (1 − 20η).',
          'To stay stable along w₂ we need η < 0.1. With η = 0.09, w₂ flips sign each step (factor −0.8) while w₁ creeps (factor 0.82): the path zigzags across the valley.',
          'Rescale the features so both directions have the same curvature and the zigzag disappears (chapter 2, scaling).',
        ],
      ],
      [
        'go',
        'The **conjugate gradient** method fixes the zigzag without rescaling: each new direction is chosen so it does not undo the progress of the previous ones. On a quadratic with n variables it reaches the exact minimum in at most n steps, 2 steps here. That is the third method compared in your INDP2 exercise.',
      ],
      [
        'warn',
        'Updating the weights one after the other, each with the gradient computed after the previous update, is a different algorithm. Standard gradient descent computes the whole gradient first, then moves every weight at once.',
      ],
    ],
    recap: [
      'With several weights the gradient is a vector of partial derivatives.',
      'Elongated (badly scaled) valleys make the path zigzag; scaling fixes it.',
      'Conjugate gradient solves an n-variable quadratic in at most n steps.',
    ],
    quiz: [
      {
        q: 'J(w₁, w₂) = w₁² + 3w₂². What is ∇J at (1, 1)?',
        o: ['(1, 3)', '(2, 6)', '(2, 3)', '(1, 1)'],
        a: 1,
        why: '∂J/∂w₁ = 2w₁ = 2 and ∂J/∂w₂ = 6w₂ = 6.',
      },
      {
        q: 'Why does the descent path zigzag in a long narrow valley?',
        o: [
          'The data is noisy',
          'The slope is much steeper across the valley than along it',
          'The learning rate is too small',
          'There are too many weights',
        ],
        a: 1,
        why: 'The steep direction forces a small η and overshoots, the flat one barely moves.',
      },
      {
        q: 'On a quadratic loss with 2 variables, conjugate gradient needs at most…',
        o: ['1 step', '2 steps', '10 steps', 'as many steps as data points'],
        a: 1,
        why: 'Conjugate gradient finishes an n-variable quadratic in at most n steps.',
      },
    ],
  },
  // 6. Mini-batch and SGD
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'The MSE gradient sums over **all** n training examples. With a million examples, each step reads the whole dataset: accurate but slow. Two cheaper variants dominate in practice.',
      ],
      [
        'list',
        [
          '**Batch** gradient descent: all n examples per step. Smooth path, expensive steps.',
          '**Stochastic** gradient descent (SGD): one random example per step. Very cheap, very noisy.',
          '**Mini-batch**: B random examples per step (typically 32 to 256). The usual compromise.',
        ],
      ],
      [
        'f',
        '∇J ≈ (1/B) Σ over the batch ∇Jᵢ',
        'The mini-batch gradient is a noisy but unbiased estimate of the full gradient.',
      ],
      [
        'ex',
        'Counting the cost',
        [
          'Dataset: 1 000 000 examples. Batch size 100.',
          'One **epoch** (one pass over all the data) = 1 000 000 / 100 = 10 000 steps.',
          'Full-batch descent does 1 step per epoch; mini-batch does 10 000 smaller, noisier steps in about the same time, and usually reaches a good loss much sooner.',
        ],
      ],
      [
        'p',
        'The noise has a side benefit: it can shake the weights out of shallow valleys on non-convex losses. Its drawback: the loss never settles perfectly, so the learning rate is often lowered as training goes on.',
      ],
      [
        'warn',
        'Shuffle the data before cutting it into batches. If the examples are sorted (for example by class), each batch sees only one kind of example and the gradient points the wrong way.',
      ],
    ],
    recap: [
      'Batch = all data per step; SGD = one example; mini-batch = a small random group.',
      'Smaller batches: cheaper but noisier steps.',
      'An epoch is one full pass over the training data.',
    ],
    quiz: [
      {
        q: 'With 50 000 examples and a batch size of 500, how many steps per epoch?',
        o: ['50', '100', '500', '25 000 000'],
        a: 1,
        why: '50 000 / 500 = 100 steps.',
      },
      {
        q: 'What does stochastic gradient descent use at each step?',
        o: ['All the data', 'One random example', 'Only the test set', 'No data'],
        a: 1,
        why: 'SGD estimates the gradient from a single example.',
      },
      {
        q: 'Why shuffle the data before making mini-batches?',
        o: [
          'To make the files smaller',
          'So each batch is a fair sample of the data',
          'To remove outliers',
          'It is not needed',
        ],
        a: 1,
        why: 'Sorted data gives biased batches and misleading gradients.',
      },
    ],
  },
];
