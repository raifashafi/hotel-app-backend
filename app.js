const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const UserModel = require("./models/user")
const RoomModel = require("./models/addroom")
// const PostModel = require("./models/post")
// const AccModel = require("./models/profile")
const bodyParser = require('body-parser');
const Bill = require("./models/bill")
const Package = require("./models/Package")
const Paymentmodel = require("./models/payment")
// const Feedback = require("./models/feedback")
const Feedback = require("./models/feedback");

mongoose.connect("mongodb+srv://raifashafi:raifashafi@cluster0.tznb7.mongodb.net/hotelappDB?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

//api for signup
app.post("/UserSignup", async (req, res) => {
    let input = req.body
    let hashedPassword = bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword
    UserModel.find({ email: input.email }).then(
        (items) => {
            if (items.length > 0) {
                res.json({ "status": "email already exists" })
            }
            else {
                let result = new UserModel(input)
                result.save()
                res.json({ "status": "success" })
            }
        }
    ).catch(
        (error) => {
            console.log(error.message)
            alert(error.message)
        }
    )
})

//api for signin
app.post("/UserSignin", async (req, res) => {
    let input = req.body
    let result = UserModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {
                const passwordValidator = bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {
                    jwt.sign({ email: req.body.email, }, "Hotel-app", { expiresIn: "60d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "userId": items[0]._id })
                            }
                        }
                    )
                } else {
                    res.json({ "status": "Incorrect Password" })
                }
            } else {
                res.json({ "status": "Incorrect Email-id" })
            }
        }
    ).catch(
        (error) => {
            console.log(error.message)
            alert(error.message)
        }
    )
})

//api view user
app.post("/ViewUser", (req, res) => {
    UserModel.find().then(
        (data) => {
            res.json(data)
        }
    ).catch(
        (error) => {
            res.json(error)
        }
    )

})

//api for profile-post creation
app.post("/addroom", async (req, res) => {
    let input = req.body
    let token = req.headers.token
    jwt.verify(token, "Hotel-app", async (error, decoded) => {
        if (decoded && decoded.email) {
            let result = new RoomModel(input)
            await result.save()
            res.json({ "status": "success" })
        } else {
            res.json({ "status": "Invalid Authentication" })
        }
    })
})


app.post('/bill', async (req, res) => {
    try {
        const billData = req.body; // Get the bill data from request body
        const bill = new Bill(billData); // Create a new Bill instance
        await bill.save(); // Save it to the database
        res.status(201).json({ message: 'Bill saved successfully', bill });
    } catch (error) {
        console.error('Error saving bill:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error saving bill', error: error.message });
    }
});


//api for mypost
// app.post("/ViewMine", (req, res) => {
//     let input = req.body
//     let token = req.headers.token
//     jwt.verify(token, "freelance-app", (error, decoded) => {
//         if (decoded && decoded.email) {
//             PostModel.find(input).then(
//                 (items) => {
//                     res.json(items)
//                 }
//             ).catch(
//                 (error) => {
//                     res.json({ "status": error })
//                 }
//             )
//         } else {
//             res.json({ "status": "Invalid autehntication" })
//         }
//     })
// })





//api for profile update - Account create
// app.post("/UpdateAccount", async (req, res) => {
//     let input = req.body
//     let token = req.headers.token
//     jwt.verify(token, "freelance-app", async (error, decoded) => {
//         if (decoded && decoded.email) {
//             let result = new AccModel(input)
//             await result.save()
//             res.json({ "status": "success" })
//         } else {
//             res.json({ "status": "Invalid Authentication" })
//         }
//     })
// })

// //api for view updated account
// app.post("/ViewAccount", (req, res) => {
//     let input = req.body
//     let token = req.headers.token
//     jwt.verify(token, "freelance-app", (error, decoded) => {
//         if (decoded && decoded.email) {
//             AccModel.find(input).then(
//                 (items) => {
//                     res.json(items)
//                 }
//             ).catch(
//                 (error) => {
//                     res.json({ "status": error })
//                 }
//             )
//         } else {
//             res.json({ "status": "Invalid authentication" })
//         }
//     })
// })

// //Search Post

// app.post("/PostSearch", (req, res) => {
//     let input = req.body
//     PostModel.find(input).then(
//         (data) => {
//             res.json(data)
//         }
//     ).catch(
//         (error) => {
//             res.json(error)
//         }
//     )
// })


