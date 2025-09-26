'use server';
/**
 * @fileOverview This file defines a Genkit flow for running 'what-if' simulations to predict the impact of input conditions on train schedules.
 *
 * - runWhatIfSimulation - A function that runs the what-if simulation.
 * - RunWhatIfSimulationInput - The input type for the runWhatIfSimulation function.
 * - RunWhatIfSimulationOutput - The return type for the runWhatIfSimulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RunWhatIfSimulationInputSchema = z.object({
  maintenanceDelay: z.string().describe('Potential delays in maintenance activities (e.g., "HVAC repair on T-003 delayed by 2 hours").'),
  certificateRisk: z.string().describe('Risks related to certificate clearance (e.g., "T-007 has a 50% chance of failing inspection").'),
  cleaningSlot: z.string().describe('Availability of cleaning slots (e.g., "Washing line 1 occupied until 4 PM").'),
  trackClosure: z.string().describe('Any planned or unplanned track closures (e.g., "Mainline South closed for 1 hour").'),
  demand: z.string().describe('Passenger demand forecasts (e.g., "High demand expected for evening peak hours").'),
  weather: z.string().describe('Current or forecasted weather conditions (e.g., "Heavy rain expected").'),
});
export type RunWhatIfSimulationInput = z.infer<
  typeof RunWhatIfSimulationInputSchema
>;

const RunWhatIfSimulationOutputSchema = z.object({
  predictedScheduleImpact: z
    .string()
    .describe('The predicted impact on the train schedule.'),
  resourceAllocationChanges: z
    .string()
    .describe('The recommended changes to resource allocation.'),
  potentialDisruptions: z
    .string()
    .describe('A description of potential disruptions.'),
});
export type RunWhatIfSimulationOutput = z.infer<
  typeof RunWhatIfSimulationOutputSchema
>;

export async function runWhatIfSimulation(
  input: RunWhatIfSimulationInput
): Promise<RunWhatIfSimulationOutput> {
  return runWhatIfSimulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runWhatIfSimulationPrompt',
  input: {schema: RunWhatIfSimulationInputSchema},
  output: {schema: RunWhatIfSimulationOutputSchema},
  prompt: `You are a train schedule optimizer for an electric metro fleet. Given the following conditions, predict the impact on the train schedule, recommend changes to resource allocation, and describe potential disruptions.

Maintenance Delay: {{{maintenanceDelay}}}
Certificate Risk: {{{certificateRisk}}}
Cleaning Slot: {{{cleaningSlot}}}
Track Closure: {{{trackClosure}}}
Demand: {{{demand}}}
Weather: {{{weather}}}`,
});

const runWhatIfSimulationFlow = ai.defineFlow(
  {
    name: 'runWhatIfSimulationFlow',
    inputSchema: RunWhatIfSimulationInputSchema,
    outputSchema: RunWhatIfSimulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
