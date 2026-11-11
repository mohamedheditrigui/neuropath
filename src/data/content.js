/* NeuroPath course content: chapters, levels, lesson text and quizzes.
   Each chapter has one interactive lab (see src/components/labs) that all its levels use,
   and each level has its own short explanation and mini-exercise goal. */

export const XP_PER_LEVEL = 40;
export const XP_PER_RANK = 200;
export const QUIZ_PASS = 2;

export const CHAPTERS = [
  {
    id: 0,
    name: 'Linear Regression',
    zone: 'Scatter Plains',
    color: '#5F6D32',
    lab: 'line',
    summary: 'Draw a straight line through data and measure how well it fits.',
    levels: [
      { title: 'What is a prediction?', text: 'A model turns an input x into a guess for an output y. Here x is the hours a student studied and y is their exam score. Before any math, look at the points: as hours go up, scores go up. A line can capture that trend.', goal: 0.9 },
      { title: 'Drawing a line', text: 'Every straight line can be written y = a·x + b. Move both sliders and watch the line move. Try to make it pass through the middle of the cloud of points.', goal: 0.8 },
      { title: 'Slope and intercept', text: 'The slope a is how much y grows when x grows by one. The intercept b is the value of y when x is zero. A steeper line means each extra hour of study is worth more points.', goal: 0.7 },
      { title: 'Measuring the error', text: 'The dashed segments are the errors: the gap between each real score and your prediction. The mean squared error (MSE) squares those gaps and averages them, so big misses cost a lot.', goal: 0.6 },
      { title: 'Fit the best line', text: 'Fitting a model means finding the a and b with the smallest MSE. Do it by hand: get the MSE as low as you can. In chapter 3 you will see how a computer does this automatically.', goal: 0.5 },
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
      { title: 'More than one feature', text: 'A flat’s price depends on more than its size. Here the model uses two features: area in m² and distance to the city centre in km. Each feature gets its own weight. Bring the average error under the goal.', goal: 40 },
      { title: 'Reading coefficients', text: 'A weight tells you how much the prediction changes when that feature grows by one and the others stay the same. A negative weight means the feature pulls the price down.', goal: 25 },
      { title: 'Feature scaling', text: 'Area is in the tens, distance is in single digits. When features live on very different scales, their weights are hard to compare. Scaling puts every feature on a similar range first.', goal: 15 },
      { title: 'Planes, not lines', text: 'With two features the model is no longer a line but a plane: price = w₁·area + w₂·distance + b. Tune all three to bring the average error under the goal.', goal: 8 },
    ],
    quiz: [
      { q: 'A model predicts price = 2·area − 5·distance + 40. What does −5 mean?', o: ['Prices fall by 5 for each extra km, other things equal', 'The model is wrong', 'Distance does not matter', 'Every flat costs 5 less'], a: 0, why: 'A coefficient is the change in prediction for one more unit of its feature, holding the others fixed.' },
      { q: 'Why scale features before training?', o: ['To make the data smaller on disk', 'So features on very different ranges become comparable', 'To remove outliers', 'Because the model needs integers'], a: 1, why: 'Scaling puts features on similar ranges so their weights can be compared and training is stable.' },
      { q: 'With two input features, a linear model draws…', o: ['A line', 'A plane', 'A circle', 'A curve'], a: 1, why: 'Two inputs plus one output make a 3D space; the linear model is a flat plane in it.' },
    ],
  },
  {
    id: 2,
    name: 'Gradient Descent',
    zone: 'Descent Valley',
    color: '#A84F32',
    lab: 'descent',
    summary: 'Watch a model walk downhill on its loss curve, one step at a time.',
    levels: [
      { title: 'The loss landscape', text: 'Plot the error for every possible weight and you get a landscape. The best weight sits at the bottom of the valley. Gradient descent is a way to walk down without seeing the whole map.', goal: 0.05 },
      { title: 'Taking a step', text: 'At each point, the slope of the curve (the gradient) says which way is downhill. The model moves the weight a little in that direction. Press Step and watch the ball move.', goal: 0.05 },
      { title: 'The learning rate', text: 'The learning rate sets the size of each step. Too small and you crawl. Too big and you jump over the valley, maybe further up the other side. Find a rate that reaches the bottom quickly.', goal: 0.05 },
      { title: 'Knowing when to stop', text: 'Near the bottom the slope is almost flat, so the steps shrink by themselves. Training stops when the loss barely changes between steps. Reach a loss under the goal in 15 steps or fewer.', goal: 0.05, maxSteps: 15 },
    ],
    quiz: [
      { q: 'What does the gradient tell the model?', o: ['How many steps are left', 'Which direction makes the loss go up fastest', 'The final answer', 'The size of the dataset'], a: 1, why: 'The gradient points uphill, so the model steps in the opposite direction.' },
      { q: 'The loss jumps higher after every step. What is the likely cause?', o: ['The learning rate is too big', 'The learning rate is too small', 'There is too much data', 'The model already converged'], a: 0, why: 'A step that is too big overshoots the valley and climbs the other side.' },
      { q: 'Why do steps get smaller near the minimum, even with a fixed learning rate?', o: ['The computer slows down', 'The gradient gets close to zero', 'The data runs out', 'The learning rate decays by itself'], a: 1, why: 'Step = learning rate × gradient, and the gradient shrinks as the curve flattens.' },
    ],
  },
  {
    id: 3,
    name: 'KNN',
    zone: 'Neighbor Village',
    color: '#6B7350',
    lab: 'knn',
    summary: 'Classify a new point by asking its nearest neighbours.',
    levels: [
      { title: 'Nearest neighbors', text: 'K-nearest neighbours does not learn weights. To classify a new point, it finds the k closest known points and lets them vote. Drag the grey point and watch the vote.', task: { cls: 'moss', k: [1] } },
      { title: 'Choosing k', text: 'With k = 1 a single noisy neighbour decides. With a large k the vote is steadier but can blur the border between groups. Odd values of k avoid ties between two classes.', task: { cls: 'terracotta', k: [5, 7] } },
      { title: 'Measuring distance', text: 'Closeness is measured with a distance. The usual one is Euclidean: the straight-line distance √(Δx² + Δy²). The circle on the plot reaches the k-th neighbour.', task: { cls: 'moss', k: [3], unanimous: true } },
      { title: 'Classifying a new point', text: 'Put it together: move the point and pick k so that the model predicts the class written in the exercise. Then check how many neighbours agreed.', task: { cls: 'terracotta', k: [7] } },
    ],
    quiz: [
      { q: 'KNN with k = 5 finds 3 moss points and 2 terracotta points nearby. Prediction?', o: ['Terracotta', 'Moss', 'A tie', 'It cannot decide'], a: 1, why: 'The majority of the 5 neighbours (3 of them) are moss.' },
      { q: 'Why prefer an odd k with two classes?', o: ['It is faster', 'It avoids tied votes', 'It uses less memory', 'Even k is not allowed'], a: 1, why: 'With two classes an odd number of voters can never split evenly.' },
      { q: 'What does KNN do during training?', o: ['Learns a slope', 'Stores the examples', 'Runs gradient descent', 'Deletes outliers'], a: 1, why: 'KNN simply keeps the data; the work happens when a new point is classified.' },
    ],
  },
  {
    id: 4,
    name: 'Model Performance Metrics',
    zone: 'Measuring Ridge',
    color: '#6E6455',
    lab: 'metrics',
    summary: 'Measure how good a model really is, and spot when it fools you.',
    levels: [
      { title: 'Train and test', text: 'A model is judged on data it has never seen. That is why the data is split: a training set to learn from and a test set to grade the model honestly. Here a spam filter scores each email from 0 to 1, and you pick the score above which an email is flagged.', goal: 0.8 },
      { title: 'MSE and MAE', text: 'For numbers, MAE averages the absolute errors and MSE averages the squared errors. For classes, we count right and wrong answers. Move the threshold and reach 80% accuracy.', goal: 0.8 },
      { title: 'Accuracy and precision', text: 'Accuracy is the share of correct answers. Precision asks: of the emails flagged as spam, how many really were? Move the threshold and watch both change.', goal: 0.9, metric: 'precision' },
      { title: 'Spotting overfitting', text: 'A model that is perfect on training data but weak on test data has memorised instead of learned. That is overfitting. Find a threshold that keeps accuracy high without flagging real emails: accuracy and precision both at 90% or more.', goal: 0.9, metric: 'both' },
    ],
    quiz: [
      { q: 'Why keep a separate test set?', o: ['To train faster', 'To grade the model on data it never saw', 'To store backups', 'To make the dataset bigger'], a: 1, why: 'Only unseen data shows how the model will behave in real use.' },
      { q: 'A filter flags 10 emails as spam; 8 really are spam. Its precision is…', o: ['0.2', '0.8', '10', '8'], a: 1, why: 'Precision = true positives ÷ everything flagged = 8 ÷ 10.' },
      { q: '99% accuracy on training data, 60% on test data. What is going on?', o: ['Underfitting', 'Overfitting', 'A perfect model', 'A data leak in the test set'], a: 1, why: 'A big gap between training and test scores is the classic sign of overfitting.' },
    ],
  },
  {
    id: 5,
    name: 'Build Your First Model',
    zone: 'The Summit',
    color: '#6B4A33',
    final: true,
    summary: 'Train a model from raw data to a real prediction.',
    levels: [{ title: 'Guided project', text: '' }],
    quiz: [],
  },
];

/* Flat list of every level across chapters: progress is "how many of these are done". */
export const FLAT = [];
CHAPTERS.forEach((c) => c.levels.forEach((lv, li) => FLAT.push({ flat: FLAT.length, ch: c.id, lv: li, ...lv })));
export const TOTAL = FLAT.length;
export const firstOf = (ci) => FLAT.findIndex((l) => l.ch === ci);
export const PROJECT_FLAT = TOTAL - 1;

export const chapterLabel = (ci) => (CHAPTERS[ci].final ? 'Final chapter' : `Chapter ${ci + 1}`);
