const OpenAI = require("openai");
const Question = require("../models/question.model");
const Result = require("../models/result.model");
const Quiz = require("../models/quiz.model");
const fs = require("fs");
const path = require("path");
const User = require("../models/user.model");
const LeaderBoard = require("../models/leaderboard.model");
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.insertQuestion = async (req, res) => {
  const { difficulty, subject } = req.query;

  if (!difficulty || !subject) {
    return res
      .status(400)
      .json({ error: "Difficulty and subject are required." });
  }

  //   try {
  //     const prompt = `Generate a ${difficulty} level quiz question for the subject ${subject}.
  //       Provide four options (A, B, C, D) and specify the correct option. Format the response as:
  //       Question: <question text>
  //       Options: A) <option A>, B) <option B>, C) <option C>, D) <option D>
  //       Correct Option: <correct option letter>`;

  //     const response = await openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //         {
  //           role: "user",
  //           content: prompt,
  //         },
  //       ],
  //       max_tokens: 200,
  //       temperature: 0.7,
  //     });

  //     const output = response.choices[0].message.content.trim();

  //     const questionMatch = output.match(/Question:\s*(.*)/);
  //     const optionsMatch = output.match(
  //       /Options:\s*A\)\s*(.*),\s*B\)\s*(.*),\s*C\)\s*(.*),\s*D\)\s*(.*)/
  //     );
  //     const correctOptionMatch = output.match(/Correct Option:\s*(.*)/);

  //     if (!questionMatch || !optionsMatch || !correctOptionMatch) {
  //       return res
  //         .status(500)
  //         .json({ error: "Failed to parse OpenAI response." });
  //     }

  //     const questionText = questionMatch[1];
  //     const options = {
  //       A: optionsMatch[1],
  //       B: optionsMatch[2],
  //       C: optionsMatch[3],
  //       D: optionsMatch[4],
  //     };
  //     const correctOption = correctOptionMatch[1];

  //     const question = new Question({
  //       questionText,
  //       options,
  //       correctOption,
  //       subject,
  //       difficulty,
  //     });

  //     await question.save();

  //     res.status(201).json({ message: "Question added successfully.", question });
  //   } catch (error) {
  //     console.error("Error fetching question from OpenAI:", error);
  //     res.status(500).json({ error: "Failed to fetch question from OpenAI." });
  //   }

  try {
    // 1. Load and parse the JSON file
    const filePath = path.join(__dirname, "../data/questions.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const all = JSON.parse(raw);

    // 2. Grab the Python array
    const pythonQs = all.Python;
    if (!Array.isArray(pythonQs) || pythonQs.length === 0) {
      return res
        .status(404)
        .json({ error: "No Python questions found in data file." });
    }

    // 3. Map to your schema fields
    const docs = pythonQs.map((q) => ({
      text: q.question,
      options: [q.options.A, q.options.B, q.options.C, q.options.D],
      correctOption: q.correct,
      subject: "Python",
      difficulty:
        q.difficulty.charAt(0).toUpperCase() +
        q.difficulty.slice(1).toLowerCase(), // Easy/Medium/Hard
    }));

    // 4. Bulk insert
    const inserted = await Question.insertMany(docs);

    res
      .status(201)
      .json({ message: `Seeded ${inserted.length} Python questions.` });
  } catch (err) {
    console.error("Error seeding Python questions:", err);
    res.status(500).json({ error: "Failed to seed Python questions." });
  }
};

module.exports.startQuiz = async (req, res) => {
  const { subject, difficulty, title } = req.query;
  const userId = req.user._id;
  if (!subject || !difficulty) {
    return res
      .status(400)
      .json({ error: "Subject and difficulty are required." });
  }
  console.log("Starting quiz for user:", userId);
  console.log("Subject:", subject, "Difficulty:", difficulty);
  try {
    const query = {};
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    console.log("Querying for questions:", query);
    const questions = await Question.find(query);
    console.log("Fetched questions:", questions);
    const quiz = await Quiz.create({
      userId,
      questions: questions.map((q) => ({
        questionId: q._id,
        userResponse: null,
        isCorrect: null,
      })),
      totalQuestions: questions.length,
      subject,
      difficulty,
      status: "Started",
      startTime: new Date(),
      Title: title,
    });
    res.status(200).json({
      questions,
      quizId: quiz._id,
      message: "Quiz started successfully.",
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
};

// module.exports.submitQuiz = async (req, res) => {
//   try {
//     const { userId, quizId, answers, endTime } = req.body;

//     // Find the quiz and ensure it exists and belongs to the user
//     console.log("Submitting quiz for user:", userId, "Quiz ID:", quizId);
//     console.log("Answers provided:", answers);

//     const quiz = await Quiz.findOne({
//       _id: quizId,
//       userId,
//       status: "Started",
//     }).populate("questions.questionId");

//     if (!quiz) {
//       return res.status(404).json({
//         success: false,
//         message: "Quiz not found or already submitted.",
//       });
//     }
//     console.log("Quiz found yessssss:", quiz);
//     // Get the user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Calculate score and evaluate answers
//     let score = 0;
//     const evaluatedQuestions = quiz.questions.map((question, index) => {
//       const userAnswer = answers[index]?.number || null;
//       const correctAnswer = question.questionId.correctOption;
//       console.log("correctAnswer:", correctAnswer);
//       console.log("userAnswer:", userAnswer);
//       const isCorrect = userAnswer === correctAnswer;

//       if (isCorrect) {
//         score += 4;
//       } else if (userAnswer) {
//         score -= 1;
//       }

//       return {
//         questionId: question.questionId._id,
//         selectedOption: userAnswer?.value || null,
//         correctOption: correctAnswer,
//         isCorrect: isCorrect,
//       };
//     });
//     console.log("Evaluated questions:", evaluatedQuestions);
//     // Calculate statistics
//     const totalQuestions = quiz.questions.length;
//     const attemptedQuestions = answers.filter(
//       (answer) => answer?.value != null
//     ).length;
//     const correctAnswers = evaluatedQuestions.filter((q) => q.isCorrect).length;
//     const incorrectAnswers = attemptedQuestions - correctAnswers;
//     const skippedQuestions = totalQuestions - attemptedQuestions;
//     const accuracy = (correctAnswers / totalQuestions) * 100;

//     // Update quiz with results
//     quiz.questions = evaluatedQuestions;
//     quiz.endTime = endTime;
//     quiz.score = score;
//     quiz.status = "Completed";
//     await quiz.save();

//     // Create result document with all required fields
//     const result = new Result({
//       userId,
//       quizId: quiz._id,
//       score,
//       totalQuestions,
//       subject: quiz.subject || "Python", // Make sure subject is passed
//       difficulty: quiz.difficulty || "Medium", // Make sure difficulty is passed
//       questions: evaluatedQuestions,
//       timeStats: {
//         startTime: quiz.startTime,
//         endTime: endTime,
//         timeTaken: Math.floor(
//           (new Date(endTime) - new Date(quiz.startTime)) / 1000
//         ),
//       },
//       statistics: {
//         attemptedQuestions,
//         correctAnswers,
//         incorrectAnswers,
//         accuracy: parseFloat(accuracy.toFixed(2)),
//         skippedQuestions,
//       },
//       date: new Date(), // Add current date
//     });

//     await result.save();

//     // Update user statistics
//     user.quizzesTaken += 1;
//     user.totalScore += score;
//     user.progressHistory.push({
//       quizId: quiz._id,
//       score,
//       completedAt: new Date(),
//       accuracy: parseFloat(accuracy.toFixed(2)),
//     });
//     await user.save();

//     // Send response
//     return res.status(200).json({
//       success: true,
//       message: "Quiz submitted successfully",
//       data: {
//         quizId: quiz._id,
//         score,
//         totalQuestions,
//         statistics: {
//           attemptedQuestions,
//           correctAnswers,
//           incorrectAnswers,
//           accuracy: accuracy.toFixed(2),
//           skippedQuestions,
//           timeTaken: `${Math.floor(result.timeStats.timeTaken / 60)}m ${
//             result.timeStats.timeTaken % 60
//           }s`,
//         },
//         result: result._id,
//       },
//     });
//   } catch (error) {
//     console.error("Error submitting quiz:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to submit quiz",
//       error: error.message,
//     });
//   }
// };

module.exports.submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, answers, endTime } = req.body;

    // Find the quiz and ensure it exists and belongs to the user
    console.log("Submitting quiz for user:", userId, "Quiz ID:", quizId);
    console.log("Answers provided:", answers);

    const quiz = await Quiz.findOne({
      _id: quizId,
      userId,
      status: "Started",
    }).populate("questions.questionId");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found or already submitted.",
      });
    }
    console.log("Quiz found yessssss:", quiz);

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Calculate score and evaluate answers
    let score = 0;
    const evaluatedQuestions = quiz.questions.map((question, index) => {
      const userAnswer = answers[index]?.number || null;
      const correctAnswer = question.questionId.correctOption;
      console.log("correctAnswer:", correctAnswer);
      console.log("userAnswer:", userAnswer);
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        score += 4;
      } else if (userAnswer) {
        score -= 1;
      }

      return {
        questionId: question.questionId._id,
        selectedOption: userAnswer?.value || null,
        correctOption: correctAnswer,
        isCorrect: isCorrect,
      };
    });
    console.log("Evaluated questions:", evaluatedQuestions);

    // Calculate statistics
    const totalQuestions = quiz.questions.length;
    const attemptedQuestions = answers.filter(
      (answer) => answer?.value != null
    ).length;
    const correctAnswers = evaluatedQuestions.filter((q) => q.isCorrect).length;
    const incorrectAnswers = attemptedQuestions - correctAnswers;
    const skippedQuestions = totalQuestions - attemptedQuestions;
    const accuracy = (correctAnswers / totalQuestions) * 100;

    // Calculate completion time in seconds
    const completionTimeInSeconds = Math.floor(
      (new Date(endTime) - new Date(quiz.startTime)) / 1000
    );

    // Update quiz with results
    quiz.questions = evaluatedQuestions;
    quiz.endTime = endTime;
    quiz.score = score;
    quiz.status = "Completed";
    await quiz.save();

    // Create result document with all required fields
    const result = new Result({
      userId,
      quizId: quiz._id,
      score,
      totalQuestions,
      subject: quiz.subject || "Python", // Make sure subject is passed
      difficulty: quiz.difficulty || "Medium", // Make sure difficulty is passed
      questions: evaluatedQuestions,
      timeStats: {
        startTime: quiz.startTime,
        endTime: endTime,
        timeTaken: completionTimeInSeconds,
      },
      statistics: {
        attemptedQuestions,
        correctAnswers,
        incorrectAnswers,
        accuracy: parseFloat(accuracy.toFixed(2)),
        skippedQuestions,
      },
      date: new Date(), // Add current date
    });

    await result.save();

    // Create leaderboard entry
    try {
      const leaderboardEntry = new LeaderBoard({
        userId: userId,
        subject: quiz.subject || "Python",
        difficulty: quiz.difficulty || "Medium",
        score: score, // Ensure score is not negative for leaderboard
        completionTime: completionTimeInSeconds,
        submittedAt: new Date(endTime),
      });

      await leaderboardEntry.save();
      console.log("Leaderboard entry created successfully");
    } catch (leaderboardError) {
      console.error("Error creating leaderboard entry:", leaderboardError);
      // Don't fail the entire submission if leaderboard entry fails
      // Just log the error and continue
    }

    // Update user statistics
    user.quizzesTaken += 1;
    user.totalScore += score;
    user.progressHistory.push({
      quizId: quiz._id,
      score,
      completedAt: new Date(),
      accuracy: parseFloat(accuracy.toFixed(2)),
    });
    await user.save();

    // Send response
    return res.status(200).json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        quizId: quiz._id,
        score,
        totalQuestions,
        statistics: {
          attemptedQuestions,
          correctAnswers,
          incorrectAnswers,
          accuracy: accuracy.toFixed(2),
          skippedQuestions,
          timeTaken: `${Math.floor(completionTimeInSeconds / 60)}m ${
            completionTimeInSeconds % 60
          }s`,
        },
        result: result._id,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
      error: error.message,
    });
  }
};

