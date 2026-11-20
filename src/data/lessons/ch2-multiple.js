/* Chapter 2: Multiple Linear Regression. Running example: flat prices (thousand TND) from area and distance. */
export default [
  // 1. More than one feature
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Hours studied explain part of an exam score, but not all of it. Most real targets depend on several things at once. A flat’s price depends on its area, its distance to the centre, its floor, its age… **Multiple linear regression** uses all of them in one model.',
      ],
      ['f', 'ŷ = w₁·x₁ + w₂·x₂ + … + w_d·x_d + b', 'd features, d weights and one bias.'],
      [
        'p',
        'Each feature xⱼ gets its own weight wⱼ. Everything you learned in chapter 1 still holds: the loss is still the MSE (or MAE), training still means finding the weights with the lowest loss.',
      ],
      [
        'ex',
        'Pricing a flat with two features',
        [
          'Model: price = 2.1 × area − 6 × distance + 40 (price in thousand TND, area in m², distance in km).',
          'Flat A: 80 m², 3 km from the centre → 2.1 × 80 − 6 × 3 + 40 = 168 − 18 + 40 = 190 thousand TND.',
          'Flat B: 80 m², 10 km away → 168 − 60 + 40 = 148. Same size, 42 thousand cheaper because it is further out.',
          'A one-feature model using only area would give both flats the same price.',
        ],
      ],
      ['h', 'Why not one model per feature?'],
      [
        'p',
        'Features interact through the data: big flats are often far from the centre. A model that looks at area alone mixes the effect of size with the effect of location. Fitting all features together separates them.',
      ],
      [
        'warn',
        'More features is not always better. Features that are pure noise make the model fit random details of the training data (overfitting, chapter 6).',
      ],
    ],
    recap: [
      'Multiple regression: one weight per feature, plus a bias.',
      'Same loss, same training idea as with one feature.',
      'Fitting features together separates their individual effects.',
    ],
    quiz: [
      {
        q: 'price = 2·area − 5·distance + 30. Price of a 50 m² flat 4 km away?',
        o: ['100', '110', '120', '130'],
        a: 1,
        why: '2 × 50 − 5 × 4 + 30 = 100 − 20 + 30 = 110.',
      },
      {
        q: 'A model has 5 features. How many parameters does it learn?',
        o: ['5', '6', '10', '25'],
        a: 1,
        why: 'One weight per feature (5) plus one bias = 6.',
      },
      {
        q: 'Why fit area and distance together rather than separately?',
        o: [
          'It is faster',
          'To separate the effect of each feature when they are related',
          'Because one feature is not allowed',
          'To make the MSE larger',
        ],
        a: 1,
        why: 'Joint fitting attributes each part of the price to the right feature.',
      },
    ],
  },
  // 2. Reading coefficients
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'A trained model is not just a prediction machine: its weights tell a story about the data, provided you read them correctly.',
      ],
      [
        'f',
        'wⱼ = change in ŷ when xⱼ grows by 1, all other features fixed',
        'The "all other features fixed" part is essential.',
      ],
      [
        'list',
        [
          '**Sign**: positive pushes the prediction up, negative pulls it down.',
          '**Size**: the effect per unit of the feature, in "label unit per feature unit".',
          '**Bias**: the prediction when every feature is 0 (often outside reality).',
        ],
      ],
      [
        'ex',
        'Reading price = 2.1·area − 6·distance + 40',
        [
          '+2.1: one more m², same distance → 2.1 thousand TND more.',
          '−6: one more km from the centre, same area → 6 thousand TND less.',
          'Is distance "more important" because |−6| > |2.1|? No: a flat varies by tens of m² but only a few km. 30 m² is worth 63, while 5 km costs 30.',
        ],
      ],
      [
        'go',
        'In your Dow Jones project, the next-day return was modelled as ŷ = 0.00081 − 0.155·x₁ − 0.041·x₂, where x₁ is the previous day’s return. The negative −0.155 means a strong day tends to be followed by a slightly weaker one (a small mean reversion), and its t-statistic of about −7.3 says this effect is very unlikely to be pure chance.',
      ],
      [
        'warn',
        'Comparing raw weights across features with different units is meaningless. Compare them only after scaling (next level), or compare the effect of a realistic change.',
      ],
    ],
    recap: [
      'A weight is the effect of one more unit of its feature, others held fixed.',
      'Sign = direction, size = strength per unit.',
      'Weights of features with different units are not directly comparable.',
    ],
    quiz: [
      {
        q: 'A model gives salary = 1.5·experience + 0.2·age + 10. What does 1.5 mean?',
        o: [
          'Salary rises 1.5 per year of experience, same age',
          'Experience is 1.5 times age',
          'The model is 1.5 times better',
          'Salary starts at 1.5',
        ],
        a: 0,
        why: 'A weight is the change in prediction per unit of its feature, others fixed.',
      },
      {
        q: 'A weight is negative. What does it say?',
        o: [
          'The feature is useless',
          'The feature pushes the prediction down',
          'The model has an error',
          'The feature must be removed',
        ],
        a: 1,
        why: 'A negative weight means higher values of the feature lower the prediction.',
      },
      {
        q: 'Weights are 0.01 for income (in TND) and 3 for age (in years). Which feature matters more?',
        o: [
          'Age, its weight is bigger',
          'Income, it is listed first',
          'You cannot tell from raw weights with different units',
          'Neither',
        ],
        a: 2,
        why: 'Income varies by thousands, age by tens: compare after scaling.',
      },
    ],
  },
  // 3. Feature scaling
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'Area lives between 40 and 160 m², distance between 0 and 20 km, income between 0 and 100 000 TND. Features on wildly different scales cause two problems: their weights cannot be compared, and gradient descent becomes slow and unstable.',
      ],
      ['h', 'Two common scalings'],
      ['f', 'min–max: x′ = (x − min) / (max − min)', 'Maps the feature to the range 0–1.'],
      ['f', 'standardisation: z = (x − μ) / σ', 'Mean 0 and standard deviation 1. Robust and the most common choice.'],
      [
        'ex',
        'Min–max scaling a flat',
        [
          'Area ranges over 40–160 m². A 100 m² flat → (100 − 40) / 120 = 0.5.',
          'Distance ranges over 0–20 km. A flat 5 km away → (5 − 0) / 20 = 0.25.',
          'Both features now live in 0–1, so their weights can be compared directly.',
        ],
      ],
      ['h', 'Why gradient descent cares'],
      [
        'p',
        'With unscaled features the loss bowl becomes a long, narrow valley. Gradient descent zigzags across it and needs a tiny learning rate to avoid exploding. Scaled features make the bowl round, and the walk to the bottom becomes short.',
      ],
      [
        'go',
        'Your Dow Jones regression is a real case: the daily returns (around 0.01) were tiny next to the column of 1s for the intercept, the condition number of XᵀX was about 14 700, and plain gradient descent needed 262 760 iterations to reach the coefficients the normal equation gave in one solve. For the SVM part you standardised the features with the training mean and standard deviation.',
      ],
      [
        'warn',
        'Compute min, max, μ and σ on the **training set only**, then apply the same numbers to the test set. Using the test data to scale leaks information about it into training.',
      ],
    ],
    recap: [
      'Scale features so they live on similar ranges: min–max (0–1) or standardisation (mean 0, sd 1).',
      'Scaling makes weights comparable and gradient descent fast.',
      'Fit the scaler on training data only.',
    ],
    quiz: [
      {
        q: 'Area ranges from 50 to 150 m². What is 75 m² after min–max scaling?',
        o: ['0.25', '0.5', '0.75', '75'],
        a: 0,
        why: '(75 − 50) / (150 − 50) = 25 / 100 = 0.25.',
      },
      {
        q: 'Standardised features have…',
        o: ['values between 0 and 1', 'mean 0 and standard deviation 1', 'only positive values', 'integer values'],
        a: 1,
        why: 'z = (x − μ) / σ centres the feature at 0 with unit spread.',
      },
      {
        q: 'Where should the scaling statistics (μ, σ) come from?',
        o: ['The whole dataset', 'The test set', 'The training set only', 'Any random sample'],
        a: 2,
        why: 'Using test data to scale leaks information; fit on training, apply to test.',
      },
    ],
  },
  // 4. Planes, not lines
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'With one feature the model is a line in 2D. With two features, ŷ = w₁x₁ + w₂x₂ + b is a flat **plane** in 3D: the height of the plane above each (area, distance) point is the predicted price. With d features it is a **hyperplane** in d + 1 dimensions, impossible to draw but the same idea.',
      ],
      ['h', 'Matrix form'],
      [
        'p',
        'Put each example in a row of a matrix X, starting with a 1 for the bias: row i is (1, xᵢ₁, xᵢ₂, …, xᵢd). The parameters form a vector w = (b, w₁, …, w_d). Then all predictions at once are a single product.',
      ],
      ['f', 'ŷ = X·w     and     MSE = (1/n)‖y − Xw‖²'],
      [
        'f',
        'XᵀX·w = Xᵀy',
        'The normal equations from chapter 1, unchanged: least squares works for any number of features.',
      ],
      [
        'ex',
        'Your Dow Jones model in matrix form',
        [
          'Each of the 2 213 training days is a row (1, x₁, x₂): x₁ = previous day’s return, x₂ = the day’s relative range (intraday volatility).',
          'X is 2 213 × 3, so XᵀX is only 3 × 3: solving the normal equations is instant.',
          'Result: w = (0.00081, −0.155, −0.041). The normal equation, a least-squares solver, gradient descent and scikit-learn all agree to about 10⁻⁹.',
          'Honest outcome: R² ≈ 0.02 on training data. Daily stock returns are almost unpredictable, and a good model reports that.',
        ],
      ],
      [
        'p',
        'The **R²** score compares the model with the dumbest one, which always predicts the mean: R² = 1 − MSE(model) / MSE(mean). 1 is perfect, 0 is no better than the mean, and a negative value is worse than the mean.',
      ],
      [
        'warn',
        'If two features are copies of each other (or one is a combination of others), XᵀX is not invertible and the weights are not unique. Remove redundant features.',
      ],
    ],
    recap: [
      'Two features → a plane; d features → a hyperplane.',
      'Matrix form: ŷ = Xw; least squares solves XᵀXw = Xᵀy.',
      'R² = 1 − MSE(model) / MSE(mean): how much better than predicting the average.',
    ],
    quiz: [
      {
        q: 'A model with 3 features describes…',
        o: ['a line', 'a plane in 3D', 'a hyperplane in 4D', 'a curve'],
        a: 2,
        why: '3 inputs + 1 output = 4 dimensions; the flat surface is a hyperplane.',
      },
      {
        q: 'Why does each row of X start with a 1?',
        o: ['To count the rows', 'So the first weight acts as the bias', 'To avoid dividing by 0', 'It is a typo'],
        a: 1,
        why: '1 × b adds the same bias to every prediction.',
      },
      {
        q: 'A model has R² = 0 on the test set. It is…',
        o: ['perfect', 'no better than always predicting the mean', 'impossible', 'overfitting for sure'],
        a: 1,
        why: 'R² = 0 means its MSE equals the MSE of the mean predictor.',
      },
    ],
  },
  // 5. Yes/no features
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Not every feature is a number. Balcony: yes or no. Neighbourhood: Lac, Marsa or Ariana. A linear model only multiplies numbers, so categories must be **encoded** first.',
      ],
      ['h', 'Binary features'],
      [
        'p',
        'A yes/no feature becomes 0 or 1. Its weight is then simply "how much the answer yes adds": with balcony = 1, the prediction moves by w_balcony; with 0, it does not move.',
      ],
      ['h', 'One-hot encoding'],
      [
        'p',
        'For a category with k values, create one 0/1 column per value: Lac = (1, 0, 0), Marsa = (0, 1, 0), Ariana = (0, 0, 1). Exactly one column is 1 per flat.',
      ],
      [
        'ex',
        'Adding a balcony to the price model',
        [
          'Model: price = 2.1 × area − 6 × distance + 12 × balcony + 40.',
          'A 70 m² flat, 4 km away, with balcony: 147 − 24 + 12 + 40 = 175 thousand TND.',
          'The same flat without balcony: 163. The balcony is worth +12, all else equal.',
        ],
      ],
      [
        'warn',
        'Never encode categories as 1, 2, 3 (Lac = 1, Marsa = 2, Ariana = 3): the model would believe Ariana is "three times" Lac and that Marsa sits halfway between. Use one-hot columns instead.',
      ],
      [
        'go',
        'With a bias in the model, the k one-hot columns always add up to 1, exactly like the bias column: XᵀX becomes singular (the "dummy variable trap"). The usual fix is to drop one column, which becomes the reference category.',
      ],
    ],
    recap: [
      'Yes/no features become 0/1; their weight is the effect of "yes".',
      'Categories with k values become k one-hot 0/1 columns.',
      'Never use arbitrary numbers like 1, 2, 3 for categories.',
    ],
    quiz: [
      {
        q: 'price = 3·area + 15·garden + 20, with garden = 1 if there is one. A 50 m² house with a garden costs…',
        o: ['150', '165', '185', '170'],
        a: 2,
        why: '3 × 50 + 15 × 1 + 20 = 150 + 15 + 20 = 185.',
      },
      {
        q: 'How should "colour ∈ {red, green, blue}" be fed to a linear model?',
        o: ['red = 1, green = 2, blue = 3', 'Three 0/1 columns, one per colour', 'As text', 'It cannot be used'],
        a: 1,
        why: 'One-hot encoding avoids inventing an order between colours.',
      },
      {
        q: 'The weight of a 0/1 feature "parking" is 8. What does it mean?',
        o: [
          'Having parking adds 8 to the prediction, all else equal',
          'There are 8 parkings',
          'The feature is 8 times more important',
          'Parking costs 8 per m²',
        ],
        a: 0,
        why: 'Switching the feature from 0 to 1 moves the prediction by its weight.',
      },
    ],
  },
];
