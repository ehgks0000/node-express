const express = require("express");
const User = require("../models/Users")

const router = express.Router();

//유저 검색
router.get("/", async (req, res)=>{
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.json({message: err});
    }
});

//회원가입
router.post("/", async (req,res)=> {
    //body parser 필요 undefined 출력됨
    // console.log(req.body);
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        age: req.body.age,
    });
    //postman에서 post 할때 body를 json 형식으로 보내야한다.
    // console.log(user);

    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({message : err});
    }
});
//id값으로 특정 유저 검색
router.get("/:id", async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.json({message: err});
    }
})

module.exports = router;