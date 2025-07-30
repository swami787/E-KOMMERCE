import React, { useContext, useState } from 'react'
import ai from "../assets/ai.png"
import { shopDataContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import open from "../assets/open.mp3"
function Ai() {
  const { showSearch, setShowSearch } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);
  const openingSound = new Audio(open);

  function speak(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log("Speech Recognition not supported");
    // toast.error("Speech Recognition not supported on your browser");
    return null;
  }

  const recognition = new SpeechRecognition();

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript.trim().toLowerCase();
    console.log("Heard:", transcript);
    
    // your existing command checks...
  };

  recognition.onend = () => {
    setActiveAi(false);
  };

  return (
    <div
      className='fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]'
      onClick={() => {
        recognition.start();
        openingSound.play();
        setActiveAi(true);
      }}
    >
      <img
        src={ai}
        alt=""
        className={`w-[100px] cursor-pointer ${
          activeAi ? 'translate-x-[10%] translate-y-[-10%] scale-125' : 'translate-x-[0] translate-y-[0] scale-100'
        } transition-transform`}
        style={{
          filter: activeAi ? 'drop-shadow(0px 0px 30px #00d2fc)' : 'drop-shadow(0px 0px 20px black)',
        }}
      />
    </div>
  );
}


export default Ai
