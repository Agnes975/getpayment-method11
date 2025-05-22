require("dotenv").config();
const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log(process.env);

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Route to display the checkout form
app.get("/", (req, res) => {
  res.render("checkout");
});

// Route to handle form submission and create a checkout session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sample Product",
              images: ["https://example.com/product-image.png"], // replace with your product image URL
            },
            unit_amount: 2000, // Price in cents (e.g., $20.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Route to render the success page
app.get("/success", (req, res) => {
  res.render("success");
});

// Route to render the cancel page
app.get("/cancel", (req, res) => {
  res.render("cancel");
});

// Start the server

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});

// The use of async and await in the code is important for handling asynchronous operations in a clear and manageable way. In this case, the code is using async and await to handle the creation of a Stripe checkout session.
// Asynchronous Operations: Many operations in Node.js, like reading a file, making an HTTP request, or calling an external API (such as Stripe), are asynchronous. This means that the operation doesn't block the execution of other code while it is being completed.
