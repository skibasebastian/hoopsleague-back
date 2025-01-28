const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'hoopsleague',
    database: 'hoopsleaguedb',
    dateStrings: ['DATETIME', 'DATE']
})

function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

app.use(cors(corsOption));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/api/', (req, res) => {
//     res.send("Siema");
// })

// ADD TEAM

app.get('/api/getteam', (req, res) => {
    const sqlSelect = 
    "SELECT * FROM team";

    db.query(sqlSelect, (err, result) => {
        // console.log(err);
        res.send(result);
    })
})

app.get('/api/getteamx', (req, res) => {
    const sqlSelect = 
    "SELECT DATE_FORMAT(`GameDateTime`, '%Y-%m-%d %H:%i') AS `formatted_date` FROM `game`"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getteamdetails', (req, res) => {
    const TeamID = req.query.TeamID;
    const sqlSelect = 
    "SELECT * FROM team WHERE TeamID = ?";

    db.query(sqlSelect,TeamID, (err, result) => {
        res.send(result);
    })
})

app.post('/api/insertteam/', (req, res) => {
    const TeamName = req.body.TeamName;
    const TeamLogo = req.body.TeamLogo;
    const sqlInsert = 
    "INSERT INTO team (TeamName, TeamLogo) VALUES (?, ?)";

    db.query(sqlInsert, [TeamName, TeamLogo], (err, result) => {
        console.log(result);
    })
});

app.delete('/api/deleteteam/:TeamName', (req, res) => {
    const TeamName = req.params.TeamName;
    const sqlDelete = 
    "DELETE FROM team WHERE TeamName = ?";

    db.query(sqlDelete, TeamName, (err, result) => {
        if (err) console.log(err);
    })
})

// ADD PLAYER

