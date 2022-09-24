import React, { useState, useEffect } from "react";
import {
  saveToStorage,
  getFromStorage,
} from "./controllers/storageController.js";
import { render } from "react-dom";

function Popup() {
  return <div className="container"></div>;
}

render(<Popup />, document.getElementById("react-target"));
