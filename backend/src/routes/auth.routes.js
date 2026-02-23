import express from "express";

const router = express.Router();


router.get('/signup', (req,res) => {

    res.json({msg: 'hello'});

})







export default router;