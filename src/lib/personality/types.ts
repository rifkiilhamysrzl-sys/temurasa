export type DimensionCode =
  | 'emotional_needs'
  | 'communication_style'
  | 'affection_expression'
  | 'independence_space'
  | 'future_commitment';

export interface PersonalityQuestionOption {
  id: string;
  label: string;
  sublabel?: string;
  // Archetype points awarded for selecting this option
  archetypePoints: Partial<Record<ArchetypeCode, number>>;
  // Dimension score weight (1-5 scale)
  dimensionWeight: number;
  marriageReadinessTag?: string;
}

export interface PersonalityQuestion {
  id: number; // 1 to 25
  dimension: DimensionCode;
  dimensionName: string;
  scenario: string;
  questionText: string;
  options: PersonalityQuestionOption[];
}

export type ArchetypeCode =
  | 'secure_lover'
  | 'best_friend'
  | 'deep_soul'
  | 'explorer'
  | 'home_builder'
  | 'affectionate_heart'
  | 'romantic_dreamer'
  | 'power_partner'
  | 'thoughtful_mind'
  | 'gentle_soul'
  | 'playful_heart'
  | 'independent_spirit'
  | 'emotional_connector'
  | 'future_planner'
  | 'supportive_partner'
  | 'loyal_heart'
  | 'creative_soul'
  | 'honest_communicator'
  | 'peace_keeper'
  | 'growth_partner';

export interface ArchetypeDefinition {
  code: ArchetypeCode;
  number: number;
  title: string; // e.g. "The Secure Lover"
  indonesianTitle: string; // e.g. "Pencinta yang Hangat & Stabil"
  tagline: string;
  quote: string;
  shortDescription: string;
  fullProfile: string;
  coreCharacteristics: string[];
  emotionalNeeds: string[];
  communicationStyle: string;
  relationshipStrengths: string[];
  potentialChallenges: string[];
  idealPartnerCharacteristics: string;
  recommendedPartnerTraits: string[];
  growthRecommendations: string[];
  relationshipBlueprint: string;
}

export interface DimensionScore {
  code: DimensionCode;
  name: string;
  score: number; // 0 - 100
  level: 'Berkembang' | 'Seimbang' | 'Sangat Kuat';
  description: string;
}

export interface MarriageReadinessReflection {
  targetHorizon: string; // '6_months' | '1_year' | '2_3_years' | '3_5_years' | 'no_target'
  targetHorizonLabel: string;
  emotionalReadinessText: string;
  financialReadinessText: string;
  commitmentReadinessText: string;
  conflictReadinessText: string;
  visionText: string;
  summaryReflection: string;
}

export interface FreePreviewData {
  primaryType: ArchetypeDefinition;
  secondaryType: ArchetypeDefinition;
  shortDescription: string;
  relationshipCharacteristics: string[];
  personalInsight: string;
  marriageHorizonLabel: string;
}

export interface FullReportData {
  // 1. Relationship Personality Profile
  personalityProfile: {
    title: string;
    primaryAnalysis: string;
    secondaryAnalysis: string;
    synergyAnalysis: string;
  };
  // 2. Ideal Partner Characteristics
  idealPartnerCharacteristics: {
    summary: string;
    temperament: string;
    chemistryType: string;
  };
  // 3. Recommended Partner Traits
  recommendedPartnerTraits: {
    title: string;
    traits: Array<{ trait: string; why: string }>;
  };
  // 4. Emotional Needs
  emotionalNeeds: {
    summary: string;
    primaryNeeds: string[];
    whatMakesYouFeelSafe: string;
  };
  // 5. Communication Compatibility
  communicationCompatibility: {
    yourStyle: string;
    bestComplementaryStyle: string;
    handlingConflictTogether: string;
  };
  // 6. Relationship Strengths
  relationshipStrengths: {
    summary: string;
    strengths: string[];
  };
  // 7. Potential Relationship Challenges
  potentialChallenges: {
    summary: string;
    blindSpots: Array<{ issue: string; remedy: string }>;
  };
  // 8. Marriage Readiness Reflection
  marriageReadiness: MarriageReadinessReflection;
  // 9. Personal Growth Recommendations
  personalGrowthRecommendations: {
    summary: string;
    actionableSteps: string[];
  };
  // 10. Ideal Relationship Blueprint
  idealRelationshipBlueprint: {
    vision: string;
    corePillars: string[];
    dailyRitual: string;
  };
}

export interface PersonalityTestResultData {
  testCode: string;
  userName: string;
  status: string;
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  primaryType: ArchetypeDefinition;
  secondaryType: ArchetypeDefinition;
  dimensionScores: DimensionScore[];
  freePreview: FreePreviewData;
  fullReport: FullReportData | null; // null if unpaid
  marriageReadiness: MarriageReadinessReflection;
  generatedAt: string;
}
