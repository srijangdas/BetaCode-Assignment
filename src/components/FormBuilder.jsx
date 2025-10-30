import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DynamicForm from "./DynamicForm";

const makeField = (type) => ({
  id: uuidv4(),
  label: `${type} field`,
  name: `field_${Math.random().toString(36).slice(2, 8)}`,
  type,
  required: false,
  options: type === "select" ? ["Option 1", "Option 2"] : undefined,
});

export default function FormBuilder() {
  const [schema, setSchema] = useState({
    title: "Untitled Form",
    fields: [],
  });

  const addField = (type) => {
    setSchema({ ...schema, fields: [...schema.fields, makeField(type)] });
  };

  const updateField = (updated) => {
    setSchema({
      ...schema,
      fields: schema.fields.map((f) => (f.id === updated.id ? updated : f)),
    });
  };

  const removeField = (id) => {
    setSchema({ ...schema, fields: schema.fields.filter((f) => f.id !== id) });
  };

  const moveField = (from, to) => {
    const fields = [...schema.fields];
    const [moved] = fields.splice(from, 1);
    fields.splice(to, 0, moved);
    setSchema({ ...schema, fields });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(schema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "form-schema.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-2 gap-4 mx-4">
      <div>
        <div className="my-4 text-2xl">
          <label className="">Form Title: </label>
          <input
            className="text-white border border-white px-2 bg-primary"
            value={schema.title}
            onChange={(e) => setSchema({ ...schema, title: e.target.value })}
          />
        </div>

        <div className="mb-4 flex gap-5">
          <button onClick={() => addField("text")}>Add Text</button>{" "}
          <button onClick={() => addField("number")}>Add Number</button>{" "}
          <button onClick={() => addField("date")}>Add Date</button>{" "}
          <button onClick={() => addField("select")}>Add Dropdown</button>{" "}
          <button onClick={exportJSON}>Export JSON</button>
        </div>

        {schema.fields.length === 0 && (
          <p className="my-8 text-2xl">No fields added</p>
        )}
        {schema.fields.map((f, idx) => (
          <div
            key={f.id}
            style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{f.label}</strong> <small>({f.type})</small>
              <div>
                <button
                  disabled={idx === 0}
                  onClick={() => moveField(idx, idx - 1)}
                >
                  ↑
                </button>
                <button
                  disabled={idx === schema.fields.length - 1}
                  onClick={() => moveField(idx, idx + 1)}
                >
                  ↓
                </button>
                <button onClick={() => removeField(f.id)}>Delete</button>
              </div>
            </div>

            <div className="my-2">
              <div className="my-2">
                <label>Label: </label>
                <input
                  value={f.label}
                  onChange={(e) => updateField({ ...f, label: e.target.value })}
                />
              </div>
              <div className="my-2">
                <label>Name: </label>
                <input
                  value={f.name}
                  onChange={(e) => updateField({ ...f, name: e.target.value })}
                />
              </div>
              <div className="my-2">
                <label>Required: </label>
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={(e) =>
                    updateField({ ...f, required: e.target.checked })
                  }
                />
              </div>
              {f.type === "select" && (
                <div>
                  <label>Options (comma separated): </label>
                  <input
                    value={(f.options || []).join(",")}
                    onChange={(e) =>
                      updateField({
                        ...f,
                        options: e.target.value
                          .split(",")
                          .map((opt) => opt.trim()),
                      })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="my-3 text-3xl">Live Render:</h3>
        <DynamicForm
          schema={schema}
          onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        />

        <div className="my-3 bg-primary border">
          <h4 className="my-3 text-2xl">Raw Schema: </h4>
          <pre style={{ maxHeight: 300, overflow: "auto" }}>
            {JSON.stringify(schema, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
