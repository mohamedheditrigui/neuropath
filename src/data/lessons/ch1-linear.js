/* Chapter 1: Linear Regression. Running example: hours studied (x) → exam score (y). */
export default [
  // 1. What is a prediction?
  {
    minutes: 4,
    blocks: [
      [
        'p',
        'In classic programming you write the rule yourself. In **machine learning** you give the computer examples and it finds the rule. When every example comes with the right answer, we call it **supervised learning**.',
      ],
      ['h', 'Features and labels'],
      [
        'p',
        'Each example has an input, the **feature** x, and an answer, the **label** y. Here x is the number of hours a student studied and y is the exam score. A dataset is a list of n pairs (x₁, y₁), (x₂, y₂), …, (xₙ, yₙ).',
      ],
      ['f', 'ŷ = f(x)', 'The model f turns a feature into a prediction ŷ (read "y-hat": the hat means predicted).'],
      ['h', 'Regression or classification?'],
      [
        'list',
        [
          '**Regression** predicts a number: a score, a price, a temperature.',
          '**Classification** predicts a category: pass/fail, spam/not spam. That is chapter 4.',
        ],
      ],
      [
        'ex',
        'Reading a trend before any math',
        [
          'Five students: 1 h → 52, 2 h → 58, 3 h → 61, 4 h → 68, 5 h → 71.',
          'Each extra hour adds roughly 5 points (from 52 to 71 is +19 over 4 hours, about 4.75 per hour).',
          'So a reasonable guess for 6 hours is about 71 + 5 = 76. That guess is a prediction, and the "+5 per hour" is the rule the model must learn.',
        ],
      ],
      [
        'warn',
        'A model that predicts well does not explain why. Hours and scores move together, but the model does not prove that studying causes the score (correlation is not causation).',
      ],
    ],
    recap: [
      'Supervised learning learns a rule from examples whose answers are known.',
      'Feature x = input, label y = answer, ŷ = the model’s guess.',
      'Regression predicts numbers; classification predicts categories.',
    ],
    quiz: [
      {
        q: 'A model predicts tomorrow’s temperature in °C. What kind of task is it?',
        o: ['Classification', 'Regression', 'Clustering', 'Not machine learning'],
        a: 1,
        why: 'The output is a number on a continuous scale, so it is regression.',
      },
      {
        q: 'In the hours → score example, what is the label?',
        o: ['The hours studied', 'The student’s name', 'The exam score', 'The model'],
        a: 2,
        why: 'The label is the answer we want to predict: the score.',
      },
      {
        q: 'What does the hat in ŷ mean?',
        o: ['The true value', 'The average value', 'A predicted value', 'An error'],
        a: 2,
        why: 'ŷ is the model’s prediction; y without a hat is the real value.',
      },
    ],
  },
  // 2. Drawing a line
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'The simplest rule that captures "more hours, more points" is a straight line. A straight line needs only two numbers, which makes it easy to learn and easy to explain.',
      ],
      ['f', 'ŷ = a·x + b', 'a = slope, b = intercept. One pair (a, b) = one line = one model.'],
      ['h', 'A line from two points'],
      [
        'p',
        'Two points fix a line. The slope is the rise divided by the run, and the intercept follows by plugging one point back in.',
      ],
      [
        'ex',
        'The line through (1, 52) and (5, 71)',
        [
          'Slope: a = (71 − 52) / (5 − 1) = 19 / 4 = 4.75.',
          'Intercept: 52 = 4.75 × 1 + b, so b = 47.25.',
          'Model: ŷ = 4.75·x + 47.25. Check with the other point: 4.75 × 5 + 47.25 = 71 ✓.',
          'Prediction for 3 hours: 4.75 × 3 + 47.25 = 61.5 (the real score was 61: close, not exact).',
        ],
      ],
      ['h', 'Why not pass through every point?'],
      [
        'p',
        'Real data is noisy: two students who studied 3 hours rarely get the same score. With more than two points, no single line goes through all of them. The goal becomes a line that passes **as close as possible** to the whole cloud. The next levels make "close" precise.',
      ],
      [
        'warn',
        'Choosing the line from just two points lets those two points decide everything. One unusual student can tilt the whole model. Use all the data.',
      ],
    ],
    recap: [
      'A straight line is described by two numbers: ŷ = a·x + b.',
      'Slope = rise / run; the intercept follows from one point.',
      'With noisy data no line fits every point, so we look for the closest one.',
    ],
    quiz: [
      {
        q: 'What is the slope of the line through (2, 10) and (4, 18)?',
        o: ['2', '4', '8', '14'],
        a: 1,
        why: '(18 − 10) / (4 − 2) = 8 / 2 = 4.',
      },
      {
        q: 'A line has slope 3 and passes through (1, 5). What is its intercept?',
        o: ['2', '3', '5', '8'],
        a: 0,
        why: '5 = 3 × 1 + b, so b = 2.',
      },
      {
        q: 'Why can a single line usually not pass through all the data points?',
        o: ['Lines are too short', 'Real data is noisy', 'Computers cannot draw lines', 'The slope must be positive'],
        a: 1,
        why: 'Noise scatters the points around the trend, so we fit a line that is closest overall.',
      },
    ],
  },
  // 3. Slope and intercept
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Machine learning renames the two numbers of a line: the slope becomes a **weight** w and the intercept a **bias** b. Same line, new names that scale to many features later.',
      ],
      ['f', 'ŷ = w·x + b'],
      ['h', 'Reading the weight'],
      [
        'p',
        'The weight is the change in the prediction when x grows by one unit. Its unit is "label unit per feature unit": here, points per hour. Its sign gives the direction: positive means y rises with x, negative means it falls, zero means x has no effect.',
      ],
      ['h', 'Reading the bias'],
      [
        'p',
        'The bias is the prediction when x = 0. Sometimes it means something (the score of a student who did not study), sometimes not (the price of a flat of 0 m²). It is mainly there to let the line move up and down.',
      ],
      [
        'ex',
        'Interpreting ŷ = 4.75·x + 47.25',
        [
          'Weight 4.75: each extra hour adds 4.75 points on average.',
          'Bias 47.25: a student who studied 0 hours is predicted to score about 47.',
          'Going from 2 to 4 hours: +2 × 4.75 = +9.5 points.',
          'If the weight were −2, more study would predict a lower score: a sign the model (or data) is odd.',
        ],
      ],
      [
        'warn',
        'Do not trust a line far outside the data. The model above predicts 47.25 + 4.75 × 20 = 142 points for 20 hours, but the exam is out of 100. Predicting outside the observed range (extrapolation) is risky.',
      ],
    ],
    recap: [
      'Weight = slope = effect of one more unit of x. Bias = intercept = prediction at x = 0.',
      'The sign of the weight gives the direction of the effect.',
      'Predictions far outside the data range are unreliable.',
    ],
    quiz: [
      {
        q: 'In ŷ = −3·x + 50, what happens to ŷ when x grows by 2?',
        o: ['It grows by 6', 'It drops by 6', 'It drops by 3', 'It stays at 50'],
        a: 1,
        why: 'Each unit of x changes ŷ by −3, so 2 units change it by −6.',
      },
      {
        q: 'What does the bias b represent?',
        o: ['The prediction when x = 0', 'The error of the model', 'The number of points', 'The steepness'],
        a: 0,
        why: 'At x = 0 the term w·x vanishes, leaving ŷ = b.',
      },
      {
        q: 'A model learned on students who studied 1–6 hours predicts 140/100 for 20 hours. The problem is…',
        o: ['A wrong bias', 'Extrapolation far outside the data', 'Too much data', 'A negative weight'],
        a: 1,
        why: 'The model was never shown anything near 20 hours, so its straight line runs off.',
      },
    ],
  },
  // 4. Measuring the error
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'To say that one line is better than another we need a number that measures how wrong a line is: a **loss**.',
      ],
      ['h', 'Residuals'],
      [
        'p',
        'For each point, the **residual** is the gap between the real value and the prediction: eᵢ = yᵢ − ŷᵢ. On the plot it is the dashed vertical segment. Positive = the line is too low, negative = too high.',
      ],
      [
        'p',
        'Simply adding residuals does not work: +5 and −5 cancel out and a terrible line could score 0. So we make every gap positive, either with an absolute value or a square.',
      ],
      ['f', 'MSE = (1/n) · Σ (yᵢ − ŷᵢ)²', 'Mean squared error: square each residual, then average.'],
      [
        'list',
        [
          '**MAE** = (1/n) Σ |yᵢ − ŷᵢ| (mean absolute error): easy to read, in the label’s unit.',
          '**MSE** squares the gaps: big misses cost a lot more than small ones, and it is smooth, which makes it easy to minimise.',
          '**RMSE** = √MSE brings the MSE back to the label’s unit.',
        ],
      ],
      [
        'ex',
        'Comparing two lines on three points',
        [
          'Data: (1, 2), (2, 4), (3, 5).',
          'Line A: ŷ = 1.5x + 0.5 → predictions 2, 3.5, 5 → residuals 0, 0.5, 0 → MSE = (0 + 0.25 + 0) / 3 ≈ 0.083.',
          'Line B: ŷ = 2x → predictions 2, 4, 6 → residuals 0, 0, −1 → MSE = (0 + 0 + 1) / 3 ≈ 0.333.',
          'Line A has the lower MSE, so it fits better, even though line B hits two points exactly.',
        ],
      ],
      [
        'warn',
        'Because it squares the gaps, MSE is very sensitive to outliers: a single point 10 units off adds 100 to the sum. Check your data for typos before trusting the MSE.',
      ],
    ],
    recap: [
      'Residual = real − predicted.',
      'MSE = average of the squared residuals; lower is better.',
      'MAE is easier to read, MSE punishes big errors and is smooth to optimise.',
    ],
    quiz: [
      {
        q: 'Residuals are 1, −1 and 2. What is the MSE?',
        o: ['0.67', '2', '6', '1.33'],
        a: 1,
        why: '(1 + 1 + 4) / 3 = 2.',
      },
      {
        q: 'Why not just add up the residuals?',
        o: [
          'It is too slow',
          'Positive and negative errors cancel out',
          'It gives numbers that are too big',
          'Residuals cannot be added',
        ],
        a: 1,
        why: '+5 and −5 would sum to 0 even though both points are badly predicted.',
      },
      {
        q: 'Which metric is in the same unit as the label?',
        o: ['MSE', 'RMSE', 'MSE²', 'None of them'],
        a: 1,
        why: 'RMSE takes the square root of the MSE, which undoes the squaring of units.',
      },
    ],
  },
  // 5. Fit the best line
  {
    minutes: 6,
    blocks: [
      [
        'p',
        '**Training** a linear regression means searching for the pair (w, b) with the smallest loss on the training data. The loss is now a function of the parameters, not of the data.',
      ],
      [
        'f',
        'J(w, b) = (1/n) · Σ (yᵢ − w·xᵢ − b)²',
        'The data is fixed; we move w and b to make J as small as possible.',
      ],
      ['h', 'The loss is a bowl'],
      [
        'p',
        'J is a quadratic function of w and b, and its graph is a bowl (a convex function). A bowl has a single lowest point, so there is one best line and no trap of a "local" minimum. Chapter 3 walks down this bowl step by step.',
      ],
      ['h', 'A useful property'],
      [
        'p',
        'Setting the derivative of J with respect to b to zero gives b = ȳ − w·x̄, where x̄ and ȳ are the averages. In words: **the best line always passes through the centre of the cloud** (x̄, ȳ). A good manual strategy: tilt the line around that centre.',
      ],
      [
        'ex',
        'Using the centre point',
        [
          'Data: (1, 52), (2, 58), (3, 61), (4, 68), (5, 71). Averages: x̄ = 3, ȳ = 62.',
          'Whatever slope you choose, the best bias for it is b = 62 − 3w.',
          'With w = 4.8: b = 62 − 14.4 = 47.6, so ŷ = 4.8x + 47.6. Only one number is left to tune.',
        ],
      ],
      [
        'go',
        'In your INDP2 optimisation project you minimised exactly this kind of J on 2,213 days of Dow Jones returns (2015–2023), with gradient and Hessian: J is convex because its Hessian 2XᵀX is positive semi-definite.',
      ],
      [
        'warn',
        'The best line on the training data is not automatically good on new data. Chapter 6 shows how to check that honestly.',
      ],
    ],
    recap: [
      'Training = finding the parameters that minimise the loss J(w, b).',
      'For linear regression with MSE, J is a convex bowl with a single minimum.',
      'The best line passes through the mean point (x̄, ȳ).',
    ],
    quiz: [
      {
        q: 'What does training a linear regression change?',
        o: ['The data', 'The weight and the bias', 'The number of points', 'The loss formula'],
        a: 1,
        why: 'The data is fixed; training adjusts w and b to lower the loss.',
      },
      {
        q: 'The data has averages x̄ = 2 and ȳ = 10. The best line with w = 3 has bias…',
        o: ['4', '6', '10', '16'],
        a: 0,
        why: 'b = ȳ − w·x̄ = 10 − 3 × 2 = 4.',
      },
      {
        q: 'Why is there only one best line for linear regression with MSE?',
        o: [
          'Because computers are deterministic',
          'Because the loss is a convex bowl',
          'Because there are only two parameters',
          'There can be many',
        ],
        a: 1,
        why: 'A convex quadratic loss has a single minimum (when the feature is not constant).',
      },
    ],
  },
  // 6. Least squares
  {
    minutes: 7,
    blocks: [
      [
        'p',
        'For linear regression we do not even need to search: the minimum of the bowl has an exact formula. This is the method of **least squares**.',
      ],
      ['h', 'Matrix form'],
      [
        'p',
        'Stack the data: each row of the matrix A is (1, xᵢ), the vector b holds the labels, and x = (α, β) holds the intercept and slope. The model for all points at once is A·x, and the loss is ‖Ax − b‖².',
      ],
      ['p', 'Setting the gradient ∇f(x) = 2AᵀAx − 2Aᵀb to zero gives the **normal equations**:'],
      ['f', 'AᵀA · x = Aᵀb', 'If AᵀA is invertible: x = (AᵀA)⁻¹ Aᵀb. One solve, no iterations.'],
      [
        'ex',
        'The line t = α + β·s through (0, 1), (1, 9), (3, 9), (4, 21)',
        [
          'No line passes through all four points (the first two force t = 1 + 8s, which gives 25 ≠ 9 at s = 3): the system is overdetermined.',
          'A has rows (1, 0), (1, 1), (1, 3), (1, 4) and b = (1, 9, 9, 21).',
          'AᵀA = [[4, 8], [8, 26]] and Aᵀb = (40, 120). det(AᵀA) = 4 × 26 − 8² = 40 ≠ 0.',
          '(α, β) = (1/40)·[[26, −8], [−8, 4]]·(40, 120) = (2, 4). Best line: t = 2 + 4s.',
          'Sum of squared residuals: (1−2)² + (9−6)² + (9−14)² + (21−18)² = 1 + 9 + 25 + 9 = 44, the smallest possible.',
        ],
      ],
      [
        'p',
        'With one feature, the same result has a friendly form: β = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)² and α = ȳ − β·x̄. Check it on the example: x̄ = 2, ȳ = 10, numerator 40, denominator 10, so β = 4 and α = 2.',
      ],
      [
        'go',
        'If AᵀA is not invertible (more unknowns than independent equations) there are infinitely many solutions; the one with the smallest norm is the pseudo-solution A⁺b. Adding a penalty ε‖x‖² to the loss is ridge regression, used everywhere in ML to stabilise such problems.',
      ],
      [
        'warn',
        'The exact formula needs to invert a d × d matrix, which gets slow and numerically fragile with many features. That is why large models use gradient descent instead (chapter 3).',
      ],
    ],
    recap: [
      'Least squares minimises ‖Ax − b‖² exactly.',
      'The solution satisfies the normal equations AᵀAx = Aᵀb.',
      'Example: the points (0,1), (1,9), (3,9), (4,21) give t = 2 + 4s with a squared error of 44.',
    ],
    quiz: [
      {
        q: 'What are the normal equations of least squares?',
        o: ['Ax = b', 'AᵀA x = Aᵀb', 'AAᵀ x = b', 'x = Ab'],
        a: 1,
        why: 'They come from setting the gradient 2AᵀAx − 2Aᵀb to zero.',
      },
      {
        q: 'With x̄ = 2, ȳ = 10, Σ(x−x̄)(y−ȳ) = 30 and Σ(x−x̄)² = 10, what is the slope?',
        o: ['1', '3', '5', '30'],
        a: 1,
        why: 'β = 30 / 10 = 3 (and then α = 10 − 3 × 2 = 4).',
      },
      {
        q: 'Why do big models often use gradient descent instead of the exact formula?',
        o: [
          'The formula is wrong',
          'Inverting a huge AᵀA is slow and unstable',
          'Gradient descent gives a different answer',
          'The formula only works for two points',
        ],
        a: 1,
        why: 'Both reach the same minimum, but solving a very large linear system is costly.',
      },
    ],
  },
];
