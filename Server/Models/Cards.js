const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ComponentSchema = new Schema({
  Name: { type: String, required: true },
  Desc: {type: String, required:true, default:"Unknown"},
  Img: { type: String, required: true},
  Details: {
    series: {names:[{ type: String }]},
    events: {names:[{ type: String }]},
    comics: {names:[{ type: String }]},
  },
});

const ComponentModel = mongoose.model("Card", ComponentSchema);

module.exports = ComponentModel;
