"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { chatSession } from "@/utils/geminiAiModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
const AddNewInterview = () => {
  const Router = useRouter();
  const { user } = useUser();
  console.log(user?.primaryEmailAddress.emailAddress);
  const loggedInuser = user?.primaryEmailAddress.emailAddress;
  const [isLoading, setIsLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState(false);

  const [dialogOpen, setdialogOpen] = useState(false);
  const validationSchema = Yup.object({
    jobRole: Yup.string().required("Job role is required"),
    jobDescription: Yup.string().required("Job description is required"),
    experience: Yup.number()
      .typeError("Years of experience must be a number")
      .positive("Years of experience must be positive")
      .required("Years of experience is required"),
  });
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setdialogOpen(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={dialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-bold  text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <Formik
              initialValues={{
                jobRole: "",
                jobDescription: "",
                experience: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  setIsLoading(true);
                  console.log(values);
                  console.log(process.env.NEXT_PUBLIC_QUESTIONS_COUNT);
                  const inputPrompt = `Job Position :${values.jobRole} , Job Description : ${values.jobDescription} Experience:${values.experience} , Depending upon this info give me ${process.env.NEXT_PUBLIC_QUESTIONS_COUNT} interview qustion answer in JSON. give questoin and answer as field in json`;

                  const result = await chatSession.sendMessage(inputPrompt);
                  // Handle form submission
                  const mockJsonResponse = result.response
                    .text()
                    .replace("```json", "")
                    .replace("```", "");
                  setJsonResponse(mockJsonResponse);
                  console.log(mockJsonResponse);
                  setIsLoading(false);
                  if (mockJsonResponse) {
                    const resp = await db
                      .insert(MockInterview)
                      .values({
                        mockId: uuidv4(),
                        jsonMockResp: mockJsonResponse,
                        jobPosition: values.jobRole,
                        jobExperience: values.experience,
                        jobDesc: values.jobDescription,
                        createdBy: loggedInuser,
                        createdAt: moment().format("DD-MM-YYYY"),
                      })
                      .returning({ mockId: MockInterview.mockId });
                    console.log("inseted id ", resp);
                    if (resp) {
                      setdialogOpen(false);
                      Router.push(`/dashboard/interview/${resp[0].mockId}`);
                    }
                  } else {
                    console.log("ERROR while generating");
                  }
                } catch (error) {
                  console.log(error.message);
                  setIsLoading(false);
                }
              }}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div>
                    <span>
                      Add Details about your job position/role, Job description
                      and years of experience
                    </span>

                    <div className="flex flex-col w-full gap-4 mt-7">
                      <div className="flex flex-col gap-2">
                        <label htmlFor="jobRole">Job Role/Job Position</label>
                        <Field
                          name="jobRole"
                          as={Input}
                          placeholder="Ex. Full Stack Developer"
                        />
                        <ErrorMessage
                          name="jobRole"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="jobDescription">
                          Job Description/Tech Stack (in Short)
                        </label>
                        <Field
                          name="jobDescription"
                          as={Textarea}
                          placeholder="Ex. React, Nodejs, Mongodb etc."
                          required
                        />
                        <ErrorMessage
                          name="jobDescription"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label htmlFor="experience">Years of Experience</label>
                        <Field
                          name="experience"
                          as={Input}
                          placeholder="5"
                          type="number"
                          required
                        />
                        <ErrorMessage
                          name="experience"
                          component="div"
                          className="text-red-500 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-5 mt-6 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setdialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <LoaderCircle className="animate-spin" />
                            'Generating from AI'{" "}
                          </>
                        ) : (
                          "Start Interview"
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
