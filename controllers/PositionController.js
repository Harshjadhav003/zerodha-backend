const PositionModel = require("../model/PositionModel");
const redis = require("../config/redis");

exports.getPositions = async (req, res) => {
  try {

    const cacheKey =  `positions:${req.userId}`;
    // 1 . check Cache 
     const  cacheData =  await redis.get(cacheKey);
     if(cacheData){
      console.log(" POSITION CACHE HIT ");
      return res.json({
        success: true,
        data: JSON.parse(cacheData),
      });
      // db Call 
      
   }
   console.log("DB HIT ");
    const positions = await PositionModel.find({ userId: req.userId });
    // 3. Stroes in redis 
    await redis.setex(cacheKey,60 ,JSON.stringify(positions));
    res.json({ success: true, data: positions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};