const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ComponentSchema = new Schema({
  Name: { type: String, required: true },
  Desc: {type:Boolean, required:true, default:false},
  Img: { type: String, required: true},
  Details: { 
    series: {
      color: String,
      typo: String,
    },
    events: {
      color: String,
    },
    comics: {
      color: String,
      typo: String,
    },
  },
});

const ComponentModel = mongoose.model("Card", ComponentSchema);

module.exports = ComponentModel;
