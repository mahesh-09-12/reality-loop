"use server";

import { generateInitialAIResponse, type GenerateInitialAIResponseInput } from "@/ai/flows/generate-initial-ai-response";
import { generateRevisedAIResponse, type GenerateRevisedAIResponseInput } from "@/ai/flows/generate-revised-ai-response";
import type { Belief } from "@/components/reality-loop/shared";

export async function getInitialResponse(values: { question: string }) {
  try {
    const input: GenerateInitialAIResponseInput = {
      question: values.question,
    };
    const response = await generateInitialAIResponse(input);
    return { data: response, error: null };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error };
  }
}

export async function getRevisedResponse(values: { question: string; initialResponse: Belief; humanCorrection: string }) {
  try {
    if (!values.initialResponse) {
        throw new Error("Initial response is missing for revision.");
    }
    const input: GenerateRevisedAIResponseInput = {
      question: values.question,
      initialResponse: values.initialResponse,
      humanCorrection: values.humanCorrection,
    };
    const response = await generateRevisedAIResponse(input);
    return { data: response, error: null };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error };
  }
}

export async function saveAnalysis(data: {
  question: string;
  initialResponse: Belief;
  humanCorrection: string;
  revisedResponse: any;
}) {
  try {
    // This is a placeholder for saving data to Firestore.
    // In a real application, you would initialize the Firebase Admin SDK
    // and use it to write to your Firestore database.
    console.log("Saving belief loop to Firestore:", JSON.stringify(data, null, 2));

    // Example Firestore logic (commented out):
    // import { initializeApp, getApps } from 'firebase-admin/app';
    // import { getFirestore } from 'firebase-admin/firestore';
    //
    // if (!getApps().length) {
    //   initializeApp();
    // }
    // const db = getFirestore();
    // await db.collection('analyses').add(data);

    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "Failed to save belief loop.";
    return { success: false, error };
  }
}
