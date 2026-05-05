import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {

  const [token, setToken] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [selectedReview, setSelectedReview] = useState("");
  const [feedbackEmployee, setFeedbackEmployee] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");


  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      setToken(res.data.token);
      alert("Login successful");
    } catch {
      alert("Login failed");
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmployees();
      fetchReviews();
      fetchFeedback();
    }
  }, [token]);

  const authHeader = {
    headers: { Authorization: token }
  };

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`, authHeader);
    setEmployees(res.data);
  };

  const fetchReviews = async () => {
    const res = await axios.get(`${API}/reviews`, authHeader);
    setReviews(res.data);
  };

  const fetchFeedback = async () => {
    const res = await axios.get(`${API}/feedback`, authHeader);
    setFeedbacks(res.data);
  };

  const addEmployee = async () => {
    if (!email.includes("@gmail.com")) {
      alert("Invalid email! Must include @gmail.com");
      return;
    }

    await axios.post(`${API}/employees`, { name, email }, authHeader);
    setName("");
    setEmail("");
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`, authHeader);
    fetchEmployees();
  };

  const createReview = async () => {
    await axios.post(`${API}/reviews`, {
      title,
      description,
      assigned_to: selectedEmployee,
    }, authHeader);

    setTitle("");
    setDescription("");
    setSelectedEmployee("");
    fetchReviews();
  };

  const deleteReview = async (id) => {
    await axios.delete(`${API}/reviews/${id}`, authHeader);
    fetchReviews();
  };

  const handleReviewChange = (reviewId) => {
    setSelectedReview(reviewId);

    const review = reviews.find(r => r.id == reviewId);
    if (review) {
      setFeedbackEmployee(review.assigned_to);
    }
  };

  const submitFeedback = async () => {
    await axios.post(`${API}/feedback`, {
      review_id: selectedReview,
      reviewer_id: feedbackEmployee,
      comment,
      rating,
    }, authHeader);

    setComment("");
    setRating("");
    fetchFeedback();
  };

  const deleteFeedback = async (id) => {
    await axios.delete(`${API}/feedback/${id}`, authHeader);
    fetchFeedback();
  };

  return (
    <div style={{ background: "#f1f5f9", minHeight: "100vh" }}>

      <div style={navStyle}>Employee Feedback App</div>

      {!token && (
        <div style={{ padding: "20px" }}>
          <h2>Login</h2>

          <input style={fieldStyle}
            placeholder="Email"
            onChange={(e) => setLoginEmail(e.target.value)}
          />

          <input style={fieldStyle}
            type="password"
            placeholder="Password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />

          <button style={buttonStyle} onClick={login}>
            Login
          </button>
        </div>
      )}

      {token && (
        <div style={{ padding: "20px" }}>

          <div style={{ display: "flex", gap: "20px" }}>

            <div style={cardStyle}>
              <h3>Add Employee</h3>

              <input style={fieldStyle} placeholder="Name"
                value={name} onChange={(e) => setName(e.target.value)} />

              <input style={fieldStyle} placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)} />

              <button style={buttonStyle} onClick={addEmployee}>
                Add Employee
              </button>

              <h4>Employees</h4>

              <ul style={{ listStyle: "none", padding: 0 }}>
                {employees.map((emp) => (
                  <li key={emp.id} style={listItem}>
                    <span><b>{emp.name}</b> ({emp.email})</span>
                    <button style={deleteBtn} onClick={() => deleteEmployee(emp.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div style={cardStyle}>
              <h3>Create Review</h3>

              <input style={fieldStyle} placeholder="Title"
                value={title} onChange={(e) => setTitle(e.target.value)} />

              <input style={fieldStyle} placeholder="Description"
                value={description} onChange={(e) => setDescription(e.target.value)} />

              <select style={fieldStyle}
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <button style={buttonStyle} onClick={createReview}>
                Create Review
              </button>

              <h4>Reviews</h4>

              {reviews.map((rev) => (
                <div key={rev.id} style={reviewBox}>
                  <div>
                    <b>
                      {employees.find(e => e.id == rev.assigned_to)?.name || "Unknown"}
                    </b>
                    {" - "}
                    {rev.title}
                  </div>

                  <button style={deleteBtn} onClick={() => deleteReview(rev.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, marginTop: "20px" }}>
            <h3>Submit Feedback</h3>

            <select style={fieldStyle}
              value={selectedReview}
              onChange={(e) => handleReviewChange(e.target.value)}
            >
              <option value="">Select Review</option>
              {reviews.map((rev) => (
                <option key={rev.id} value={rev.id}>
                  {rev.title}
                </option>
              ))}
            </select>

            <input
              style={fieldStyle}
              value={
                employees.find(emp => emp.id == feedbackEmployee)?.name || ""
              }
              disabled
            />

            <input style={fieldStyle} placeholder="Comment"
              value={comment} onChange={(e) => setComment(e.target.value)} />

            <input style={fieldStyle} placeholder="Rating (1-5)"
              value={rating} onChange={(e) => setRating(e.target.value)} />

            <button style={buttonStyle} onClick={submitFeedback}>
              Submit Feedback
            </button>

            <h3 style={{ marginTop: "20px" }}>Feedback List</h3>

            {feedbacks.map((f) => (
              <div key={f.id} style={reviewBox}>
                <div>
                  <b>{f.review_title}</b>
                  {" - "}
                  {f.comment}
                  {" | Rating: "}
                  {f.rating}
                </div>

                <button style={deleteBtn} onClick={() => deleteFeedback(f.id)}>
                  Delete
                </button>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}


const navStyle = {
  background: "darkblue",
  color: "#fff",
  padding: "15px",
  textAlign: "center",
  fontSize: "30px",
  fontWeight: "bold"
};

const cardStyle = {
  flex: 1,
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const fieldStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "10px"
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  marginBottom: "10px",
  background: "#f9fafb",
  borderRadius: "8px"
};

const reviewBox = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  background: "#f3f4f6",
  marginBottom: "8px",
  borderRadius: "6px"
};

export default App;