/* NeuroPath course content: 7 chapters, 41 levels, lesson text and quizzes.
   Each chapter has one interactive lab (see src/components/labs); a level picks the lab's
   `mode` and sets the mini-exercise goal. Sources used to check the content: Google's
   Machine Learning Crash Course and the scikit-learn user guide (see README). */

export const XP_PER_LEVEL = 40;
export const XP_PER_RANK = 200;
export const quizPassMark = (n) => Math.ceil((n * 2) / 3); // 2 of 3, 3 of 4…

export const CHAPTERS = [
  {
    id: 0,
    name: 'Linear Regression',
    zone: 'Scatter Plains',
    color: '#5F6D32',
    lab: 'line',
    summary: 'Draw a straight line through data and measure how well it fits.',
    levels: [
      { title: 'What is a prediction?', text: 'Be the model. A new student studied 5.5 hours: drag your prediction onto the graph, following the trend of the others. Then sort four tasks into regression or classification.', key: 'A model maps an input (feature) to an output (label).', mode: 'predict' },
      { title: 'Drawing a line', text: 'Two points are enough to draw a line. Click two students on the graph: the line through them appears, with its slope computed as rise ÷ run. Find a pair whose line fits all ten students well.', key: 'Two numbers are enough to describe any straight line.', mode: 'twopoints', goal: 0.25 },
      { title: 'Slope and intercept', text: 'A dashed mystery line hides on the graph. Use the weight w to tilt your line and the bias b to lift it until it covers the mystery line, then use it to make a prediction.', key: 'Weight = slope, bias = intercept.', mode: 'match' },
      { title: 'Measuring the error', text: 'The line is fixed. First compute one residual by hand, then drag one student far from the line and watch how the MSE explodes while the MAE grows slowly.', key: 'MSE = average of (prediction − real)².', mode: 'residuals' },
      { title: 'Fit the best line', text: 'Training means finding the weight and bias with the smallest loss. Do it by hand: bring the MSE under the goal. Tip: lock the line on the mean point so only the slope is left to tune.', key: 'Training = searching for the parameters with the lowest loss.', mode: 'fit', goal: 0.5 },
      { title: 'Least squares', text: 'Solve least squares exactly, by hand, on the four points of the course example: build AᵀA and Aᵀb, solve the normal equations, and watch the best line appear.', key: 'Least squares solves linear regression exactly; other models need an iterative method.', mode: 'normal' },
    ],
    quiz: [
      { q: 'In y = ax + b, what does a control?', o: ['How steep the line is', 'Where the line crosses the y-axis', 'How many points you have', 'The error of the model'], a: 0, why: 'a is the slope: each extra unit of x adds a to the prediction.' },
      { q: 'The MSE of your line drops from 4.2 to 0.6. What happened?', o: ['The data changed', 'The line moved closer to the points', 'The line became steeper', 'The model needs more features'], a: 1, why: 'MSE averages the squared distances, so a lower value means a closer fit.' },
      { q: 'A line has slope 0.8 and intercept 2. What does it predict at x = 5?', o: ['4', '6', '7.2', '10'], a: 1, why: '0.8 × 5 + 2 = 6.' },
    ],
  },
  {
    id: 1,
    name: 'Multiple Linear Regression',
    zone: 'Terraced Fields',
    color: '#97691A',
    lab: 'multi',
    summary: 'Use several features at once to predict a single value.',
    levels: [
      { title: 'More than one feature', text: 'First try to price eight flats with their area only: you will get stuck. Then add a second feature, the distance to the centre, and watch the average error fall.', key: 'Each feature gets its own weight.', mode: 'features', goal: 12 },
      { title: 'Reading coefficients', text: 'The model is already trained: price = 1.5·area − 8·dist + 60. Play "what if" with one flat, see where its price comes from, then answer three questions by reading the weights.', key: 'Sign = direction of the effect, size = strength per unit.', mode: 'read' },
      { title: 'Feature scaling', text: 'Scale two values by hand with min–max scaling, then train the same model twice with gradient descent, on raw and on scaled features, and compare.', key: 'Scale features before comparing weights or training.', mode: 'scale' },
      { title: 'Planes, not lines', text: 'With two features the model is a plane. Here you see it from above, as a coloured map. Tune the three numbers until every flat’s colour matches the ground under it.', key: 'n features → a flat surface in n + 1 dimensions.', mode: 'plane', goal: 8 },
      { title: 'Yes/no features', text: 'Fill a one-hot table for three neighbourhoods, then find how much a balcony (a 0/1 feature) adds to the price.', key: 'One-hot encoding turns categories into 0/1 features.', mode: 'balcony', goal: 8 },
    ],
    quiz: [
      { q: 'A model predicts price = 2·area − 5·distance + 40. What does −5 mean?', o: ['Prices fall by 5 for each extra km, other things equal', 'The model is wrong', 'Distance does not matter', 'Every flat costs 5 less'], a: 0, why: 'A coefficient is the change in prediction for one more unit of its feature, holding the others fixed.' },
      { q: 'Why scale features before training?', o: ['To make the data smaller on disk', 'So features on very different ranges become comparable', 'To remove outliers', 'Because the model needs integers'], a: 1, why: 'Scaling puts features on similar ranges so their weights can be compared and training is stable.' },
      { q: 'How do you give a model the colour of a car (red, blue, green)?', o: ['Red = 1, blue = 2, green = 3', 'One 0/1 feature per colour', 'Ignore it', 'Use the word directly'], a: 1, why: 'One-hot encoding avoids inventing an order (blue is not "twice" red).' },
    ],
  },
  {
    id: 2,
    name: 'Gradient Descent',
    zone: 'Descent Canyon',
    color: '#A84F32',
    lab: 'descent',
    summary: 'Watch a model walk downhill on its loss, one step at a time.',
    levels: [
      { title: 'The loss landscape', text: 'The loss landscape is hidden in fog. Probe the loss at a few weights, read the slope at each probe, and plant your flag at the bottom of the valley.', key: 'Training looks for the lowest point of the loss.', mode: 'explore' },
      { title: 'Taking a step', text: 'Be the algorithm: compute three gradient-descent steps by hand with a learning rate of 0.1, and watch each step appear on the valley.', key: 'Step against the gradient.', mode: 'manual' },
      { title: 'The learning rate', text: 'Four runners go down the same valley with different learning rates. Name what each one does, then pick your own rate that reaches the bottom in five steps.', key: 'The learning rate is a hyperparameter you choose.', mode: 'race' },
      { title: 'Knowing when to stop', text: 'Run gradient descent with four stopping tolerances, read how many steps each needs, and decide which one fits an iteration budget.', key: 'Converged = the loss stops improving.', mode: 'stop' },
      { title: 'Two weights at once', text: 'Real models have many weights. With two, the loss is a bowl; seen from above it is a contour map. Each step moves both weights at once. A rate too high makes the path zigzag across the narrow valley.', key: 'The gradient has one component per weight.', mode: '2d', goal: 0.05, maxSteps: 40 },
      { title: 'Mini-batch and SGD', text: 'Computing the gradient on all the data at every step is slow. Stochastic gradient descent uses one example per step, mini-batch a few. The path gets noisy but each step is much cheaper.', key: 'Smaller batches: cheaper but noisier steps.', mode: 'sgd', goal: 0.1, maxBatch: 4 },
    ],
    quiz: [
      { q: 'What does the gradient tell the model?', o: ['How many steps are left', 'Which direction makes the loss go up fastest', 'The final answer', 'The size of the dataset'], a: 1, why: 'The gradient points uphill, so the model steps in the opposite direction.' },
      { q: 'The loss jumps higher after every step. What is the likely cause?', o: ['The learning rate is too big', 'The learning rate is too small', 'There is too much data', 'The model already converged'], a: 0, why: 'A step that is too big overshoots the valley and climbs the other side.' },
      { q: 'What does stochastic gradient descent use at each step?', o: ['All the data', 'One example (or a small batch)', 'No data', 'Only the test set'], a: 1, why: 'SGD estimates the gradient from one example; mini-batch from a few.' },
    ],
  },
  {
    id: 3,
    name: 'Logistic Regression',
    zone: 'Sigmoid Springs',
    color: '#4E7C78',
    lab: 'logistic',
    summary: 'Predict a yes/no answer as a probability between 0 and 1.',
    levels: [
      { title: 'From numbers to yes/no', text: 'Regression predicts a number. Classification predicts a class: pass or fail, spam or not. The simplest classifier is a cut-off: students who studied more than t hours pass. Find the best cut-off.', key: 'Classification = predicting a category.', mode: 'cut', goal: 0.9 },
      { title: 'The sigmoid curve', text: 'A straight line can go below 0 or above 1, which makes no sense for a probability. Logistic regression squeezes the line z = w·x + b through the sigmoid σ(z) = 1 / (1 + e⁻ᶻ), an S-curve between 0 and 1.', key: 'σ turns any number into a probability.', mode: 'sigmoid', goal: { low: 0.2, high: 0.8 } },
      { title: 'Probability and threshold', text: 'The model outputs a probability, for example 0.73. To get a yes/no answer we compare it with a threshold, usually 0.5. Move the threshold and the curve to classify every student correctly but one.', key: 'Class = probability ≥ threshold.', mode: 'threshold', goal: 0.9 },
      { title: 'The decision boundary', text: 'With two features (hours studied and hours slept) the points where the probability is exactly 0.5 form a line: the decision boundary. Everything on one side is predicted "pass".', key: 'Logistic regression draws a straight boundary.', mode: 'boundary', goal: 0.9 },
      { title: 'Log loss', text: 'Logistic regression is not trained with MSE but with log loss. It punishes confident mistakes very hard: predicting 0.99 for a student who failed costs far more than predicting 0.6.', key: 'Log loss = −average of y·log(p) + (1 − y)·log(1 − p).', mode: 'logloss', goal: 0.3 },
      { title: 'Train a classifier', text: 'Put it together: gradient descent on log loss finds w and b automatically, exactly like in the Descent Canyon. Pick a learning rate and train.', key: 'Same recipe: a loss, its gradient, small steps.', mode: 'train', goal: 0.3 },
    ],
    quiz: [
      { q: 'Why use the sigmoid in logistic regression?', o: ['To make training faster', 'To keep the output between 0 and 1', 'To remove outliers', 'To draw curves'], a: 1, why: 'The sigmoid maps any value to the 0–1 range, so it reads as a probability.' },
      { q: 'The model gives p = 0.3 and the threshold is 0.5. The prediction is…', o: ['Positive', 'Negative', '0.3', 'Undefined'], a: 1, why: '0.3 is below the threshold, so the class is negative.' },
      { q: 'Which mistake does log loss punish the most?', o: ['p = 0.55 for a positive', 'p = 0.99 for a negative', 'p = 0.5 for anything', 'p = 0.1 for a negative'], a: 1, why: 'Being confident and wrong makes log(1 − p) very negative.' },
    ],
  },
  {
    id: 4,
    name: 'KNN',
    zone: 'Neighbor Village',
    color: '#6B7350',
    lab: 'knn',
    summary: 'Classify a new point by asking its nearest neighbours.',
    levels: [
      { title: 'Nearest neighbors', text: 'Be the algorithm: find by eye the three points closest to a new point, check your choice, then cast the majority vote yourself.', key: 'KNN classifies by majority vote of nearby examples.', mode: 'vote' },
      { title: 'Choosing k', text: 'The whole map is coloured by what KNN predicts. Change k and watch a mislabelled point’s island appear and vanish, then see what happens when every point votes.', key: 'k is a hyperparameter: small = noisy, large = blurry.', mode: 'kmap' },
      { title: 'Measuring distance', text: 'Compute a Euclidean and a Manhattan distance by hand, then switch the metric on the board and see the shape of the neighbourhood change.', key: 'Euclidean distance = straight-line distance.', mode: 'distance' },
      { title: 'Classifying a new point', text: 'Run KNN entirely by hand on five labelled points: compute the squared distances, sort them, and vote with k = 3 and k = 5.', key: 'Prediction = majority class among the k nearest.', mode: 'byhand' },
      { title: 'Scaling matters', text: 'Here one feature is income (0–100 000) and the other is age (20–60). Without scaling, distances are almost only income, and age is ignored. Turn on scaling and see the neighbours change.', key: 'Distance-based models need scaled features.', mode: 'scale', task: { cls: 'moss', k: [3] } },
    ],
    quiz: [
      { q: 'KNN with k = 5 finds 3 moss points and 2 terracotta points nearby. Prediction?', o: ['Terracotta', 'Moss', 'A tie', 'It cannot decide'], a: 1, why: 'The majority of the 5 neighbours (3 of them) are moss.' },
      { q: 'Why prefer an odd k with two classes?', o: ['It is faster', 'It avoids tied votes', 'It uses less memory', 'Even k is not allowed'], a: 1, why: 'With two classes an odd number of voters can never split evenly.' },
      { q: 'Why scale features before KNN?', o: ['So one big-range feature does not dominate the distance', 'To make k smaller', 'Because KNN needs integers', 'It is not needed'], a: 0, why: 'A feature measured in thousands swamps one measured in tens.' },
    ],
  },
  {
    id: 5,
    name: 'Evaluating Models',
    zone: 'Measuring Ridge',
    color: '#6E6455',
    lab: 'metrics',
    summary: 'Measure how good a model really is, and spot when it fools you.',
    levels: [
      { title: 'Train and test', text: 'Lock away an honest test set from 20 emails, then judge four real-life practices: honest evaluation or data leakage?', key: 'Never grade a model on its training data.', mode: 'split' },
      { title: 'Accuracy', text: 'Count the confusion matrix of a spam filter by hand, compute its accuracy, then meet the lazy filter that catches nothing and still scores 60%.', key: 'Accuracy = correct / total.', mode: 'confusion' },
      { title: 'Precision', text: 'Compute a precision by hand, then find the lowest threshold that keeps every real email out of the spam folder.', key: 'Precision = true positives / everything flagged.', mode: 'precision' },
      { title: 'Recall and F1', text: 'Compute recall and F1 by hand, then catch every single spam email and see what it costs.', key: 'Recall = true positives / all real positives.', mode: 'recall' },
      { title: 'The precision–recall trade-off', text: 'Every threshold is a point on the precision–recall curve. Read where the extremes sit, then find the threshold with the best balance (F1 ≥ 0.87).', key: 'One threshold = one balance between precision and recall.', mode: 'curve', goal: 0.87 },
      { title: 'Spotting overfitting', text: 'A very flexible model can pass through every training point, noise included, and then fail on new data. That is overfitting. Move the polynomial degree and watch training and test errors split apart. Pick the degree with the lowest test error.', key: 'Low training error + high test error = overfitting.', lab: 'overfit', mode: 'fit' },
      { title: 'Cross-validation', text: 'One test split can be lucky. K-fold cross-validation cuts the data into k folds; each fold is the test set once while the others train. The average score is more reliable. Use it to choose the degree.', key: 'Average the score over k train/test rotations.', lab: 'overfit', mode: 'cv' },
    ],
    quiz: [
      { q: 'Why keep a separate test set?', o: ['To train faster', 'To grade the model on data it never saw', 'To store backups', 'To make the dataset bigger'], a: 1, why: 'Only unseen data shows how the model will behave in real use.' },
      { q: 'A filter flags 10 emails as spam; 8 really are spam. Its precision is…', o: ['0.2', '0.8', '10', '8'], a: 1, why: 'Precision = true positives ÷ everything flagged = 8 ÷ 10.' },
      { q: 'There were 16 spam emails and the filter caught 8. Its recall is…', o: ['0.5', '0.8', '2', '16'], a: 0, why: 'Recall = caught ÷ all real spam = 8 ÷ 16.' },
      { q: '99% accuracy on training data, 60% on test data. What is going on?', o: ['Underfitting', 'Overfitting', 'A perfect model', 'Nothing unusual'], a: 1, why: 'A big gap between training and test scores is the classic sign of overfitting.' },
    ],
  },
  {
    id: 6,
    name: 'Build Your First Model',
    zone: 'The Summit',
    color: '#6B4A33',
    final: true,
    summary: 'Six guided steps from a raw dataset to a model you can explain.',
    levels: [
      { title: 'The problem', text: 'A school wants to predict a student’s exam score from the hours they studied, to warn students early. Before touching data, name what you predict and what you use.', key: 'Start from the question, not the algorithm.' },
      { title: 'Explore and clean', text: 'Real data is messy. Plot it, then fix what is broken: a missing value and a typo that creates an impossible score.', key: 'Garbage in, garbage out.' },
      { title: 'Split the data', text: 'Keep part of the data aside to test the model honestly.', key: 'The test set stays untouched until the end.' },
      { title: 'Train', text: 'Fit the line with gradient descent. Choose a learning rate that converges.', key: 'Watch the loss to know training worked.' },
      { title: 'Evaluate', text: 'Score the model on the test set and compare it with a baseline that always predicts the average score.', key: 'A model is only useful if it beats a simple baseline.' },
      { title: 'Predict and share', text: 'Use your model, then summarise it in a model card: data, method, score and limits.', key: 'Document what the model can and cannot do.' },
    ],
    quiz: [],
  },
];

/* Flat list of every level across chapters: progress is "how many of these are done". */
export const FLAT = [];
CHAPTERS.forEach((c) => c.levels.forEach((lv, li) => FLAT.push({ flat: FLAT.length, ch: c.id, lv: li, ...lv })));
export const TOTAL = FLAT.length;
export const firstOf = (ci) => FLAT.findIndex((l) => l.ch === ci);
export const FINAL_CHAPTER = CHAPTERS.length - 1;
export const PROJECT_START = firstOf(FINAL_CHAPTER);

export const chapterLabel = (ci) => (CHAPTERS[ci].final ? 'Final chapter' : `Chapter ${ci + 1}`);
/* Where a level is played: a lesson page, or a step of the final project. */
export const levelPath = (flat) => {
  const l = FLAT[flat];
  return CHAPTERS[l.ch].final ? `/project/${l.lv + 1}` : `/lesson/${flat}`;
};
