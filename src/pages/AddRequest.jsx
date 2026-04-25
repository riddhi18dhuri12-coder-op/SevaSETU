import { useState } from "react";
import { supabase } from "../services/supabaseClient";

export default function AddRequest() {
  const [category, setCategory] = useState("medical");
  const [urgency, setUrgency] = useState(3);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // 📍 Get user's current location (browser permission required)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // 📡 Insert into Supabase DB
      const { error } = await supabase.from("requests").insert([
        {
          category,
          urgency,
          description,
          latitude,
          longitude,
          city: "Mumbai", // 🇮🇳 Default for demo
          status: "pending"
        }
      ]);

      if (error) {
        alert("Error adding request");
        console.error(error);
      } else {
        alert("Request Added Successfully!");
      }
    });
  };

  return (
    <div>
      <h2>Add Request</h2>

      {/* 📂 Category Selection */}
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="medical">Medical</option>
        <option value="food">Food</option>
        <option value="shelter">Shelter</option>
      </select>

      {/* ⚡ Urgency Slider */}
      <input
        type="range"
        min="1"
        max="5"
        value={urgency}
        onChange={(e) => setUrgency(e.target.value)}
      />
      <p>Urgency: {urgency}</p>

      {/* 📝 Description */}
      <textarea
        placeholder="Describe the issue..."
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