module.exports.getPastQuizzes = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }
  try {
    const quizzes = await Quiz.find({ userId, status: "Completed" });
    console.log("Past quizzes found:", quizzes);
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching past quizzes:", error);
    res.status(500).json({ error: "Failed to fetch past quizzes." });
  }
};

module.exports.getQuizResult = async (req, res) => {
  try {
    const { quizId } = req.params;
    console.log("Fetching quiz result for quizId:", quizId);

    // Find the result with populated questions
    const result = await Result.findOne({ quizId }).populate({
      path: "questions.questionId",
      select: "text options correctOption",
    });

    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    // Find the related quiz
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions.questionId",
      select: "text options correctOption",
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Create the response object with all necessary data
    const response = {
      quiz: {
        _id: quiz._id,
        Title: quiz.Title || "Quiz",
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        totalQuestions: quiz.totalQuestions,
        score: result.score,
        startTime: quiz.startTime,
        endTime: quiz.endTime,
        questions: result.questions.map((q) => ({
          questionId: {
            text: q.questionId.text,
            options: q.questionId.options,
            correctOption: q.correctOption, // Changed from q.questionId.correctOption
          },
          userResponse: {
            // Add the proper userResponse structure
            number: q.selectedOption
              ? String.fromCharCode(
                  65 + q.questionId.options.indexOf(q.selectedOption)
                )
              : null,
            value: q.selectedOption,
          },
          isCorrect: q.isCorrect,
        })),
      },
      statistics: result.statistics,
      timeStats: {
        startTime: result.timeStats.startTime,
        endTime: result.timeStats.endTime,
        timeTaken: `${Math.floor(result.timeStats.timeTaken / 60)}m ${
          result.timeStats.timeTaken % 60
        }s`,
      },
      score: result.score,
      accuracy: result.statistics.accuracy,
      user: quiz.userId,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getQuizResult:", error);
    res.status(500).json({
      error: "Failed to fetch quiz result",
      details: error.message,
    });
  }
};
