/* Chapter 6: Evaluating Models. Running example: a spam filter on 100 test emails, 20 of them spam. */
export default [
  // 1. Train and test
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'A model is useful only if it works on data it has **never seen**. Grading it on its own training data is like grading a student on exam questions they memorised: the score says nothing about real understanding.',
      ],
      ['h', 'The split'],
      [
        'list',
        [
          '**Training set** (often 70–80%): the model learns from it.',
          '**Validation set** (optional): used to choose hyperparameters such as k, η or the threshold.',
          '**Test set** (often 20–30%): kept locked away, used once at the end for an honest grade.',
        ],
      ],
      [
        'p',
        'Usually the split is random. With **time series** it must follow time: train on the past, test on the future, otherwise the model peeks at tomorrow to predict today.',
      ],
      [
        'ex',
        'Your Dow Jones split, done right',
        [
          '2 766 trading days from January 2015 to December 2025.',
          'Training: the first 2 213 days (up to 18 October 2023). Test: the last 553 days (80% / 20%, in time order).',
          'Training R² ≈ 0.023 (slightly better than predicting the mean), but test R² ≈ −0.037: worse than the mean.',
          'Only the test set revealed that the small training edge does not survive on new days. That is exactly why we keep one.',
        ],
      ],
      [
        'warn',
        '**Data leakage**: any information from the test set that reaches training (scaling statistics, duplicates, choosing settings on test scores) makes the test grade too optimistic.',
      ],
    ],
    recap: [
      'Train on one part, grade on another part the model never saw.',
      'Time series: split by time, never shuffle the future into training.',
      'Use the test set once, at the very end.',
    ],
    quiz: [
      {
        q: 'Why not evaluate a model on its training data?',
        o: [
          'It takes too long',
          'It measures memorisation, not performance on new data',
          'Training data is too small',
          'It is forbidden by law',
        ],
        a: 1,
        why: 'A model can fit its training data perfectly and still fail on new data.',
      },
      {
        q: 'You predict stock prices. How should you split the data?',
        o: [
          'Randomly',
          'Past for training, later period for testing',
          'Test on the past, train on the future',
          'Use everything for training',
        ],
        a: 1,
        why: 'Shuffling would let the model learn from the future it is supposed to predict.',
      },
      {
        q: 'A model has R² = 0.6 on training data and −0.1 on test data. The model…',
        o: [
          'is excellent',
          'does worse than predicting the mean on new data',
          'has a bug in R²',
          'needs a larger test set only',
        ],
        a: 1,
        why: 'A negative test R² means the mean predictor beats it on unseen data.',
      },
    ],
  },
  // 2. Accuracy
  {
    minutes: 5,
    blocks: [
      [
        'p',
        'For classification the first metric everyone reaches for is **accuracy**: the share of predictions that are correct.',
      ],
      ['p', 'Every prediction falls into one of four boxes, the **confusion matrix**:'],
      [
        'list',
        [
          '**TP** (true positive): spam, flagged as spam.',
          '**FP** (false positive): normal email, wrongly flagged.',
          '**FN** (false negative): spam that slipped through.',
          '**TN** (true negative): normal email, left alone.',
        ],
      ],
      ['f', 'accuracy = (TP + TN) / (TP + FP + FN + TN)'],
      [
        'ex',
        'A spam filter on 100 emails (20 spam)',
        [
          'The filter flags 18 emails: 15 are spam (TP = 15), 3 are normal (FP = 3).',
          'It misses 5 spam (FN = 5) and correctly leaves 77 normal emails (TN = 77).',
          'Accuracy = (15 + 77) / 100 = 92%.',
          'A filter that flags **nothing** scores (0 + 80) / 100 = 80% while catching zero spam.',
        ],
      ],
      [
        'go',
        'Your SVM on Dow Jones days showed the same trap: with a strong penalty (C = 0.01) it predicted "up" for every test day and still reached 55% accuracy, simply because 305 of the 553 test days went up.',
      ],
      [
        'warn',
        'When one class is rare (fraud, illness, spam), accuracy rewards ignoring it. Always compare with the "always predict the majority class" baseline, and look at precision and recall.',
      ],
    ],
    recap: [
      'Confusion matrix: TP, FP, FN, TN.',
      'Accuracy = correct predictions / all predictions.',
      'With imbalanced classes, accuracy can look great for a useless model.',
    ],
    quiz: [
      {
        q: 'TP = 40, TN = 45, FP = 10, FN = 5. Accuracy?',
        o: ['40%', '85%', '90%', '95%'],
        a: 1,
        why: '(40 + 45) / 100 = 85%.',
      },
      {
        q: '99% of transactions are legitimate. A model that says "legitimate" every time has accuracy…',
        o: ['1%', '50%', '99%', '100%'],
        a: 2,
        why: 'It is right on all the legitimate ones: 99%, while catching no fraud.',
      },
      {
        q: 'A normal email sent to the spam folder is a…',
        o: ['true positive', 'false positive', 'false negative', 'true negative'],
        a: 1,
        why: 'Flagged positive (spam), but actually negative: a false positive.',
      },
    ],
  },
  // 3. Precision
  {
    minutes: 5,
    blocks: [
      ['p', '**Precision** answers: when the model says "positive", how often is it right?'],
      ['f', 'precision = TP / (TP + FP)', 'Out of everything flagged, the share that really is positive.'],
      [
        'ex',
        'Precision of the spam filter',
        [
          'The filter flagged 18 emails: 15 spam (TP), 3 normal (FP).',
          'Precision = 15 / 18 ≈ 0.83: when it says spam, it is right 83% of the time.',
          'Raise the threshold so only the 10 most suspicious emails are flagged, all real spam: precision = 10 / 10 = 1.0, but 10 spam now slip through.',
        ],
      ],
      [
        'p',
        'Precision matters when a **false alarm is expensive**: an important email lost in the spam folder, an innocent customer whose card gets blocked, a costly operation on a healthy patient.',
      ],
      [
        'warn',
        'Precision alone is easy to game: flag only the single most obvious case and precision is 100%. It must always be read together with recall (next level).',
      ],
    ],
    recap: [
      'Precision = TP / (TP + FP): how trustworthy a positive prediction is.',
      'High precision = few false alarms.',
      'A high threshold raises precision but misses more positives.',
    ],
    quiz: [
      {
        q: 'A filter flags 25 emails, 20 of them truly spam. Precision?',
        o: ['0.2', '0.5', '0.8', '1.25'],
        a: 2,
        why: '20 / 25 = 0.8.',
      },
      {
        q: 'Which situation calls for high precision?',
        o: [
          'Missing a fire is catastrophic',
          'Every false alarm costs a lot',
          'Classes are perfectly balanced',
          'You have very little data',
        ],
        a: 1,
        why: 'Precision limits false positives, i.e. false alarms.',
      },
      {
        q: 'A model flags only 1 email, which is spam. Its precision is 1.0. Is it a good filter?',
        o: [
          'Yes, it is perfect',
          'Not necessarily: it may miss almost all the spam',
          'No, precision must be 0.5',
          'It depends on the learning rate',
        ],
        a: 1,
        why: 'Precision ignores missed positives; check recall too.',
      },
    ],
  },
  // 4. Recall and F1
  {
    minutes: 6,
    blocks: [
      [
        'p',
        '**Recall** (also called sensitivity) answers the other question: of all the real positives, how many did the model catch?',
      ],
      ['f', 'recall = TP / (TP + FN)', 'Out of everything that really is positive, the share that was found.'],
      [
        'p',
        'Recall matters when **missing a positive is expensive**: an undetected disease, a fraud that goes through, a defective part that ships.',
      ],
      ['f', 'F1 = 2 · precision · recall / (precision + recall)', 'The harmonic mean: high only when both are high.'],
      [
        'ex',
        'Recall and F1 of the spam filter',
        [
          '20 real spam emails, 15 caught (TP), 5 missed (FN). Recall = 15 / 20 = 0.75.',
          'Precision was 15 / 18 ≈ 0.833.',
          'F1 = 2 × 0.833 × 0.75 / (0.833 + 0.75) ≈ 1.25 / 1.583 ≈ 0.79.',
          'Compare a lazy filter that flags everything: recall = 1, precision = 20 / 100 = 0.2, F1 ≈ 0.33. The harmonic mean punishes the weak side.',
        ],
      ],
      [
        'warn',
        'Recall alone is as easy to game as precision: flag everything and recall is 100%. Report both, or F1, never just the one that looks good.',
      ],
    ],
    recap: [
      'Recall = TP / (TP + FN): how many real positives were found.',
      'F1 combines precision and recall; it is low if either one is low.',
      'Choose the metric according to the cost of false alarms vs misses.',
    ],
    quiz: [
      {
        q: 'There were 40 frauds; the model caught 30. Recall?',
        o: ['0.25', '0.75', '1.33', '30'],
        a: 1,
        why: '30 / 40 = 0.75.',
      },
      {
        q: 'Precision = 1.0 and recall = 0.5. F1 is…',
        o: ['0.5', '0.67', '0.75', '1.0'],
        a: 1,
        why: '2 × 1 × 0.5 / 1.5 = 1 / 1.5 ≈ 0.67.',
      },
      {
        q: 'For cancer screening, which metric should be very high?',
        o: ['Precision', 'Recall', 'Accuracy only', 'None'],
        a: 1,
        why: 'Missing a sick patient (a false negative) is the costly error, and recall counts those.',
      },
    ],
  },
  // 5. The precision–recall trade-off
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'A classifier with probabilities (logistic regression, KNN votes…) does not have one precision and one recall: it has one pair **per threshold**.',
      ],
      [
        'list',
        [
          '**Raise the threshold**: fewer emails flagged, those flagged are surer → precision up, recall down.',
          '**Lower the threshold**: more flagged, more spam caught but more false alarms → recall up, precision down.',
        ],
      ],
      [
        'ex',
        'Three thresholds on the same filter',
        [
          'τ = 0.9: flags 10, all spam → precision 1.0, recall 10 / 20 = 0.5, F1 ≈ 0.67.',
          'τ = 0.6: flags 18, 15 spam → precision 0.83, recall 0.75, F1 ≈ 0.79.',
          'τ = 0.3: flags 30, 19 spam → precision 0.63, recall 0.95, F1 ≈ 0.76.',
          'Best F1 here at τ = 0.6, but a hospital would pick τ = 0.3 and an email service maybe τ = 0.9.',
        ],
      ],
      [
        'p',
        'Plotting precision against recall for every threshold gives the **precision–recall curve**. The ROC curve does the same with the true positive rate (recall) against the false positive rate FP / (FP + TN); its area, the AUC, summarises the model over all thresholds: 1 is perfect, 0.5 is random guessing.',
      ],
      [
        'warn',
        'Choose the threshold on validation data, not on the test set. Picking the threshold that maximises the test score is a subtle form of leakage.',
      ],
    ],
    recap: [
      'Every threshold gives a different precision–recall pair.',
      'Higher threshold: precision up, recall down (usually).',
      'Pick the balance from the cost of each error; AUC summarises all thresholds.',
    ],
    quiz: [
      {
        q: 'You raise the decision threshold. Usually…',
        o: ['precision goes up and recall goes down', 'both go up', 'both go down', 'nothing changes'],
        a: 0,
        why: 'Fewer, surer positives: fewer false alarms but more misses.',
      },
      {
        q: 'An AUC of 0.5 means the model…',
        o: ['is perfect', 'ranks no better than random guessing', 'has 50% precision', 'is overfitting'],
        a: 1,
        why: 'AUC 0.5 is the score of a coin flip.',
      },
      {
        q: 'Where should the threshold be chosen?',
        o: ['On the test set', 'On validation data', 'Always 0.5', 'During gradient descent'],
        a: 1,
        why: 'Tuning on the test set leaks information and inflates the final score.',
      },
    ],
  },
  // 6. Spotting overfitting
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'A model that is too flexible learns the training data **by heart**, noise included. It shines on training data and fails on new data: that is **overfitting**. The opposite, a model too simple to capture the pattern, is **underfitting**.',
      ],
      [
        'list',
        [
          '**Underfitting**: high training error and high test error (a straight line through a curve).',
          '**Good fit**: low training error and a test error close to it.',
          '**Overfitting**: very low training error, much higher test error (the gap is the warning sign).',
        ],
      ],
      [
        'ex',
        'Polynomial degree on 10 noisy points',
        [
          'Degree 1 (a line): misses the curve. Train MSE 4.1, test MSE 4.5. Underfitting.',
          'Degree 3: follows the trend. Train MSE 1.0, test MSE 1.3. Good.',
          'Degree 9: passes through all 10 points. Train MSE 0.0, test MSE 12.7. Overfitting: it memorised the noise.',
          'Rule: as flexibility grows, the training error always falls, while the test error first falls, then rises again.',
        ],
      ],
      [
        'p',
        'This is the **bias–variance trade-off**: simple models are biased (systematically wrong), flexible models have high variance (they change a lot with the training sample). The best model sits in between.',
      ],
      [
        'list',
        [
          'Get more training data.',
          'Use a simpler model (lower degree, fewer features, larger k in KNN).',
          'Add regularisation (a penalty λ‖w‖² on large weights, like ridge regression).',
          'Stop gradient descent early, when the validation error starts rising.',
        ],
      ],
      [
        'warn',
        'A perfect training score is a red flag, not a victory. Always look at the gap between training and test error.',
      ],
    ],
    recap: [
      'Overfitting = low training error, high test error.',
      'Underfitting = both errors high.',
      'Fight overfitting with more data, simpler models, regularisation or early stopping.',
    ],
    quiz: [
      {
        q: 'Train error 0.1, test error 9.0. Diagnosis?',
        o: ['Underfitting', 'Overfitting', 'A good fit', 'A data leak'],
        a: 1,
        why: 'A tiny training error with a big test error is the overfitting signature.',
      },
      {
        q: 'Train error 8.0, test error 8.3. Diagnosis?',
        o: ['Underfitting', 'Overfitting', 'A perfect model', 'Leakage'],
        a: 0,
        why: 'Both errors are high and close: the model is too simple.',
      },
      {
        q: 'Which change reduces overfitting in KNN?',
        o: ['Using k = 1', 'Using a larger k', 'Removing scaling', 'Testing on training data'],
        a: 1,
        why: 'A larger k averages over more neighbours, smoothing the decision.',
      },
    ],
  },
  // 7. Cross-validation
  {
    minutes: 6,
    blocks: [
      [
        'p',
        'A single train/test split can be lucky or unlucky, especially with little data. **K-fold cross-validation** uses every example for testing exactly once and averages the results.',
      ],
      [
        'list',
        [
          '1. Shuffle and cut the data into k equal folds (often k = 5 or 10).',
          '2. For each fold: train on the other k − 1 folds, test on this one.',
          '3. Report the mean (and spread) of the k scores.',
        ],
      ],
      [
        'ex',
        '5-fold cross-validation to choose a polynomial degree',
        [
          '100 examples → 5 folds of 20. Each model is trained 5 times on 80 examples and tested on the remaining 20.',
          'Degree 2: fold errors 1.9, 2.1, 2.0, 2.4, 1.8 → mean 2.04.',
          'Degree 3: 1.3, 1.5, 1.2, 1.6, 1.4 → mean 1.40.',
          'Degree 6: 1.2, 3.8, 1.5, 4.9, 2.1 → mean 2.70 with a huge spread: overfitting on some folds.',
          'Choose degree 3, retrain it on all the training data, then evaluate once on the held-out test set.',
        ],
      ],
      [
        'p',
        'Use cross-validation to compare models and tune hyperparameters (k in KNN, the polynomial degree, the regularisation λ). For classification with rare classes, use **stratified** folds so each fold keeps the same class proportions. For time series, use forward-chaining splits that always test on later data.',
      ],
      [
        'go',
        'In scikit-learn this is one line: `cross_val_score(model, X, y, cv=5)`, or `GridSearchCV` to try many hyperparameter values with cross-validation automatically.',
      ],
      [
        'warn',
        'Cross-validation replaces the validation set, not the final test set. If you tune on all your data with cross-validation, you still need untouched data to report an honest final score.',
      ],
    ],
    recap: [
      'K-fold CV: k rotations, each fold tests once; average the scores.',
      'Use it to choose models and hyperparameters; look at the spread too.',
      'Keep a final test set aside; use stratified or time-aware folds when needed.',
    ],
    quiz: [
      {
        q: 'With 5-fold cross-validation, how many times is the model trained?',
        o: ['1', '4', '5', '10'],
        a: 2,
        why: 'Once per fold: 5 trainings.',
      },
      {
        q: 'Fold scores: 0.80, 0.82, 0.78, 0.84, 0.76. What is the cross-validation score?',
        o: ['0.76', '0.80', '0.84', '4.00'],
        a: 1,
        why: '(0.80 + 0.82 + 0.78 + 0.84 + 0.76) / 5 = 4.00 / 5 = 0.80.',
      },
      {
        q: 'Why use stratified folds for a rare class?',
        o: [
          'To make training faster',
          'So every fold keeps the same class proportions',
          'To remove the rare class',
          'Because k must be odd',
        ],
        a: 1,
        why: 'A random fold might contain almost no positives, giving a misleading score.',
      },
    ],
  },
];
