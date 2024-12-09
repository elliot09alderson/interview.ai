import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

const QuestionsSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {
  const textToSpeech = (text) => {
    if(!isSpeechActive()){

      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(speech);
        speech.onend = () => {
          console.log("Speech has completed.");
        };
      } else {
        alert(`Sorry, Your browser does not support text-to-speech synthesiis`);
      }
    }else{
      stopSpeech()
    }
  };

  const isSpeechActive = () => {
    if ("speechSynthesis" in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  };
  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop the speech synthesis
      console.log("Speech has been stopped.");
    }}
  return (
    mockInterviewQuestion && (
      <div className="p-5  border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((question, index) => {
              return (
                <h2
                  key={index}
                  className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
                    activeQuestionIndex === index
                      ? " bg-primary text-white "
                      : " bg-secondary "
                  }`}
                  onClick={() => setActiveQuestionIndex(index)}
                >
                  {" "}
                  Question # {index + 1}
                </h2>
              );
            })}
        </div>

        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        <Volume2
          className="cursor-pointer"
          onClick={() =>
            textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        />

        <div className="border rounded-lg p-5 text-sm gap-1 tracking-wider justify-center flex flex-col mt-12 bg-blue-100 ">
          <h2 className="flex gap-2 items-center text-blue-600 ">
            <Lightbulb />
            <strong>Note : </strong>
          </h2>
          <h2 className="text-sm text-blue-600 my-2">{process.env.NEXT_PUBLIC_INTERVIEW_INFORMATION
            }</h2>
        </div>
      </div>
    )
  );
};

export default QuestionsSection;
