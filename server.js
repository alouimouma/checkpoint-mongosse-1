const express = require("express");
const mongoose = require("mongoose");

// Connexion to the DB
require("dotenv").config({ path: ".env" });

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connection successful");
    })
    .catch((err) => {
        console.error("Database connection error");
    });

// Create a person having this prototype

let Schema = mongoose.Schema;
const PersonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    age: Number,
    favoriteFoods: [String],
});

//Create a Mode:
var personModel = mongoose.model("person", PersonSchema);

// Create and Save a Record of a Model

let person = new personModel({
    name: "mohamed",
    age: 25,
    favoriteFoods: ["apple", "banana", "chocolate"],
});

person.save(function (err, data) {
    if (err) console.log("An error accured while saving the model");
    else console.log("The model was saved");
});

// Create Many Records with model.create()
var arrayOfPeople = [
    {
        name: "Ali",
        age: 20,
        favoriteFoods: ["orange", "chocolate", "Strawberry"],
    },
    { name: "Salah", age: 56, favoriteFoods: ["pizza", "apple", "fish"] },
    { name: "Amira", age: 19, favoriteFoods: ["pizza", "orange", "pasta"] },
    {
        name: "Ines",
        age: 45,
        favoriteFoods: ["apple", "chocolate", "Strawberry"],
    },
];
personModel.create(arrayOfPeople, (err, data) => {
    if (err) console.log("An error accured while saving models");
    else console.log("Models were saved");
});

// Search the Database using firstName
personModel
    .find({ name: "mohamed" })
    .then((doc) => {
        if (doc.length === 0) console.log("No entry found");
        else console.log(doc);
    })
    .catch((err) => {
        console.error(
            "An error accured while searching for a model by first name"
        );
    });

// Search the Database using favoriteFoods and Return a Single Matching Document
personModel
    .findOne({ favoriteFoods: { $in: ["orange"] } })
    .then((doc) => {
        if (doc.length === 0) console.log("No entry found");
        else console.log(doc);
    })
    .catch((err) => {
        console.error(
            "An error accured while searching for single a model by favorite food"
        );
    });

// Search the Database using model.findById() to Search By _id
personModel
    .findById({ _id: "5f71ca4f882c7118045e004c" })
    .then((doc) => {
        if (doc.length === 0) console.log("No entry found");
        else console.log(doc);
    })
    .catch((err) => {
        console.error("An error accured while searching for a model by ID");
    });

// Perform Classic Updates by Running Find, Edit, then Save
personModel.findById("60d2863f46bf811d33445dda", (err, person) => {
    if (err) console.log(err);
    else person.favoriteFoods.push("hamburger");
    person.save((err, person) => {
        if (err) console.log(err);
        else console.log(person);
    });
});

// Perform New Updates on a Document Using model.findOneAndUpdate()
personModel.findOneAndUpdate(
    { name: "Salah" },
    { age: 20 },
    { new: true },
    (err, person) => {
        if (err) console.log(err);
        else console.log(person);
    }
);

// Delete One Document Using model.findByIdAndRemove
personModel.findOneAndRemove("60d2863f46bf811d33445ddc", (err, person) => {
    if (err) console.log("An error accured while deleting a model by ID");
    console.log(person);
});

// MongoDB and Mongoose - Delete Many Documents with model.remove()
personModel.deleteMany({ name: "mary" }, (err, person) => {
    if (err) console.log(err);
    console.log("Persons with first name 'mary' were deleted");
});

// Chain Search Query Helpers to Narrow Search Results
personModel
    .find({ favoriteFoods: { $in: ["burrito"] } })
    .sort({ name: "asc" })
    .limit(2)
    .select("-age")
    .exec()
    .then((doc) => console.log(doc))
    .catch((err) => console.error(err));
