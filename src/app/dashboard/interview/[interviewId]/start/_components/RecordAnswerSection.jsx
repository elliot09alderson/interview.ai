"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiAiModel";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { Mic } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { toast } from "sonner";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQeustionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true, // Try disabling continuous recording
    useLegacyResults: false,
  });


  useEffect(() => {
   results.map((xyz)=>(
    setUserAnswer(prev=>prev+xyz?.transcript)
   ))
  }, [results]);



  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswerInDb();
      console.log("updating the answer")
    }
  }, [isRecording]);


  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      console.log(userAnswer)

    
      if(userAnswer?.length<10){
        setLoading(false)
        toast(`Error while saving your answer, please record again`)
        return;
      }
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswerInDb = async () => {

    console.log("saving to db ==>",userAnswer)
    const feedbackPrompt =
      "Question: " +
      mockInterviewQuestion[activeQeustionIndex]?.question +
      ", User Answer:" +
      userAnswer +
      ",Depends on question and user answer for give interview question " +
      " please give us ration for answer and feedback as area of improvement if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = await result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log("mockJsonResp", mockJsonResp);
    const jsonFeedbackResp = JSON.parse(mockJsonResp);
    try {
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQeustionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQeustionIndex]?.answer,
        userAns: userAnswer,
        feedback: jsonFeedbackResp?.feedback,
        rating: jsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast("your Answer recorded successfully");
      }
      setUserAnswer("");
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className=" flex flex-col w-[300px] h-[300px] justify-center items-center bg-secondary rounded-full  my-2">
        <Image
          alt="webcam img"
          src={"/webcam.png"}
          style={{
            width: "auto",
            height: "auto",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          width={200}
          priority="low"
          height={200}
          className="absolute object-cover rounded-full"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: 300,
            objectFit: "cover",
            zIndex: 10,
            borderRadius: "50%",
          }}
        />
      </div>
      <Button
        variant="outline"
        className="my-5"
        disabled={loading}
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2 content-center">
            <Mic /> 'Recording...'
          </h2>
        ) : results.length > 0 ? (
          " Record more... "
        ) : (
          " Record Answer"
        )}
      </Button>
      <Button onClick={() => console.log(userAnswer)}>Show user Answer</Button>
 
    </div>
  );
};

export default RecordAnswerSection;