//api for viewing all posts
app.post("/viewallroom", (req, res) => {
     let token = req.headers.token
     jwt.verify(token, "Hotel-app", (error, decoded) => {
         if (decoded && decoded.email) {
             RoomModel.find().then(
                 (items) => {
                     res.json(items)
                 }).catch(
                     (error) => {
                         res.json({ "status": "error" })
                     })
         } else {
             res.json({ "status": "Invalid Authentication" })
         }
     })
 })

  //delete user
  app.post("/delete", (req, res) => {
      let input = req.body
      UserModel.findByIdAndDelete(input._id).then(
          (response) => {
              res.json({ "status": "success" })
          }
      ).catch(
          (error) => {
              res.json({ "status": "error" })
          }
      )
 })

//packageselection
 app.post('/packages', async (req, res) => {
    try {
        const packages = await Package.find(); // Retrieve all packages
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error: error.message });
    }
});

app.post("/bill", (req, res) => {
    console.log("Received Bill Data:", req.body); // Log the incoming data

    const newBill = new Bill(req.body);
    newBill.save()
        .then(() => res.json({ status: "success" }))
        .catch((error) => {
            console.error("Bill Creation Error:", error);
            res.status(400).json({ status: "error", message: error.message });
        });
});


app.post("/payment", async (req, res) => {
    try {
        const { cardnum, cvv, dob, name, price } = req.body;

        // Validate that all fields are provided
        if (!cardnum || !cvv || !dob || !name || !price) {
            return res.status(400).json({ status: "error", message: "All payment fields are required" });
        }

        // Additional validation for card number and CVV
        if (cardnum.length < 12 || cardnum.length > 16) {
            return res.status(400).json({ status: "error", message: "Card number must be between 12 and 16 digits" });
        }
        if (cvv.length !== 3) {
            return res.status(400).json({ status: "error", message: "CVV must be 3 digits" });
        }

        // Create a new payment record
        const newPayment = new Paymentmodel({
            cardnum,
            cvv,
            dob,
            name,
            price
        });

        // Save the payment to the database
        await newPayment.save();
        res.status(201).json({ status: "success", message: "Payment added successfully" });

    } catch (error) {
        console.error("Error adding payment:", error.message);
        res.status(500).json({ status: "error", message: "Failed to add payment due to server error" });
    }
});
// app.post('/submitFeedback', async (req, res) => {
//     const token = req.headers.authorization; // Get token from 'Authorization' header

//     if (!token) {
//         return res.status(403).json({ message: "No token provided" });
//     }

//     try {
//         // Verify the token and extract customer ID from the token payload
//         const decoded = jwt.verify(token.split(' ')[1], 'Hotel-app'); // Assumes Bearer token format

//         const { feedbackText } = req.body;

//         if (!feedbackText) {
//             return res.status(400).json({ message: "Feedback text is required" });
//         }

//         // Create new feedback linked to the customerId from the token
//         const feedback = new Feedback({
//             customerId: decoded.customerId, // Extracted from the decoded token
//             feedbackText
//         });

//         // Save the feedback
//         await feedback.save();

//         res.status(201).json({ message: "Feedback submitted successfully" });
//     } catch (error) {
//         console.error('Error submitting feedback:', error);
//         res.status(500).json({ message: "Error submitting feedback", error: error.message });
//     }
// });
app.post("/submitFeedback", async (req, res) => {
    try {
        const {
            rating,
            easeOfUse,
            informationProvided,
            adoptionProcess,
            supportCommunication,
            suggestions,
            additionalComments,
            recommend,
        } = req.body;

        // Validate required fields
      

        const newFeedback = new Feedback({
            rating,
            suggestions,
            additionalComments,
            recommend
        });

        await newFeedback.save();
        return res.status(201).json({ status: "success", message: "Feedback submitted successfully." });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ status: "error", message: "Failed to submit feedback." });
    }
});
app.get("/viewFeedback", async (req, res) => {
    try {
        const feedbacks = await Feedback.find(); // Retrieve all feedbacks from the database
        return res.status(200).json({ status: "success", feedbacks });
    } catch (error) {
        console.error("Error retrieving feedback:", error);
        return res.status(500).json({ status: "error", message: "An error occurred while retrieving feedback." });
    }
});
 
app.listen(3035, () => {
    console.log("server started")
})