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
      { title: 'What is a prediction?', text: 'A model turns an input x into a guess for an output y. Here x is the hours a student studied and y is their exam score. Before any math, look at the points: as hours go up, scores go up. A straight line can capture that trend.', key: 'A model maps an input (feature) to an output (label).', goal: 0.9 },
      { title: 'Drawing a line', text: 'Every straight line can be written y = a·x + b. Move both sliders and watch the line move. Try to make it pass through the middle of the cloud of points.', key: 'Two numbers are enough to describe any straight line.', goal: 0.8 },
      { title: 'Slope and intercept', text: 'The slope a is how much y grows when x grows by one. The intercept b is the value of y when x is zero. In machine learning, a is called a weight and b a bias.', key: 'Weight = slope, bias = intercept.', goal: 0.7 },
      { title: 'Measuring the error', text: 'The dashed segments are the errors (residuals): the gap between each real score and your prediction. The mean squared error (MSE) squares those gaps and averages them, so a few big misses cost a lot.', key: 'MSE = average of (prediction − real)².', goal: 0.6 },
      { title: 'Fit the best line', text: 'Training a model means finding the weight and bias with the smallest loss. Do it by hand: bring the MSE as low as you can.', key: 'Training = searching for the parameters with the lowest loss.', goal: 0.5 },
      { title: 'Least squares', text: 'For a straight line there is an exact formula, called least squares, that gives the best a and b in one go. Press "Show best line" to see it, then match it with your own sliders.', key: 'Least squares solves linear regression exactly; other models need an iterative method.', mode: 'best', tolerance: 0.05 },
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
      { title: 'More than one feature', text: 'A flat’s price depends on more than its size. Here the model uses two features: area in m² and distance to the city centre in km. Each feature gets its own weight. Bring the average error under the goal.', key: 'Each feature gets its own weight.', goal: 40 },
      { title: 'Reading coefficients', text: 'A weight tells you how much the prediction changes when that feature grows by one and the others stay the same. A negative weight means the feature pulls the price down: here, being far from the centre.', key: 'Sign = direction of the effect, size = strength per unit.', goal: 25 },
      { title: 'Feature scaling', text: 'Area is in the tens, distance in single digits. When features live on very different scales, their weights are hard to compare and gradient descent struggles. Scaling (for example to the 0–1 range) puts every feature on a similar range first.', key: 'Scale features before comparing weights or training.', goal: 15 },
      { title: 'Planes, not lines', text: 'With two features the model is no longer a line but a plane: price = w₁·area + w₂·distance + b. Tune all three numbers to bring the average error under the goal.', key: 'n features → a flat surface in n + 1 dimensions.', goal: 8 },
      { title: 'Yes/no features', text: 'Some features are categories, not numbers: does the flat have a balcony? We turn them into 0 or 1 (one-hot encoding), and the model learns a weight for "balcony = 1". Add the balcony weight to get the error under the goal.', key: 'One-hot encoding turns categories into 0/1 features.', mode: 'balcony', goal: 8 },
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
      { title: 'The loss landscape', text: 'Plot the loss for every possible weight and you get a landscape. The best weight sits at the bottom of the valley. Gradient descent walks down without seeing the whole map. Press Step a few times.', key: 'Training looks for the lowest point of the loss.', goal: 0.05 },
      { title: 'Taking a step', text: 'At each point, the slope of the curve (the gradient) says which way is uphill. The model moves the weight a little in the opposite direction: w ← w − learning rate × gradient.', key: 'Step against the gradient.', goal: 0.05 },
      { title: 'The learning rate', text: 'The learning rate sets the size of each step. Too small and you crawl. Too big and you jump over the valley, maybe higher on the other side. Find a rate that reaches the bottom quickly.', key: 'The learning rate is a hyperparameter you choose.', goal: 0.05 },
      { title: 'Knowing when to stop', text: 'Near the bottom the slope is almost flat, so the steps shrink by themselves. Training stops when the loss barely changes (it has converged). Reach the goal in 15 steps or fewer.', key: 'Converged = the loss stops improving.', goal: 0.05, maxSteps: 15 },
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
      { title: 'Nearest neighbors', text: 'K-nearest neighbours does not learn weights. To classify a new point, it finds the k closest known points and lets them vote. Drag the grey point and watch the vote.', key: 'KNN classifies by majority vote of nearby examples.', task: { cls: 'moss', k: [1] } },
      { title: 'Choosing k', text: 'With k = 1 a single noisy neighbour decides. With a large k the vote is steadier but can blur the border between groups. Odd values of k avoid ties between two classes.', key: 'k is a hyperparameter: small = noisy, large = blurry.', task: { cls: 'terracotta', k: [5, 7] } },
      { title: 'Measuring distance', text: 'Closeness is measured with a distance. The usual one is Euclidean: the straight-line distance √(Δx² + Δy²). The circle on the plot reaches the k-th neighbour.', key: 'Euclidean distance = straight-line distance.', task: { cls: 'moss', k: [3], unanimous: true } },
      { title: 'Classifying a new point', text: 'Put it together: move the point and pick k so that the model predicts the class written in the exercise. Then check how many neighbours agreed.', key: 'Prediction = majority class among the k nearest.', task: { cls: 'terracotta', k: [7] } },
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
      { title: 'Train and test', text: 'A model is judged on data it has never seen. That is why the data is split: a training set to learn from and a test set to grade the model honestly. Here a spam filter scores each test email from 0 to 1, and you pick the score above which an email is flagged.', key: 'Never grade a model on its training data.', goal: 0.8 },
      { title: 'Accuracy', text: 'Accuracy is the share of correct answers. It is easy to read but can lie: if 95% of emails are normal, a filter that flags nothing is 95% accurate and useless. Reach 85% accuracy here.', key: 'Accuracy = correct / total.', goal: 0.85 },
      { title: 'Precision', text: 'Precision asks: of the emails flagged as spam, how many really were spam? High precision means few real emails end up in the spam folder.', key: 'Precision = true positives / everything flagged.', goal: 0.9, metric: 'precision' },
      { title: 'Recall and F1', text: 'Recall asks the other question: of all the spam, how much did we catch? The F1 score is the harmonic mean of precision and recall; it is high only when both are high. Catch every spam email.', key: 'Recall = true positives / all real positives.', goal: 1, metric: 'recall' },
      { title: 'The precision–recall trade-off', text: 'Raising the threshold usually raises precision and lowers recall, and the other way round. There is no free lunch: you choose the balance. Find a threshold with an F1 score of 0.87 or more.', key: 'One threshold = one balance between precision and recall.', goal: 0.87, metric: 'f1' },
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
