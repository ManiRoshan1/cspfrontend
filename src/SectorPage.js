import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const CONTACTS = {
  irrigation: [
    {
      role: "Irrigation Officer",
      dept: "Irrigation Department",
      phone: "+911234567890",
      email: "irrigation@municipality.example",
    },
    {
      role: "Deputy Irrigation",
      dept: "Deputy - Irrigation",
      phone: "+911098765432",
      email: "deputy-irrigation@municipality.example",
    },
  ],
  electricity: [
    {
      role: "Electricity Officer",
      dept: "Electricity Board",
      phone: "+911111111111",
      email: "electricity@municipality.example",
    },
  ],
  drainage: [
    {
      role: "Drainage Officer",
      dept: "Drainage Department",
      phone: "+912222222222",
      email: "drainage@municipality.example",
    },
  ],
  roads: [
    {
      role: "Roads Officer",
      dept: "Roads Department",
      phone: "+913333333333",
      email: "roads@municipality.example",
    },
  ],
};

export default function SectorPage({ sector }) {
  const { t, i18n } = useTranslation();

  const titleRef = useRef();
  const descRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [recognizing, setRecognizing] = useState(false);
  const [location, setLocation] = useState(null);
  const [recentReports, setRecentReports] = useState([]);

  // Language change handler
  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
  }

  // Fetch recent reports on page load
  useEffect(() => {
    fetch("http://csp.onrender.com/api/reports")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setRecentReports(data.reports);
        }
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, []);

  // Speech recognition setup
  let recognition;
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      setRecognizing(false);
    };

    recognition.onerror = (event) => {
      setRecognizing(false);
      alert(t("voiceRecognitionError") + ": " + event.error);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };
  }

  function handleVoiceClick() {
    if (!recognition) {
      alert(t("speechRecognitionNotSupported"));
      return;
    }
    if (recognizing) {
      recognition.stop();
      setRecognizing(false);
    } else {
      setRecognizing(true);
      recognition.start();
    }
  }

  function handleLocationClick() {
    if (!navigator.geolocation) {
      alert(t("geolocationNotSupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        alert(
          t("locationAttached") +
            `: Lat ${position.coords.latitude}, Lng ${position.coords.longitude}`
        );
      },
      (error) => {
        alert(t("errorGettingLocation") + ": " + error.message);
      }
    );
  }

  function handleClear() {
    titleRef.current.value = "";
    descRef.current.value = "";
    setPhoto(null);
    setChatInput("");
    setLocation(null);
  }

  function handlePhotoChange(e) {
    setPhoto(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", titleRef.current.value);
      formData.append("description", descRef.current.value);
      if (photo) formData.append("photo", photo);
      if (location) {
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);
      }
      formData.append("chatMessage", chatInput);

      const response = await fetch("http://csp.onrender.com/api/reports", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert(t("reportSent"));
        handleClear();
        const data = await response.json();
        setRecentReports((prevReports) => [data.report, ...prevReports]);
      } else {
        alert(t("reportSendFailed"));
      }
    } catch (error) {
      alert(t("reportSendFailed") + ": " + error.message);
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: "36px auto", padding: 24 }}>
      {/* Language Selector */}
      <div style={{ marginBottom: 20 }}>
        <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 18px #0001",
          padding: "30px 30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <span
            style={{
              background: sector.color,
              color: "#fff",
              borderRadius: 8,
              padding: "6px 18px",
              fontWeight: "bold",
              marginRight: 18,
              fontSize: 20,
            }}
          >
            {sector.name}
          </span>
          <h2 style={{ margin: 0 }}>{sector.name}</h2>
        </div>
        <p>{t("reportInstructions")}</p>

        <div style={{ display: "flex", gap: 40, marginTop: 26 }}>
          <div style={{ flex: 2 }}>
            <h3>{t("submitReport")}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder={t("title")}
                ref={titleRef}
                style={{ width: "100%", padding: 8, marginBottom: 8, fontSize: 16 }}
                required
              />
              <textarea
                placeholder={t("describeIssue")}
                ref={descRef}
                rows={3}
                style={{ width: "100%", padding: 8, marginBottom: 8, fontSize: 16, resize: "vertical" }}
                required
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <span>{t("photo")}</span>
                <input type="file" onChange={handlePhotoChange} />
                <button type="button" onClick={handleLocationClick} style={{ marginLeft: 8 }}>
                  {t("useLocation")}
                </button>
              </div>
              {location && (
                <div style={{ marginBottom: 10, fontSize: 14, color: "#555" }}>
                  {t("attachedLocation")}: Latitude {location.latitude.toFixed(4)}, Longitude {location.longitude.toFixed(4)}
                </div>
              )}
              <button type="submit" style={{ marginRight: 10 }}>
                {t("sendReport")}
              </button>
              <button type="button" onClick={handleClear}>
                {t("clear")}
              </button>
            </form>

            <div style={{ margin: "28px 0 8px", height: 1, background: "#eee" }} />

            <div>
              <input
                type="text"
                placeholder={t("typeMessage")}
                style={{ width: 300, padding: 8, fontSize: 16 }}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleVoiceClick}
                style={{
                  marginLeft: 8,
                  background: recognizing ? "#de4b4b" : undefined,
                  color: recognizing ? "#fff" : undefined,
                }}
              >
                {recognizing ? t("stop") : t("voice")}
              </button>
              <button type="button" style={{ marginLeft: 8 }}>
                {t("send")}
              </button>
            </div>

            <h4 style={{ marginTop: 30 }}>{t("recentReports")}</h4>
            {recentReports.length === 0 ? (
              <div>{t("noRecentReports")}</div>
            ) : (
              recentReports.map((report) => (
                <div key={report._id} style={{ padding: 12, borderBottom: "1px solid #ccc" }}>
                  <strong>{report.title}</strong>
                  <p>{report.description}</p>
                  {report.photoUrl && (
                    <img
                      src={`http://localhost:5000${report.photoUrl}`}
                      alt="Report"
                      style={{ maxWidth: 150, marginTop: 8 }}
                    />
                  )}
                  {report.latitude && report.longitude && (
                    <p>
                      {t("location")}: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </p>
                  )}
                  <p>{t("chatMessage")}: {report.chatMessage}</p>
                  <small>{new Date(report.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3>{t("contacts")}</h3>
            {CONTACTS[sector.id].map((contact) => (
              <div
                key={contact.role}
                style={{
                  background: "#faf8ff",
                  borderRadius: 14,
                  marginBottom: 18,
                  padding: "18px 16px",
                  boxShadow: "0 1px 5px #0001",
                }}
              >
                <div style={{ fontWeight: "bold" }}>{contact.role}</div>
                <div>{contact.dept}</div>
                <div>
                  {t("phone")}:{" "}
                  <a href={`tel:${contact.phone}`} style={{ color: sector.color, textDecoration: "underline" }}>
                    {contact.phone}
                  </a>
                </div>
                <div>
                  {t("email")}: <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
