"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, use } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";

const StartInterview = ({ params }) => {
  const myParams = use(params);
  const [interviewData, setInterviewData] = useState({});
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, myParams.interviewId));
    console.log(result);
    const jsonMockResp = JSON.parse(result[0]?.jsonMockResp);
    setInterviewData(result[0]);
    setMockInterviewQuestion(jsonMockResp);

  };
  return (
    <div className=" px-4 lg:px-24">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />

      </div>
      <div className="flex w-full justify-end gap-6">
        {activeQuestionIndex > 0 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question </Button>}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question </Button>}

        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && <Button>End Interview </Button>}

      </div>
    </div>
  );
};

export default StartInterview;