app.get('/api/getplayer', (req, res) => {
    const sqlSelect = 
    "SELECT player.*, TeamName FROM player, team" +
    " WHERE team.TeamID=player.PlayerTeamID ORDER BY LastName";

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getplayerfromteam', (req, res) => {
    const TeamID = req.query.TeamID;
    const sqlSelect = 
    "SELECT *, TeamName FROM player, team" +
    " WHERE team.TeamID=player.PlayerTeamID AND TeamID = ?" +
    " ORDER BY LastName";

    db.query(sqlSelect, TeamID, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getplayerfromgame', (req, res) => {
    const GameID = req.query.idgame;
    const sqlSelect = 
    "SELECT player.*, GameID FROM player, game" +
    " WHERE (game.AwayTeamID = player.PlayerTeamID"+
    " OR game.HomeTeamID = player.PlayerTeamID)" +
    " AND game.GameID=?" +
    " ORDER BY player.PlayerTeamID"

    db.query(sqlSelect, GameID, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getplayerdetails', (req, res) => {
    const PlayerID = req.query.PlayerID;
    const sqlSelect = 
    "SELECT player.*, TeamName, TeamLogo FROM player, team " +
    " WHERE team.TeamID=player.PlayerTeamID AND player.PlayerID = ?"

    db.query(sqlSelect, PlayerID, (err, result) => {
        res.send(result);
    })
})

app.post('/api/insertplayer/', (req, res) => {
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Jersey = req.body.Jersey;
    const Position = req.body.Position;
    const Height = req.body.Height;
    const Weight = req.body.Weight;
    const Team = req.body.PlayerTeamID;
    const PlayerImage = req.body.PlayerImage;

    const sqlInsert = 
    "INSERT INTO player (FirstName, LastName, Jersey, Position, Height, Weight, PlayerTeamID, PlayerImage)" +
    " VALUES (?,?,?,?,?,?,?,?)";

    db.query(sqlInsert, [FirstName, LastName, Jersey, Position, Height, Weight, Team, PlayerImage], (err, result) => {
        console.log(result);
    })
});

// ADD ACTION

app.post('/api/insertplayerstats/', (req, res) => {
    const GameID = req.body.GameID;
    const PlayerID = req.body.PlayerID;
    const Minutes = req.body.Minutes;
    const Seconds = req.body.Seconds;
    const FieldGoalsMade = req.body.FieldGoalsMade;
    const FieldGoalsAttempted = req.body.FieldGoalsAttempted;
    const TwoPointersMade = req.body.TwoPointersMade;

    const TwoPointersAttempted = req.body.TwoPointersAttempted;
    const ThreePointersMade = req.body.ThreePointersMade;
    const ThreePointersAttempted = req.body.ThreePointersAttempted;
    const FreeThrowsMade = req.body.FreeThrowsMade;
    const FreeThrowsAttempted = req.body.FreeThrowsAttempted;
    const OffensiveRebounds = req.body.OffensiveRebounds;
    const DefensiveRebounds = req.body.DefensiveRebounds;

    const Assists = req.body.Assists;
    const Steals = req.body.Steals;
    const Blocks = req.body.Blocks;
    const Turnovers = req.body.Turnovers;
    const PersonalFouls = req.body.PersonalFouls;
    const Points = req.body.Points;
    const PER = req.body.PER;

    const sqlInsert = 
    "INSERT INTO actions (GameID, PlayerID, Minutes, Seconds, FieldGoalsMade, FieldGoalsAttempted," +
    " TwoPointersMade, TwoPointersAttempted, ThreePointersMade, ThreePointersAttempted," +
    " FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds,"+
    " Assists, Steals, Blocks, Turnovers, PersonalFouls, Points, PER) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)" 

    db.query(sqlInsert, [
        GameID, PlayerID, Minutes, Seconds, FieldGoalsMade, FieldGoalsAttempted, 
        TwoPointersMade, TwoPointersAttempted, ThreePointersMade, ThreePointersAttempted, 
        FreeThrowsMade, FreeThrowsAttempted, OffensiveRebounds, DefensiveRebounds,
        Assists, Steals, Blocks, Turnovers, PersonalFouls, Points, PER
        ], (err, result) => {
        console.log(result);
    })
});

// app.get('/api/getplayeractionsfromgame', (req, res) => {
//     const GameID = req.query.idgame;
//     // const GameID = 38;
//     const sqlSelect = 
//     "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName, p.PlayerTeamID AS TeamID" +
//     " FROM actions AS a" +
//     " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
//     " WHERE a.GameID=?" +
//     " ORDER BY TeamID, a.Minutes DESC"

//     db.query(sqlSelect,GameID, (err, result) => {
//         res.send(result);
//     })
// })

app.get('/api/getawayplayeractionsfromgame', (req, res) => {
    const GameID = req.query.idgame;
    const sqlSelect = 
    "SELECT xxx.*, t.TeamName as PlayerTeamName" +
    " FROM ( SELECT xx.*, p.FirstName AS FirstName, p.LastName AS LastName, p.PlayerTeamID as PlayerTeamID" +
    " FROM " +
    " ( SELECT a.*, g.AwayTeamID AS AwayTeamID, g.HomeTeamID AS HomeTeamID" +
    " FROM actions AS a" +
    " LEFT JOIN game AS g ON a.GameID = g.GameID" +
    " WHERE a.GameID=? ) xx" +
    " LEFT JOIN player AS p ON xx.PlayerID = p.PlayerID" +
    " WHERE xx.AwayTeamID = PlayerTeamID ) xxx" +
    " LEFT JOIN team AS t ON xxx.PlayerTeamID = t.TeamID" +
    " ORDER BY xxx.Minutes DESC, xxx.Seconds DESC"

    db.query(sqlSelect,GameID, (err, result) => {
        res.send(result);
    })
})

app.get('/api/gethomeplayeractionsfromgame', (req, res) => {
    const GameID = req.query.idgame;
    const sqlSelect = 
    "SELECT xxx.*, t.TeamName as PlayerTeamName" +
    " FROM ( SELECT xx.*, p.FirstName AS FirstName, p.LastName AS LastName, p.PlayerTeamID as PlayerTeamID" +
    " FROM " +
    " ( SELECT a.*, g.AwayTeamID AS AwayTeamID, g.HomeTeamID AS HomeTeamID" +
    " FROM actions AS a" +
    " LEFT JOIN game AS g ON a.GameID = g.GameID" +
    " WHERE a.GameID=? ) xx" +
    " LEFT JOIN player AS p ON xx.PlayerID = p.PlayerID" +
    " WHERE xx.HomeTeamID = PlayerTeamID ) xxx" +
    " LEFT JOIN team AS t ON xxx.PlayerTeamID = t.TeamID" +
    " ORDER BY xxx.Minutes DESC, xxx.Seconds DESC"

    db.query(sqlSelect,GameID, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getplayeractions', (req, res) => {
    const PlayerID = req.query.PlayerID;
    const sqlSelect = 
    "SELECT a.*, DATE_FORMAT(g.GameDateTime, '%Y-%m-%d %H:%i') AS GameDateTime" +
    " FROM actions AS a" +
    " LEFT JOIN game AS g ON a.GameID = g.GameID" +
    " WHERE a.PlayerID=?" +
    " ORDER BY GameDateTime DESC"

    db.query(sqlSelect,PlayerID, (err, result) => {
        res.send(result);
    })
})

app.get('/api/getplayeravgs', (req, res) => {
    const PlayerID = req.query.PlayerID;
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(Points) as ppg, " +
    " AVG(OffensiveRebounds+DefensiveRebounds) as rebpg," +
    " AVG(Assists) as apg," +
    " AVG(PER) as per," +
    " AVG(Steals) as stl," +
    " AVG(Blocks) as blk," +
    " SUM(ThreePointersMade+TwoPointersMade) as fgm," +
    " SUM(ThreePointersAttempted+TwoPointersAttempted) as fga," +
    " SUM(ThreePointersMade) as threepm," +
    " SUM(ThreePointersAttempted) as threepa," +
    " SUM(FreeThrowsMade) as ftm," +
    " SUM(FreeThrowsAttempted) as fta," +
    " AVG(Minutes) as mpg" +
    " FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " WHERE a.PlayerID =?" 

    db.query(sqlSelect,PlayerID, (err, result) => {
        res.send(result);
    })
})

// STATS LEADERS

app.get('/api/ppgleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(Points) as ppg FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY ppg DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/rebleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(OffensiveRebounds+DefensiveRebounds) as rebpg FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY rebpg DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/astleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(Assists) as apg FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY apg DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/blkleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(Blocks) as blk FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY blk DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/stlleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(Steals) as stl FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY stl DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/threeptleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, SUM(ThreePointersMade) as threept" +
    " FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY threept DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/threeptprcleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, " +
    " ROUND(100.0*SUM(ThreePointersMade)/SUM(ThreePointersAttempted),2) AS threeptprc" +
    " FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY threeptprc DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/fgprcleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    // " FROM (SELECT PlayerID, 100.0*AVG((ThreePointersMade+TwoPointersMade)/(ThreePointersAttempted+TwoPointersAttempted)) as fgprc FROM actions GROUP BY PlayerID) a" +
    " FROM (SELECT PlayerID, ROUND(100.0*SUM(ThreePointersMade+TwoPointersMade)/SUM(ThreePointersAttempted+TwoPointersAttempted),2) as fgprc FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY fgprc DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/ftprcleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, CAST((100.0*SUM(FreeThrowsMade)/SUM(FreeThrowsAttempted)) AS DECIMAL(5,2)) as ftprc FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY ftprc DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

app.get('/api/perleaders', (req, res) => {
    const sqlSelect = 
    "SELECT a.*, p.FirstName AS FirstName, p.LastName AS LastName" +
    " FROM (SELECT PlayerID, AVG(PER) as per FROM actions GROUP BY PlayerID) a" +
    " LEFT JOIN player AS p ON a.PlayerID = p.PlayerID"+
    " GROUP BY a.PlayerID" +
    " ORDER BY per DESC" +
    " LIMIT 5"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
    })
})

// ADD SCORE

app.get('/api/getscores/', (req, res) => {
    const sqlSelect = 
    "SELECT g.*, a.TeamName AS AwayTeamName, a.TeamLogo AS AwayTeamLogo," +
    " b.TeamName AS HomeTeamName, b.TeamLogo AS HomeTeamLogo, " +
    "DATE_FORMAT(`GameDateTime`, '%Y-%m-%d %H:%i') AS `FormDate`" +
     " FROM game AS g " +
     " LEFT JOIN team AS a ON g.AwayTeamID=a.TeamID" +
     " LEFT JOIN team AS b ON g.HomeTeamID=b.TeamID" +
     " WHERE g.GameDateTime < ?" +
     " ORDER BY g.GameDateTime DESC"
    
    db.query(sqlSelect, getDateTime(), (err, result) => {
        res.send(result);
        return true;
    })
})

app.delete('/api/deletescore/:GameID', (req, res) => {
    const GameID = req.params.GameID;
    const sqlDelete = 
    "DELETE FROM game WHERE GameID = ?";

    db.query(sqlDelete, GameID, (err, result) => {
        if (err) console.log(err);
    })
})


app.get('/api/gettable/', (req, res) => {
    const sqlSelect = 
    "SELECT tt.TeamID, tt.TeamName, tt.TeamLogo," +
    " SUM(CASE WHEN result > 0 THEN 1 ELSE 0 END) AS TotalWins," +
    " SUM(CASE WHEN result < 0 THEN 1 ELSE 0 END) AS TotalLosses" +
    " FROM (" +
    " SELECT t.TeamID, t.TeamName, t.TeamLogo," +
    " (g.HomeTeamScore - g.AwayTeamScore) * CASE" +
    " WHEN t.TeamID = g.HomeTeamID THEN 1" + 
    " WHEN t.TeamID = g.AwayTeamID THEN -1" + 
    " END result" + 
    " FROM team AS t LEFT JOIN game AS g"+
    " ON t.TeamID in (g.HomeTeamID, g.AwayTeamID)" +
    ") tt" +
    " GROUP BY tt.TeamID, tt.TeamName"+
    " ORDER BY TotalWins DESC, TotalLosses DESC"

    db.query(sqlSelect, (err, result) => {
        res.send(result);
        return true;
    })
})

app.post('/api/insertscoreawaywin/', (req, res) => {
    const GameID = req.body.GameID;
    const AwayTeamScore = req.body.AwayTeamScore;
    const HomeTeamScore = req.body.HomeTeamScore;

    const sqlInsert = 
    "UPDATE game SET AwayTeamScore = ?, HomeTeamScore = ?," +
    " WinTeamID = AwayTeamID, LoseTeamID = HomeTeamID" +
    " WHERE GameID = ?"

    db.query(sqlInsert, [AwayTeamScore, HomeTeamScore, GameID], (err, result) => {
        console.log(result);
        return true;
    })
});

app.post('/api/insertscorehomewin/', (req, res) => {
    const GameID = req.body.GameID;
    const AwayTeamScore = req.body.AwayTeamScore;
    const HomeTeamScore = req.body.HomeTeamScore;

    const sqlInsert = 
    "UPDATE game SET AwayTeamScore = ?, HomeTeamScore = ?," +
    " WinTeamID = HomeTeamID, LoseTeamID = AwayTeamID" +
    " WHERE GameID = ?"

    db.query(sqlInsert, [AwayTeamScore, HomeTeamScore, GameID], (err, result) => {
        console.log(result);
        return true;
    })
});

app.get('/api/getgamedetails/', (req, res) => {

    const GameID = req.query.idgame;

    const sqlSelect = 
    "SELECT g.*, a.TeamName AS AwayTeamName , b.TeamName AS HomeTeamName," +
    "DATE_FORMAT(`GameDateTime`, '%Y-%m-%d %H:%i') AS `FormDate`" +
     " FROM game AS g " +
     " LEFT JOIN team AS a ON g.AwayTeamID=a.TeamID" +
     " LEFT JOIN team AS b ON g.HomeTeamID=b.TeamID" +
     " WHERE g.GameDateTime < ? AND g.GameID = ?"
    
    db.query(sqlSelect, [getDateTime(), GameID], (err, result) => {
        // console.log(GameID);
        res.send(result);
        return true;
    })
})

// ADD GAME IN SCHEDULE

app.get('/api/getschedule/', (req, res) => {
    const sqlSelect = 
    "SELECT g.*, a.TeamName AS AwayTeamName, a.TeamLogo AS AwayTeamLogo," +
    " b.TeamName AS HomeTeamName, b.TeamLogo AS HomeTeamLogo, " +
    "DATE_FORMAT(`GameDateTime`, '%Y-%m-%d %H:%i') AS `FormDate`" +
     " FROM game AS g " +
     " LEFT JOIN team AS a ON g.AwayTeamID=a.TeamID" +
     " LEFT JOIN team AS b ON g.HomeTeamID=b.TeamID" +
     " WHERE g.GameDateTime > ?" +
     " ORDER BY g.GameDateTime ASC"
    
    db.query(sqlSelect, getDateTime(), (err, result) => {
        res.send(result);
        //console.log(getDateTime);
        return true;
    })
})

app.get('/api/getschedulenoscore/', (req, res) => {
    const sqlSelect = 
    "SELECT g.*, a.TeamName AS AwayTeamName , b.TeamName AS HomeTeamName," +
    "DATE_FORMAT(`GameDateTime`, '%Y-%m-%d %H:%i') AS `FormDate`" +
     " FROM game AS g " +
     " LEFT JOIN team AS a ON g.AwayTeamID=a.TeamID" +
     " LEFT JOIN team AS b ON g.HomeTeamID=b.TeamID" +
     " WHERE g.GameDateTime < ? AND g.AwayTeamScore IS NULL" +
     " ORDER BY g.GameDateTime ASC"
    
    db.query(sqlSelect, getDateTime(), (err, result) => {
        res.send(result);
        return true;
    })
})

app.post('/api/insertschedule/', (req, res) => {
    const AwayTeamID = req.body.AwayTeamID;
    const HomeTeamID = req.body.HomeTeamID;
    const GameDateTime = req.body.GameDateTime;

    const sqlInsert = 
    "INSERT INTO game (AwayTeamID, HomeTeamID, GameDateTime) VALUES (?,?,?)";

    db.query(sqlInsert, [AwayTeamID, HomeTeamID, GameDateTime], (err, result) => {
        console.log(result);
    })
});

// NEWS - POST AND GET

app.post('/api/insertnews/', (req, res) => {
    const NewsTitle = req.body.NewsTitle;
    const NewsText = req.body.NewsText;

    const sqlInsert = 
    "INSERT INTO news (NewsTitle, NewsText, DateTime) VALUES (?,?,?)";

    db.query(sqlInsert, [NewsTitle, NewsText, getDateTime()], (err, result) => {
        console.log(result);
    })
});

app.get('/api/getnewsdata', (req, res) => {
    const sqlSelect = 
    "SELECT * , " +
    "DATE_FORMAT(`DateTime`, '%Y-%m-%d %H:%i') AS `FormDate` " +
    "FROM news" +
    " ORDER BY DateTime DESC";

    db.query(sqlSelect, (err, result) => {
        console.log(err);
        res.send(result);
    })
})


app.listen(3001, () => {
    console.log("running on port 3001");
    console.log(getDateTime());
});