/* Chapter 5: K-Nearest Neighbours. Running example: points of two classes, moss and terracotta, on a 2D map. */
export default [
  // 1. Nearest neighbors
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'Every model so far learned weights. **K-nearest neighbours** (KNN) learns nothing in advance: it simply remembers all the training examples. To classify a new point, it looks at the k most similar known points and lets them vote.',
      ],
      [
        'list',
        [
          '1. Compute the distance from the new point to every training point.',
          '2. Keep the k closest ones: the neighbours.',
          '3. Predict the class that appears most often among them (majority vote).',
        ],
      ],
      [
        'p',
        'The idea matches intuition: a flat is probably priced like the flats around it; a new song is probably liked by people who liked similar songs.',
      ],
      [
        'ex',
        'Voting with k = 3',
        [
          'A new point has, by distance, the neighbours: moss (0.8), terracotta (1.1), moss (1.3), terracotta (2.0), …',
          'k = 3 keeps the first three: moss, terracotta, moss.',
          'Votes: 2 moss vs 1 terracotta → prediction: moss.',
          'With k = 1, only the closest point decides: also moss.',
        ],
      ],
      [
        'p',
        'KNN is called a **lazy** or **instance-based** method: training is instant (store the data), but each prediction must compare the new point with the whole training set.',
      ],
      [
        'go',
        'KNN also does regression: instead of voting, average the labels of the k neighbours. A flat’s predicted price = the mean price of the 5 most similar flats.',
      ],
      [
        'warn',
        'Because it keeps every example, KNN gets slow and memory-hungry on big datasets: 1 million training points means 1 million distances for every single prediction.',
      ],
    ],
    recap: [
      'KNN stores the training data and classifies by majority vote of the k nearest points.',
      'No training phase, but every prediction scans the data.',
      'For regression, average the neighbours’ labels instead.',
    ],
    quiz: [
      {
        q: 'The 5 nearest neighbours are: A, B, A, A, B. KNN predicts…',
        o: ['A', 'B', 'A tie', 'Nothing'],
        a: 0,
        why: 'A has 3 votes out of 5.',
      },
      {
        q: 'What does KNN do during training?',
        o: [
          'Learns weights by gradient descent',
          'Stores the training examples',
          'Draws a decision line',
          'Computes a sigmoid',
        ],
        a: 1,
        why: 'KNN is lazy: the "model" is the stored data itself.',
      },
      {
        q: 'KNN regression with k = 3 finds neighbours with prices 100, 120 and 140. Prediction?',
        o: ['100', '120', '140', '360'],
        a: 1,
        why: 'The average (100 + 120 + 140) / 3 = 120.',
      },
    ],
  },
  // 2. Choosing k
  {
    minutes: 5,
    blocks: [
      ['p', 'k is a **hyperparameter**: it shapes how KNN behaves, and you choose it.'],
      [
        'list',
        [
          '**Small k** (1, 3): follows every detail of the data, including noise. A single mislabelled point carves its own island. Risk: overfitting.',
          '**Large k** (25, 50): smooth borders and stable votes, but small groups get outvoted by the big class nearby. Risk: underfitting.',
          '**k = n** (all points): always predicts the most common class, whatever the input.',
        ],
      ],
      [
        'ex',
        'Same point, different k',
        [
          'Neighbours sorted by distance: terracotta, moss, moss, terracotta, terracotta, terracotta, moss.',
          'k = 1 → terracotta (1 vote to 0).',
          'k = 3 → moss (2 to 1).',
          'k = 5 → terracotta (3 to 2). k = 7 → terracotta (4 to 3). The answer depends on k: that is why it must be tuned.',
        ],
      ],
      [
        'p',
        'With two classes, choose an **odd** k so a vote can never end in a tie. A common starting point is k ≈ √n, then compare a few values with cross-validation (chapter 6).',
      ],
      [
        'warn',
        'Never choose k by looking at test-set accuracy: that turns the test set into training data. Tune k on a validation set or with cross-validation, then report the test score once.',
      ],
    ],
    recap: [
      'Small k: flexible but noisy. Large k: smooth but can blur small groups.',
      'Use odd k with two classes to avoid ties.',
      'Tune k on validation data, not on the test set.',
    ],
    quiz: [
      {
        q: 'With k = 1, a single mislabelled training point…',
        o: ['has no effect', 'decides the class of every point closest to it', 'is removed automatically', 'changes k'],
        a: 1,
        why: 'With k = 1 the nearest point alone decides.',
      },
      {
        q: 'Why choose an odd k for two classes?',
        o: ['It is faster', 'To avoid tied votes', 'Even numbers are not allowed', 'To use less memory'],
        a: 1,
        why: 'An odd number of voters cannot split evenly between two classes.',
      },
      {
        q: 'What does KNN predict when k equals the number of training points?',
        o: ['The class of the closest point', 'Always the most common class', 'A random class', 'Nothing'],
        a: 1,
        why: 'Every point votes every time, so the majority class always wins.',
      },
    ],
  },
  // 3. Measuring distance
  {
    minutes: 5,
    blocks: [
      ['p', '"Nearest" needs a definition of distance. The choice changes which points count as neighbours.'],
      [
        'f',
        'Euclidean: d(p, q) = √((p₁ − q₁)² + (p₂ − q₂)² + …)',
        'The straight-line distance, as with a ruler. The default.',
      ],
      [
        'f',
        'Manhattan: d(p, q) = |p₁ − q₁| + |p₂ − q₂| + …',
        'The distance along a grid of streets, moving only horizontally and vertically.',
      ],
      [
        'ex',
        'Two distances between the same points',
        [
          'p = (2, 3) and q = (5, 7). Differences: 3 and 4.',
          'Euclidean: √(3² + 4²) = √25 = 5.',
          'Manhattan: 3 + 4 = 7.',
          'Euclidean is never larger than Manhattan: the straight line is the shortest path.',
        ],
      ],
      [
        'p',
        'On the plot, all the points within the Euclidean distance r form a circle. The circle in the exercise grows until it contains exactly k points: everything inside votes.',
      ],
      [
        'go',
        'In high dimensions (hundreds of features) all points end up at almost the same distance from each other, so "nearest" loses its meaning. This is the **curse of dimensionality**; reducing the number of features (or using a different model) helps.',
      ],
      [
        'warn',
        'Distances only make sense if every feature is a number on a meaningful scale. Categories must be one-hot encoded and features scaled first (level 5).',
      ],
    ],
    recap: [
      'Euclidean = straight-line distance; Manhattan = sum of absolute differences.',
      'The k nearest points lie inside the smallest circle that holds k points.',
      'In very high dimensions, distances become less informative.',
    ],
    quiz: [
      {
        q: 'Euclidean distance between (0, 0) and (6, 8)?',
        o: ['10', '14', '48', '100'],
        a: 0,
        why: '√(36 + 64) = √100 = 10.',
      },
      {
        q: 'Manhattan distance between (1, 2) and (4, 6)?',
        o: ['5', '7', '12', '25'],
        a: 1,
        why: '|4 − 1| + |6 − 2| = 3 + 4 = 7.',
      },
      {
        q: 'Compared with the Manhattan distance, the Euclidean distance between the same two points is…',
        o: ['always larger', 'never larger', 'always equal', 'unrelated'],
        a: 1,
        why: 'The straight line is the shortest path, so Euclidean ≤ Manhattan.',
      },
    ],
  },
  // 4. Classifying a new point
  {
    minutes: 5,
    blocks: [
      ['p', 'Let us run the whole algorithm by hand, from raw coordinates to a prediction.'],
      [
        'ex',
        'Classify the new point (3, 3) with k = 3',
        [
          'Training points: A (1, 1) moss, B (2, 4) terracotta, C (4, 4) terracotta, D (5, 1) moss, E (3, 6) moss.',
          'Squared distances to (3, 3): A 4 + 4 = 8, B 1 + 1 = 2, C 1 + 1 = 2, D 4 + 4 = 8, E 0 + 9 = 9. (Comparing squared distances gives the same order and skips the square roots.)',
          'Three nearest: B (2), C (2), then a tie between A and D (8). Either way the vote is 2 terracotta vs 1 moss.',
          'Prediction: terracotta. With k = 5 the vote would be 3 moss vs 2 terracotta: moss.',
        ],
      ],
      [
        'p',
        'Besides the class, the vote gives a rough **confidence**: 3 votes out of 3 is a clear answer, 2 out of 3 is shakier. scikit-learn exposes this as `predict_proba`: the share of neighbours in each class.',
      ],
      [
        'list',
        [
          'Ties in distance: break them by a fixed rule (for example data order).',
          'Ties in the vote: avoid with odd k, or let the closest neighbour decide.',
          '**Weighted KNN** gives closer neighbours a bigger vote (weight 1 / distance).',
        ],
      ],
      [
        'warn',
        'The new point must be scaled and encoded exactly like the training points before computing distances. A raw point compared with scaled data lands in the wrong place.',
      ],
    ],
    recap: [
      'Compute all distances, keep the k nearest, take the majority.',
      'The share of votes is a rough probability.',
      'Prepare new points exactly like the training data.',
    ],
    quiz: [
      {
        q: 'Neighbour votes with k = 5: 4 moss, 1 terracotta. The KNN probability of moss is…',
        o: ['0.2', '0.5', '0.8', '1'],
        a: 2,
        why: '4 of the 5 neighbours are moss: 4 / 5 = 0.8.',
      },
      {
        q: 'Why can we compare squared distances instead of distances?',
        o: [
          'They are more accurate',
          'Squaring keeps the same order and avoids square roots',
          'Squared distances are required by KNN',
          'We cannot',
        ],
        a: 1,
        why: 'For non-negative numbers, a < b exactly when a² < b².',
      },
      {
        q: 'What does weighted KNN change?',
        o: [
          'Closer neighbours get a bigger vote',
          'It uses more neighbours',
          'It removes far points from the data',
          'It learns weights by gradient descent',
        ],
        a: 0,
        why: 'Each vote is weighted, typically by 1 / distance.',
      },
    ],
  },
  // 5. Scaling matters
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'KNN only sees distances, so the feature with the largest numbers dominates. Scaling, optional for some models, is **essential** for KNN.',
      ],
      [
        'ex',
        'Income versus age',
        [
          'Person P: income 40 000 TND, age 25. Person Q: income 41 000, age 60. Person R: income 45 000, age 26.',
          'Raw distance P–Q: √(1 000² + 35²) ≈ 1 000.6. Raw distance P–R: √(5 000² + 1²) ≈ 5 000. So Q looks closer, despite a 35-year age gap.',
          'Min–max scale income over 0–100 000 and age over 20–60: P = (0.40, 0.125), Q = (0.41, 1.0), R = (0.45, 0.15).',
          'Scaled P–Q ≈ 0.875, scaled P–R ≈ 0.056. Now R, the 26-year-old with a similar income, is the true neighbour.',
        ],
      ],
      [
        'p',
        'Standardisation (z-scores) or min–max scaling both work. As always, compute the scaling from the training data and apply the same transformation to every new point.',
      ],
      [
        'go',
        'Scaling is also a choice of importance: multiplying a scaled feature by 2 doubles its influence on the distance. Some practitioners weigh features on purpose; by default, give them equal footing.',
      ],
      [
        'warn',
        'Features measured in different units (km and metres, TND and thousand TND) must be converted before scaling, or one of them will dominate again.',
      ],
    ],
    recap: [
      'Distance-based models are dominated by the largest-scale feature.',
      'Scale every feature before KNN, using training statistics.',
      'Once scaled, each feature contributes on an equal footing.',
    ],
    quiz: [
      {
        q: 'Without scaling, which feature dominates a KNN distance?',
        o: [
          'The one listed first',
          'The one with the largest range of values',
          'The most important one',
          'The one with the smallest values',
        ],
        a: 1,
        why: 'Large numeric differences swamp small ones in the sum of squares.',
      },
      {
        q: 'Age ranges 20–60. What is 40 after min–max scaling?',
        o: ['0.25', '0.5', '0.67', '40'],
        a: 1,
        why: '(40 − 20) / (60 − 20) = 20 / 40 = 0.5.',
      },
      {
        q: 'Which model needs feature scaling the most?',
        o: ['KNN', 'A model that always predicts the mean', 'A cut-off on one feature', 'None of them'],
        a: 0,
        why: 'KNN’s predictions depend entirely on distances between features.',
      },
    ],
  },
];
