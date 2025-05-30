const mongoose = require("mongoose");

const leaderBoardSchema = new mongoose.Schema({
    
})

const LeaderBoard = mongoose.model("leaderBoard", leaderBoardSchema);
module.exports = LeaderBoard;