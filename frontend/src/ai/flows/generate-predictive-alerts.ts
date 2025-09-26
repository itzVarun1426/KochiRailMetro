// src/ai/flows/generate-predictive-alerts.ts
'use server';
/**
 * @fileOverview Predictive maintenance alerts based on AI analysis of train component conditions.
 *
 * - generatePredictiveAlerts - A function that generates predictive maintenance alerts for train components.
 * - GeneratePredictiveAlertsInput - The input type for the generatePredictiveAlerts function.
 * - GeneratePredictiveAlertsOutput - The return type for the generatePredictiveAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePredictiveAlertsInputSchema = z.object({
  trainComponentConditions: z
    .string()
    .describe(
      'A detailed description of the current conditions of various train components, including sensor readings, maintenance history, and observed anomalies.'
    ),
});
export type GeneratePredictiveAlertsInput = z.infer<
  typeof GeneratePredictiveAlertsInputSchema
>;

const GeneratePredictiveAlertsOutputSchema = z.object({
  predictiveAlerts: z
    .string()
    .describe(
      'A JSON array of predictive maintenance alerts, each including the affected component, a risk score (0-100), and recommended actions.'
    ),
});
export type GeneratePredictiveAlertsOutput = z.infer<
  typeof GeneratePredictiveAlertsOutputSchema
>;

export async function generatePredictiveAlerts(
  input: GeneratePredictiveAlertsInput
): Promise<GeneratePredictiveAlertsOutput> {
  return generatePredictiveAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePredictiveAlertsPrompt',
  input: {schema: GeneratePredictiveAlertsInputSchema},
  output: {schema: GeneratePredictiveAlertsOutputSchema},
  prompt: `You are an AI-powered predictive maintenance system for trains.

  Analyze the following train component conditions and generate a list of predictive maintenance alerts.

  Train Component Conditions:
  {{trainComponentConditions}}

  For each alert, include the affected component, a risk score (0-100), and recommended actions.
  IMPORTANT: Your response MUST be a valid JSON array of objects and nothing else. Do not include any explanatory text or markdown formatting. The output must be parsable by JSON.parse().
  `,
});

const generatePredictiveAlertsFlow = ai.defineFlow(
  {
    name: 'generatePredictiveAlertsFlow',
    inputSchema: GeneratePredictiveAlertsInputSchema,
    outputSchema: GeneratePredictiveAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
