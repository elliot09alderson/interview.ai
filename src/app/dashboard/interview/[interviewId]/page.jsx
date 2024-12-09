"use client";

import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, use, useState } from "react";
import Webcam from "react-webcam";
function Interview({ params }) {
  const [interviewData, setInterviewData] = useState({});
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const interviewParams = use(params);
  useEffect(() => {
    console.log(interviewParams?.interviewId);
    getInterviewDetails();
  }, []);
  const getInterviewDetails = async () => {
    /**
     * Fetching Details from db
     */
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewParams.interviewId));

    if (result[0]) {
      setInterviewData(result[0]);
      console.log(result[0]);
    }
  };
  return (
    <div className="my-10 flex justify-center flex-col items-center px-24  ">
      <h2 className="font-bold text-3xl ">Lets Get Started</h2>
      <div className="my-6  grid lg:grid-cols-2 grid-cols-1 gap-20">
        <div className="flex flex-col  gap-5">
          <div className="flex flex-col my-5 p-5 rounded-lg border gap-5">
            <h2 className="'text-lg">
              <strong>Job Role / Job Position : </strong>
              {interviewData.jobPosition}
            </h2>
            <h2 className="'text-lg">
              <strong>Job Description / Tech Stack : </strong>
              {interviewData.jobDesc}
            </h2>
            <h2 className="'text-lg">
              <strong>Years of Experience : </strong>
              {interviewData.jobExperience}
            </h2>
          </div>
          <div className=" p-5 border rounded-lg border-yellow-300 bg-yellow-200 ">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb /> <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </h2>
          </div>
        </div>
        <div className=" flex flex-col  items-center justify-center">
          {webcamEnabled ? (
            <Webcam
              audio
              videoConstraints={{ width: 300, height: 300 }}
              onUserMedia={() => setWebcamEnabled(true)}
              onUserMediaError={(error) => {
                console.error("Error enabling webcam:", error);
                if (error.name === "NotAllowedError") {
                  alert("Camera and microphone access is required to proceed.");
                }
              }}
              style={{ height: 300, borderRadius: "50%", width: 300 }}
            />
          ) : (
            <div className="flex items-center justify-center flex-col">
              <WebcamIcon className="h-72 w-72 p-20 bg-secondary rounded-full border mb-6" />
              <Button
                variant="ghost"
                className="shadow-sm"
                onClick={() => {
                  setWebcamEnabled(true);
                  console.log("ASdadas");
                }}
              >
                Enable Webcam and Microphone
              </Button>
            </div>
          )}


          <div className="flex justify-end items-center w-full flex-col gap-5 mt-12">
            <Link
              href={`/dashboard/interview/${interviewParams?.interviewId}/start`}
            >
              <Button>Start Interview</Button>
            </Link>

            <Link
              href={`/dashboard/interview/${interviewParams?.interviewId}/test`}
            >
              <Button>test mic</Button>
            </Link>
          </div>
        </div>

      </div>


    </div>
  );
}

export default Interview;
