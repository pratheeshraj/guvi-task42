const User = require("../model/userModel")
const bcrypt = require("bcrypt")
exports.UserRegister = async (req, res) => {

    const { email, name, password } = req.body

    try {

        const user = await User.findOne({ email })

        if (user) {
           return res.status(400).json({
                success: false,
                message: "user already existed"
            })
        }

        const bcryptPassword = await bcrypt.hash(password, 12)
        console.log(bcryptPassword);

        const newUser = await User.create({ email, password: bcryptPassword, name })
       return res.status(201).json({
            success: true,
            newUser
        })
    } catch (error) {
      
        console.log(error);
    }


}

// login


exports.loginUser = async (req, res) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
          return  res.status(400).json({
                success: false,
                message: "user don't existed"
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
           return res.status(400).json({
                success: false,
                message: "invalied credentials"
            })
        }
       return res.status(201).json({
            success: true,
            user
        })


    } catch (error) {
console.log(error);
    }


}

