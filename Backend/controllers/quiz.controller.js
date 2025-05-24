const OpenAI = require("openai");
const Question = require("../models/question.model");
const Result = require("../models/result.model");
const Quiz = require("../models/quiz.model");
const fs = require("fs");
const path = require("path");

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

module.exports.getQuestion = async (req, res) => {
  const { subject, difficulty } = req.query;

  try {
    const query = {};
    if (subject) query.subject = subject;
    if (difficulty) query.difficulty = difficulty;
    console.log("Querying for questions:", query);
    const questions = await Question.find(query);
    console.log("Fetched questions:", questions);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
};
