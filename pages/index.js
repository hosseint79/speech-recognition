import axios from "axios";
import { useState, useRef } from "react";
import { PuffLoader } from "react-spinners";

export default function Home() {
  const audioRef = useRef();
  const [loading, setLoading] = useState(false);
  const [finalResult, setFinalResult] = useState("");
  const [state, setstate] = useState(null);

  const updateSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  };

  const sendAudio = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", state);
      const result = await axios.post("http://127.0.0.1:5000/predict", data);
      console.log("show result ", result.data.keyword);
      setFinalResult(result.data.keyword);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fileOnChange = (e) => {
    setstate(e.target.files[0]);
    updateSong();
  };

  return (
    <>
      <div className="container">
        <div className="display">{finalResult || ""}</div>

        <div className="fileinput-container">
          <input id="fileId" onChange={fileOnChange} type="file" name="file" />
          <label htmlFor="fileId"> انتخاب فایل </label>
        </div>
        <div className="audio-container">
          {state && (
            <audio controls ref={audioRef}>
              <source src={URL.createObjectURL(state)} type="audio/wav" />
            </audio>
          )}
        </div>

        <span className="btn" onClick={sendAudio}>
          {loading ? (
            <PuffLoader color="#fff" loading={true} size={30} />
          ) : (
            "ارسال"
          )}
        </span>
      </div>
    </>
  );
}
