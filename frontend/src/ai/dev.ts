import { config } from 'dotenv';
config();

import '@/ai/flows/generate-predictive-alerts.ts';
import '@/ai/flows/rank-trains-for-induction.ts';
import '@/ai/flows/predict-certificate-clearance.ts';
import '@/ai/flows/run-what-if-simulation.ts';