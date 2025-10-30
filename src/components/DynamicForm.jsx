import React, { useState } from "react";

export default function DynamicForm({ schema, onSubmit }) {
  const [values, setValues] = useState(() => {
    const obj = {};
    schema.fields.forEach((f) => (obj[f.name] = ""));
    return obj;
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
  };

  const submit = (e) => {
    e.preventDefault();
    const newErrors = {};
    schema.fields.forEach((f) => {
      if (f.required && !values[f.name]) {
        newErrors[f.name] = `${f.label} is required`;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSubmit(values);
  };

  return (
    <form onSubmit={submit} style={{ border: "1px solid #eee", padding: 12 }}>
      <h4 className="my-2 text-3xl">{schema.title}</h4>
      {schema.fields.length === 0 && <p>No fields yet</p>}

      {schema.fields.map((f) => (
        <div key={f.id} className="my-3">
          <label className="my-3">
            {f.label} {f.required && "*"}
          </label>
          <br />

          {f.type === "text" && (
            <input
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          )}
          {f.type === "number" && (
            <input
              type="number"
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          )}
          {f.type === "date" && (
            <input
              type="date"
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          )}
          {f.type === "select" && (
            <select
              value={values[f.name]}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="bg-primary border p-2"
            >
              <option value="">-- select --</option>
              {(f.options || []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}
          {errors[f.name] && (
            <div style={{ color: "red" }}>{errors[f.name]}</div>
          )}
        </div>
      ))}

      <button type="submit" className="my-3 px-2">
        Submit
      </button>
    </form>
  );
}
