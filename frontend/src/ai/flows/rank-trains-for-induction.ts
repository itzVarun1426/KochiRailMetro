'use server';
/**
 * @fileOverview Ranks available trains for induction based on multiple factors.
 *
 * - rankTrainsForInduction - A function that ranks trains for induction.
 * - RankTrainsForInductionInput - The input type for the rankTrainsForInduction function.
 * - RankTrainsForInductionOutput - The return type for the rankTrainsForInduction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankTrainsForInductionInputSchema = z.object({
  trains: z
    .array(
      z.object({
        trainId: z.string().describe('The unique identifier of the train.'),
        fitnessCertificateStatus: z
          .string()
          .describe(
            'The status of the train fitness certificate (e.g., Valid, Expired).' // Fixed typo
          ),
        jobCardStatus: z
          .string()
          .describe('The status of the job card (e.g., Open, Completed).'),
        brandingPriority: z
          .number()
          .describe('The branding priority of the train (higher is more important).'),
        mileage: z.number().describe('The current mileage of the train.'),
        lastCleaningDate: z.string().describe('The last cleaning date of the train.'),
        stablingConstraints: z
          .string()
          .describe('Any stabling constraints for the train (related to accessibility).'),
        reliabilityScore: z.number().describe('The reliability score of the train (0-100%).'),
      })
    )
    .describe('An array of train objects with their respective attributes.'),
});

export type RankTrainsForInductionInput = z.infer<
  typeof RankTrainsForInductionInputSchema
>;

const RankTrainsForInductionOutputSchema = z.object({
  rankedTrains: z
    .array(
      z.object({
        trainId: z.string().describe('The unique identifier of the train.'),
        rank: z.number().describe('The rank of the train (lower is better).'),
        reasoning: z.string().describe('The reasoning for the assigned rank.'),
      })
    )
    .describe('An array of ranked train objects with their reasoning.'),
});

export type RankTrainsForInductionOutput = z.infer<
  typeof RankTrainsForInductionOutputSchema
>;

export async function rankTrainsForInduction(
  input: RankTrainsForInductionInput
): Promise<RankTrainsForInductionOutput> {
  return rankTrainsForInductionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankTrainsForInductionPrompt',
  input: {schema: RankTrainsForInductionInputSchema},
  output: {schema: RankTrainsForInductionOutputSchema},
  prompt: `You are a fleet manager responsible for ranking electric metro trains for induction based on several factors.

  Given the following trains and their attributes:

  {{#each trains}}
  Train ID: {{{trainId}}}
  Fitness Certificate Status: {{{fitnessCertificateStatus}}}
  Job Card Status: {{{jobCardStatus}}}
  Branding Priority: {{{brandingPriority}}}
  Mileage: {{{mileage}}}
  Last Cleaning Date: {{{lastCleaningDate}}}
  Stabling Constraints (Accessibility): {{{stablingConstraints}}}
  Reliability Score: {{{reliabilityScore}}}
  {{/each}}

  Rank the trains for induction, considering these factors:

  - **Fitness & Certificate Status:** Trains with valid certificates should be ranked higher.
  - **Maintenance (Job Card Status):** Trains with completed job cards should be ranked higher.
  - **Branding Priority:** Trains with higher branding priority should be ranked higher.
  - **Mileage:** Trains with lower mileage since their last induction should be ranked higher.
  - **Cleaning:** Trains that were cleaned more recently should be ranked higher.
  - **Accessibility (Stabling Constraints):** Trains with fewer stabling constraints should be ranked higher.
  - **Reliability:** Trains with a higher reliability score should be ranked higher.

  Provide a clear explanation for the ranking of each train.
  Ensure that the output is a valid JSON object that conforms to the RankTrainsForInductionOutputSchema.`,
});

const rankTrainsForInductionFlow = ai.defineFlow(
  {
    name: 'rankTrainsForInductionFlow',
    inputSchema: RankTrainsForInductionInputSchema,
    outputSchema: RankTrainsForInductionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
