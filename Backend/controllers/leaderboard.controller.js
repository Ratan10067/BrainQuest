const mongoose = require("mongoose");
const LeaderBoard = require("../models/leaderboard.model");

// module.exports.getLeaderboard = async (req, res) => {
//   try {
//     const leaderboards = await LeaderBoard.aggregate([
//       {
//         // Populate user information
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userId",
//         },
//       },
//       {
//         // Unwind the user array
//         $unwind: "$userId",
//       },
//       {
//         // Group by subject and difficulty
//         $group: {
//           _id: {
//             subject: "$subject",
//             difficulty: "$difficulty",
//           },
//           entries: {
//             $push: {
//               // Include ALL user information instead of just selected fields
//               userId: "$userId", // This will include all user fields
//               score: "$score",
//               completionTime: "$completionTime",
//               submittedAt: "$submittedAt",
//             },
//           },
//           totalParticipants: { $sum: 1 },
//         },
//       },
//       {
//         // Sort entries within each group by score (desc) and completion time (asc)
//         $addFields: {
//           entries: {
//             $map: {
//               input: {
//                 $slice: [
//                   {
//                     $sortArray: {
//                       input: "$entries",
//                       sortBy: { score: -1, completionTime: 1 },
//                     },
//                   },
//                   50, // Limit to top 50 per category
//                 ],
//               },
//               as: "entry",
//               in: {
//                 userId: "$entry.userId", // All user fields will be preserved
//                 score: "$entry.score",
//                 completionTime: "$entry.completionTime",
//                 submittedAt: "$entry.submittedAt",
//                 rank: {
//                   $add: [
//                     {
//                       $indexOfArray: [
//                         {
//                           $slice: [
//                             {
//                               $sortArray: {
//                                 input: "$entries",
//                                 sortBy: { score: -1, completionTime: 1 },
//                               },
//                             },
//                             50,
//                           ],
//                         },
//                         "$entry",
//                       ],
//                     },
//                     1,
//                   ],
//                 },
//               },
//             },
//           },
//         },
//       },
//       {
//         // Project final structure
//         $project: {
//           _id: {
//             $concat: [
//               { $toLower: "$_id.subject" },
//               "_",
//               { $toLower: "$_id.difficulty" },
//             ],
//           },
//           subject: "$_id.subject",
//           difficulty: "$_id.difficulty",
//           totalParticipants: 1,
//           entries: 1,
//         },
//       },
//       {
//         // Sort by subject and difficulty
//         $sort: {
//           subject: 1,
//           difficulty: 1,
//         },
//       },
//     ]);

//     // Return the leaderboards array directly to match frontend expectations
//     res.status(200).json(leaderboards);
//   } catch (error) {
//     console.error("Error fetching leaderboards:", error);

//     // For errors, you can still return a structured response
//     // but make sure your frontend handles this case
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch leaderboards",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// In your backend leaderboard controller
module.exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboards = await LeaderBoard.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $group: {
          _id: {
            subject: "$subject",
            difficulty: "$difficulty",
          },
          entries: {
            $push: {
              userId: {
                _id: "$userId._id",
                name: "$userId.name",
                email: "$userId.email",
                phone: { $ifNull: ["$userId.phone", "Not provided"] },
                location: { $ifNull: ["$userId.location", "Unknown"] },
                avatar: { $ifNull: ["$userId.avatar", "default-avatar.png"] },
                quizzesTaken: { $ifNull: ["$userId.quizzesTaken", 0] },
                totalScore: { $ifNull: ["$userId.totalScore", 0] },
                createdAt: { $ifNull: ["$userId.createdAt", new Date()] },
              },
              score: "$score",
              completionTime: "$completionTime",
              submittedAt: "$submittedAt",
            },
          },
          totalParticipants: { $sum: 1 },
        },
      },
      {
        $addFields: {
          entries: {
            $map: {
              input: {
                $slice: [
                  {
                    $sortArray: {
                      input: "$entries",
                      sortBy: { score: -1, completionTime: 1 },
                    },
                  },
                  50,
                ],
              },
              as: "entry",
              in: {
                userId: "$$entry.userId",
                score: "$$entry.score",
                completionTime: "$$entry.completionTime",
                submittedAt: "$$entry.submittedAt",
                rank: {
                  $add: [
                    {
                      $indexOfArray: [
                        {
                          $slice: [
                            {
                              $sortArray: {
                                input: "$entries",
                                sortBy: { score: -1, completionTime: 1 },
                              },
                            },
                            50,
                          ],
                        },
                        "$$entry",
                      ],
                    },
                    1,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: {
            $concat: [
              { $toLower: "$_id.subject" },
              "_",
              { $toLower: "$_id.difficulty" },
            ],
          },
          subject: "$_id.subject",
          difficulty: "$_id.difficulty",
          totalParticipants: 1,
          entries: 1,
        },
      },
      {
        $sort: {
          subject: 1,
          difficulty: 1,
        },
      },
    ]);

    res.status(200).json(leaderboards);
  } catch (error) {
    console.error("Error fetching leaderboards:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboards",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
